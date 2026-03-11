const BASE = "/api";

async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(`${BASE}${url}`);
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || res.statusText);
  }
  return res.json();
}

async function mutator<T>(url: string, method: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || res.statusText);
  }
  return res.json();
}

export const api = {
  leads: {
    list: () => fetcher("/leads"),
    get: (id: string) => fetcher(`/leads/${id}`),
    update: (id: string, data: unknown) => mutator(`/leads/${id}`, "PATCH", data),
  },
  companies: {
    list: () => fetcher("/companies"),
    get: (id: string) => fetcher(`/companies/${id}`),
  },
  campaigns: {
    list: () => fetcher("/campaigns"),
    get: (id: string) => fetcher(`/campaigns/${id}`),
  },
  lists: {
    list: () => fetcher("/lists"),
    get: (id: string) => fetcher(`/lists/${id}`),
    create: (data: unknown) => mutator("/lists", "POST", data),
    update: (id: string, data: unknown) => mutator(`/lists/${id}`, "PATCH", data),
    delete: (id: string) => mutator(`/lists/${id}`, "DELETE"),
  },
  identities: {
    list: () => fetcher("/identities"),
  },
  inbox: {
    list: () => fetcher("/inbox"),
    get: (id: string) => fetcher(`/inbox/${id}`),
  },
  activity: {
    list: () => fetcher("/activity"),
  },
  analytics: {
    summary: () => fetcher("/analytics"),
  },
  playbook: {
    get: () => fetcher("/playbook"),
    update: (data: unknown) => mutator("/playbook", "PATCH", data),
  },
  find: {
    jobs: () => fetcher("/find/jobs"),
  },
  settings: {
    exclusionRules: () => fetcher("/settings/exclusion-rules"),
    updateRule: (id: string, data: unknown) => mutator(`/settings/exclusion-rules/${id}`, "PATCH", data),
    suppressions: () => fetcher("/settings/suppressions"),
  },
  integrations: {
    status: () => fetcher("/integrations"),
  },
  enrichment: {
    queue: () => fetcher("/enrichment/queue"),
    attempts: (leadId: string) => fetcher(`/enrichment/attempts/${leadId}`),
    allAttempts: () => fetcher("/enrichment/attempts-all"),
  },
  events: {
    byLead: (leadId: string) => fetcher(`/events/${leadId}`),
  },
};
