import { Client, Partner, SEOChecklist } from '@/types';

const API = '/api';

async function fetchJSON<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status}: ${text}`);
  }
  return res.json();
}

// ── Clients ────────────────────────────────────────────────────────

export function fetchClients(partnerId?: string): Promise<Client[]> {
  const q = partnerId ? `?partnerId=${partnerId}` : '';
  return fetchJSON<Client[]>(`/clients${q}`);
}

export function fetchClient(id: string): Promise<Client> {
  return fetchJSON<Client>(`/clients/${id}`);
}

export function createClient(data: Omit<Client, 'id' | 'createdAt' | 'updatedAt' | 'partnerName'>): Promise<Client> {
  return fetchJSON<Client>('/clients', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateClient(id: string, data: Partial<Client>): Promise<Client> {
  return fetchJSON<Client>(`/clients/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteClientAPI(id: string): Promise<void> {
  return fetchJSON<void>(`/clients/${id}`, { method: 'DELETE' });
}

export function updateClientSEO(id: string, seoChecklist: Partial<SEOChecklist>): Promise<Client> {
  return fetchJSON<Client>(`/clients/${id}/seo`, {
    method: 'PUT',
    body: JSON.stringify({ seoChecklist }),
  });
}

// ── Partners ───────────────────────────────────────────────────────

export function fetchPartners(): Promise<Partner[]> {
  return fetchJSON<Partner[]>('/partners');
}

export function createPartner(data: { name: string; templateType?: string; templateRepo?: string; description?: string }): Promise<Partner> {
  return fetchJSON<Partner>('/partners', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updatePartner(id: string, data: Partial<Partner>): Promise<Partner> {
  return fetchJSON<Partner>(`/partners/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deletePartnerAPI(id: string): Promise<void> {
  return fetchJSON<void>(`/partners/${id}`, { method: 'DELETE' });
}

// ── Settings ───────────────────────────────────────────────────────

export function fetchSettings(): Promise<{ activePartnerId: string | null }> {
  return fetchJSON<{ activePartnerId: string | null }>('/settings');
}

export function updateSettings(data: { activePartnerId: string }): Promise<{ activePartnerId: string }> {
  return fetchJSON<{ activePartnerId: string }>('/settings', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}
