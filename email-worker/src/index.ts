import PostalMime from "postal-mime";

interface Env {
  EMAIL: SendEmail;
}

interface ParsedEmail {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
  messageId: string;
  inReplyTo: string | null;
  date: string;
}

const AUTO_REPLIES: Record<string, { name: string; subject: string; body: string }> = {
  "help@getmvx.cc": {
    name: "MVX Help",
    subject: "We received your message",
    body: `Thanks for reaching out to MVX Help.

We've received your message and will get back to you as soon as possible.

In the meantime, you can check our FAQ at https://getmvx.cc/faq

—
MVX Team`,
  },
  "info@getmvx.cc": {
    name: "MVX Info",
    subject: "Thanks for contacting us",
    body: `Thanks for your interest in MVX.

We've received your inquiry and our team will respond shortly.

—
MVX Team`,
  },
};

async function parseEmail(message: ForwardableEmailMessage): Promise<ParsedEmail> {
  const raw = await new Response(message.raw).arrayBuffer();
  const parsed = await PostalMime.parse(raw);

  return {
    from: message.from,
    to: message.to,
    subject: parsed.subject || "(no subject)",
    text: parsed.text || "",
    html: parsed.html || "",
    messageId: message.headers.get("message-id") || "",
    inReplyTo: message.headers.get("in-reply-to") || null,
    date: message.headers.get("date") || new Date().toISOString(),
  };
}

async function sendAutoReply(env: Env, message: ForwardableEmailMessage, email: ParsedEmail) {
  const config = AUTO_REPLIES[message.to];
  if (!config) return;

  const headers: Record<string, string> = {};
  if (email.messageId) {
    headers["In-Reply-To"] = email.messageId;
    headers["References"] = email.messageId;
  }

  await env.EMAIL.send({
    to: email.from,
    from: { email: message.to, name: config.name },
    subject: `Re: ${email.subject}`,
    text: config.body,
    html: `<div style="font-family: sans-serif; line-height: 1.6;">${config.body.replace(/\n/g, "<br>")}</div>`,
    headers,
  });
}

async function storeEmail(email: ParsedEmail, env: Env) {
  // Log for now — swap for D1/KV/R2 when ready
  console.log(JSON.stringify({
    event: "email_received",
    from: email.from,
    to: email.to,
    subject: email.subject,
    date: email.date,
    textLength: email.text.length,
  }));
}

export default {
  async email(message: ForwardableEmailMessage, env: Env, ctx: ExecutionContext): Promise<void> {
    const email = await parseEmail(message);

    // Store the email
    await storeEmail(email, env);

    // Send auto-reply
    ctx.waitUntil(sendAutoReply(env, message, email));

    // Forward to a destination (set your real address here or use env vars)
    // Uncomment and set the destination address:
    // await message.forward("your-real-inbox@gmail.com");

    console.log(`Processed email from ${email.from} to ${email.to}: ${email.subject}`);
  },

  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Health check
    if (url.pathname === "/health") {
      return new Response(JSON.stringify({ status: "ok", service: "mvx-email" }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Send email endpoint — POST /send
    if (url.pathname === "/send" && request.method === "POST") {
      try {
        const body = (await request.json()) as {
          to: string;
          from: string;
          fromName?: string;
          subject: string;
          text: string;
          html?: string;
        };

        const allowedSenders = ["help@getmvx.cc", "info@getmvx.cc"];
        if (!allowedSenders.includes(body.from)) {
          return new Response(
            JSON.stringify({ error: `Sender must be one of: ${allowedSenders.join(", ")}` }),
            { status: 403, headers: { "Content-Type": "application/json" } }
          );
        }

        const response = await env.EMAIL.send({
          to: body.to,
          from: { email: body.from, name: body.fromName || "MVX" },
          subject: body.subject,
          text: body.text,
          html: body.html || `<p>${body.text.replace(/\n/g, "<br>")}</p>`,
        });

        return new Response(JSON.stringify({ success: true, messageId: response.messageId }), {
          headers: { "Content-Type": "application/json" },
        });
      } catch (error: unknown) {
        const err = error as { code?: string; message?: string };
        return new Response(
          JSON.stringify({ error: err.message || "Send failed", code: err.code }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    return new Response("Not found", { status: 404 });
  },
} satisfies ExportedHandler<Env>;
