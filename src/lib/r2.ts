import { createHmac, createHash } from "crypto";

function hmacSha256(key: Buffer | string, data: string): Buffer {
  return createHmac("sha256", key).update(data).digest();
}

/**
 * Generate a presigned PUT URL for Cloudflare R2 (AWS SigV4, no SDK needed).
 * Returns { uploadUrl, publicUrl }.
 */
export function getPresignedPutUrl(
  key: string,
  contentType: string,
  expiresIn = 300
): { uploadUrl: string; publicUrl: string } {
  const accountId = process.env.R2_ACCOUNT_ID ?? "";
  const accessKeyId = process.env.R2_ACCESS_KEY_ID ?? "";
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY ?? "";
  const bucketName = process.env.R2_BUCKET_NAME ?? "mvx-files";
  const publicBase = process.env.R2_PUBLIC_URL ?? "";

  const host = `${accountId}.r2.cloudflarestorage.com`;
  const region = "auto";
  const service = "s3";

  const now = new Date();
  const datestamp = now.toISOString().slice(0, 10).replace(/-/g, "");
  const amzdate = now.toISOString().replace(/[:-]/g, "").replace(/\.\d+/, "");

  const credentialScope = `${datestamp}/${region}/${service}/aws4_request`;
  const credential = `${accessKeyId}/${credentialScope}`;

  const params = new URLSearchParams({
    "X-Amz-Algorithm": "AWS4-HMAC-SHA256",
    "X-Amz-Content-Sha256": "UNSIGNED-PAYLOAD",
    "X-Amz-Credential": credential,
    "X-Amz-Date": amzdate,
    "X-Amz-Expires": String(expiresIn),
    "X-Amz-SignedHeaders": "content-type;host",
  });

  const canonicalUri = `/${bucketName}/${key}`;
  const canonicalQuerystring = params.toString();
  const canonicalHeaders = `content-type:${contentType}\nhost:${host}\n`;
  const signedHeaders = "content-type;host";

  const canonicalRequest = [
    "PUT",
    canonicalUri,
    canonicalQuerystring,
    canonicalHeaders,
    signedHeaders,
    "UNSIGNED-PAYLOAD",
  ].join("\n");

  const hashedCanonical = createHash("sha256").update(canonicalRequest).digest("hex");

  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzdate,
    credentialScope,
    hashedCanonical,
  ].join("\n");

  const signingKey = hmacSha256(
    hmacSha256(
      hmacSha256(
        hmacSha256(`AWS4${secretAccessKey}`, datestamp),
        region
      ),
      service
    ),
    "aws4_request"
  );

  const signature = createHmac("sha256", signingKey)
    .update(stringToSign)
    .digest("hex");

  params.set("X-Amz-Signature", signature);

  const uploadUrl = `https://${host}/${bucketName}/${key}?${params.toString()}`;
  const publicUrl = `${publicBase}/${key}`;

  return { uploadUrl, publicUrl };
}
