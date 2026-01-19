import api from "./apiClient";
import type {
  MaintenanceRequest,
  MaintenanceStatus,
} from "../types/maintenance";

const ADMIN_BASE = "/admin/maintenance";

type ListResponse = MaintenanceRequest[] | { requests: MaintenanceRequest[] };

function normalizeList(data: ListResponse): MaintenanceRequest[] {
  return Array.isArray(data) ? data : data.requests ?? [];
}

export async function getAllMaintenanceAdmin(): Promise<MaintenanceRequest[]> {
  const res = await api.get<ListResponse>(`${ADMIN_BASE}/all`);
  return normalizeList(res.data);
}

export async function getOpenMaintenanceAdmin(): Promise<MaintenanceRequest[]> {
  const res = await api.get<ListResponse>(`${ADMIN_BASE}/open`);
  return normalizeList(res.data);
}

export async function getClosedMaintenanceAdmin(): Promise<
  MaintenanceRequest[]
> {
  const res = await api.get<ListResponse>(`${ADMIN_BASE}/closed`);
  return normalizeList(res.data);
}

export async function getSingleMaintenanceAdmin(
  id: string
): Promise<MaintenanceRequest> {
  const res = await api.get<MaintenanceRequest>(`${ADMIN_BASE}/${id}`);
  return res.data;
}

export async function updateMaintenanceStatusAdmin(
  id: string,
  status: Exclude<MaintenanceStatus, "closed">
): Promise<MaintenanceRequest> {
  const res = await api.put<MaintenanceRequest>(`${ADMIN_BASE}/${id}/status`, {
    status,
  });
  return res.data;
}

export async function closeMaintenanceAdmin(
  id: string
): Promise<MaintenanceRequest> {
  const res = await api.put<MaintenanceRequest>(`${ADMIN_BASE}/${id}/close`);
  return res.data;
}

export async function updateUrgencyAdmin(
  id: string,
  urgency: string
): Promise<MaintenanceRequest> {
  const res = await api.put<MaintenanceRequest>(`${ADMIN_BASE}/${id}/urgency`, {
    urgency,
  });
  return res.data;
}

export async function updateCategoryAdmin(
  id: string,
  category: string
): Promise<MaintenanceRequest> {
  const res = await api.put<MaintenanceRequest>(
    `${ADMIN_BASE}/${id}/category`,
    { category }
  );
  return res.data;
}

export async function addAdminNote(
  id: string,
  note: string
): Promise<MaintenanceRequest> {
  const res = await api.post<MaintenanceRequest>(`${ADMIN_BASE}/${id}/notes`, {
    note,
  });
  return res.data;
}
