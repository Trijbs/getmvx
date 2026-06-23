const BREVO_API_URL = "https://api.brevo.com/v3";

function getApiKey(): string {
  const key = process.env.BREVO_API_KEY;
  if (!key) throw new Error("BREVO_API_KEY is not set");
  return key;
}

async function brevoFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BREVO_API_URL}${path}`, {
    ...options,
    headers: {
      "api-key": getApiKey(),
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(`Brevo API error ${res.status}: ${JSON.stringify(body)}`);
  }

  return res.json() as Promise<T>;
}

// ── Contacts ──────────────────────────────────────────────

export interface BrevoContact {
  email: string;
  firstName?: string;
  lastName?: string;
  attributes?: Record<string, unknown>;
  listIds?: number[];
  updateEnabled?: boolean;
}

export async function createContact(contact: BrevoContact) {
  return brevoFetch<{ id: string }>("/contacts", {
    method: "POST",
    body: JSON.stringify({
      email: contact.email,
      attributes: {
        FIRSTNAME: contact.firstName ?? "",
        LASTNAME: contact.lastName ?? "",
        ...contact.attributes,
      },
      listIds: contact.listIds ?? [],
      updateEnabled: contact.updateEnabled ?? true,
    }),
  });
}

export async function updateContact(
  email: string,
  data: { firstName?: string; lastName?: string; attributes?: Record<string, unknown>; listIds?: number[] }
) {
  return brevoFetch<void>(`/contacts/${encodeURIComponent(email)}`, {
    method: "PUT",
    body: JSON.stringify({
      attributes: {
        ...(data.firstName !== undefined && { FIRSTNAME: data.firstName }),
        ...(data.lastName !== undefined && { LASTNAME: data.lastName }),
        ...data.attributes,
      },
      ...(data.listIds && { listIds: data.listIds }),
    }),
  });
}

export async function deleteContact(email: string) {
  return brevoFetch<void>(`/contacts/${encodeURIComponent(email)}`, {
    method: "DELETE",
  });
}

export async function getContact(email: string) {
  return brevoFetch<{
    email: string;
    id: string;
    emailBlacklisted: boolean;
    smsBlacklisted: boolean;
    attributes: Record<string, unknown>;
    listIds: number[];
  }>(`/contacts/${encodeURIComponent(email)}`);
}

// ── Lists ─────────────────────────────────────────────────

export interface BrevoList {
  id: number;
  name: string;
  totalSubscribers: number;
}

export async function getLists(limit = 50, offset = 0) {
  return brevoFetch<{ lists: BrevoList[]; count: number }>("/contacts/lists", {
    method: "GET",
  });
}

export async function createList(name: string, folderId?: number) {
  return brevoFetch<{ id: number }>("/contacts/lists", {
    method: "POST",
    body: JSON.stringify({ name, folderId }),
  });
}

// ── Transactional Email ───────────────────────────────────

export interface SendEmailParams {
  to: { email: string; name?: string }[];
  sender?: { email: string; name?: string };
  subject: string;
  htmlContent?: string;
  textContent?: string;
  templateId?: number;
  params?: Record<string, unknown>;
  tags?: string[];
  replyTo?: { email: string; name?: string };
}

export async function sendTransactionalEmail(params: SendEmailParams) {
  return brevoFetch<{ messageId: string }>("/smtp/email", {
    method: "POST",
    body: JSON.stringify({
      sender: params.sender ?? {
        email: "noreply@getmvx.cc",
        name: "MVX",
      },
      to: params.to,
      subject: params.subject,
      htmlContent: params.htmlContent,
      textContent: params.textContent,
      templateId: params.templateId,
      params: params.params,
      tags: params.tags,
      replyTo: params.replyTo,
    }),
  });
}

// ── Email Campaigns ───────────────────────────────────────

export interface CampaignParams {
  name: string;
  subject: string;
  sender: { email: string; name?: string };
  htmlContent: string;
  textContent?: string;
  listIds: number[];
  scheduledAt?: string;
  tags?: string[];
}

export async function createCampaign(params: CampaignParams) {
  return brevoFetch<{ campaignId: number }>("/emailCampaigns", {
    method: "POST",
    body: JSON.stringify({
      name: params.name,
      subject: params.subject,
      sender: params.sender,
      htmlContent: params.htmlContent,
      textContent: params.textContent,
      recipients: { listIds: params.listIds },
      scheduledAt: params.scheduledAt,
      tag: params.tags?.[0],
    }),
  });
}

export async function sendCampaign(campaignId: number) {
  return brevoFetch<void>(`/emailCampaigns/${campaignId}/sendNow`, {
    method: "POST",
  });
}

export async function getCampaigns(limit = 50, offset = 0) {
  return brevoFetch<{
    campaigns: Array<{
      id: number;
      name: string;
      subject: string;
      status: string;
      scheduledAt: string;
      statistics: { globalStats: { sent: number; delivered: number; opened: number; clicked: number } };
    }>;
    count: number;
  }>(`/emailCampaigns?limit=${limit}&offset=${offset}`);
}
