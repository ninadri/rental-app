import { useEffect, useState } from "react";
import type {
  MaintenanceRequest,
  MaintenanceStatus,
} from "../../../types/maintenance";
import {
  getSingleMaintenanceAdmin,
  updateMaintenanceStatusAdmin,
  closeMaintenanceAdmin,
  updateUrgencyAdmin,
  updateCategoryAdmin,
  addAdminNote,
} from "../../../lib/maintenanceAdminApi";

const STATUS_OPTIONS: MaintenanceStatus[] = [
  "pending",
  "in-progress",
  "completed",
  "closed",
];

const prettyStatus = (s: MaintenanceStatus) =>
  s === "in-progress" ? "In Progress" : s[0].toUpperCase() + s.slice(1);

export default function MaintenanceDetailsModal({
  id,
  open,
  onClose,
  onUpdated,
}: {
  id: string | null;
  open: boolean;
  onClose: () => void;
  onUpdated: (updated: MaintenanceRequest) => void;
}) {
  const [data, setData] = useState<MaintenanceRequest | null>(null);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [urgency, setUrgency] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!open || !id) return;
    setData(null);
    setUrgency("");
    setCategory("");
    setNote("");

    const run = async () => {
      setErr(null);
      setLoading(true);
      try {
        const res = await getSingleMaintenanceAdmin(id);
        setData(res);
        setUrgency(res.urgency ?? "");
        setCategory(res.category ?? "");
      } catch (e: any) {
        console.error(e);
        setErr(e?.response?.data?.message || "Failed to load request.");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [open, id]);

  const tenantLabel =
    data?.user && typeof data.user !== "string"
      ? `${data.user.name} • ${data.user.email}`
      : typeof data?.user === "string"
      ? data.user
      : "Tenant";

  const doStatus = async (next: MaintenanceStatus) => {
    if (!id || !data) return;
    setBusy(true);
    setErr(null);
    try {
      const updated =
        next === "closed"
          ? await closeMaintenanceAdmin(id)
          : await updateMaintenanceStatusAdmin(
              id,
              next as Exclude<MaintenanceStatus, "closed">
            );

      setData(updated);
      onUpdated(updated);
    } catch (e: any) {
      console.error(e);
      setErr(e?.response?.data?.message || "Failed to update status.");
    } finally {
      setBusy(false);
    }
  };

  const saveUrgency = async () => {
    if (!id || !data) return;
    setBusy(true);
    setErr(null);
    try {
      const updated = await updateUrgencyAdmin(id, urgency);
      setData(updated);
      onUpdated(updated);
    } catch (e: any) {
      console.error(e);
      setErr(e?.response?.data?.message || "Failed to update urgency.");
    } finally {
      setBusy(false);
    }
  };

  const saveCategory = async () => {
    if (!id || !data) return;
    setBusy(true);
    setErr(null);
    try {
      const updated = await updateCategoryAdmin(id, category);
      setData(updated);
      onUpdated(updated);
    } catch (e: any) {
      console.error(e);
      setErr(e?.response?.data?.message || "Failed to update category.");
    } finally {
      setBusy(false);
    }
  };

  const submitNote = async () => {
    if (!id || !data) return;
    if (!note.trim()) return;

    setBusy(true);
    setErr(null);
    try {
      const updated = await addAdminNote(id, note.trim());
      setNote("");
      setData(updated);
      onUpdated(updated);
    } catch (e: any) {
      console.error(e);
      setErr(e?.response?.data?.message || "Failed to add note.");
    } finally {
      setBusy(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-white rounded-xl shadow-xl border overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Maintenance Request
            </p>
            <h2 className="text-lg font-semibold text-slate-900">
              {data?.title || "—"}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="text-sm px-3 py-1 rounded border border-slate-300 hover:bg-slate-50"
            disabled={busy}
          >
            Close
          </button>
        </div>

        <div className="p-5 space-y-4">
          {loading ? (
            <p className="text-sm text-slate-600">Loading…</p>
          ) : err ? (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded">
              {err}
            </div>
          ) : !data ? (
            <p className="text-sm text-slate-600">No data.</p>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-slate-50 border rounded-lg p-4">
                  <p className="text-xs text-slate-500">Tenant</p>
                  <p className="text-sm text-slate-900 font-medium mt-1">
                    {tenantLabel}
                  </p>
                  <p className="text-xs text-slate-500 mt-2 break-all">
                    {data._id}
                  </p>
                </div>

                <div className="bg-slate-50 border rounded-lg p-4">
                  <p className="text-xs text-slate-500">Status</p>
                  <select
                    className="mt-2 w-full border rounded px-3 py-2 text-sm bg-white disabled:opacity-60"
                    value={data.status}
                    onChange={(e) =>
                      doStatus(e.target.value as MaintenanceStatus)
                    }
                    disabled={busy}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {prettyStatus(s)}
                      </option>
                    ))}
                  </select>

                  <div className="mt-3 flex gap-2">
                    <button
                      className="text-xs px-3 py-1 rounded border border-slate-300 hover:bg-white disabled:opacity-60"
                      onClick={() => doStatus("closed")}
                      disabled={busy || data.status === "closed"}
                    >
                      Archive (Close)
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white border rounded-lg p-4">
                <p className="text-xs text-slate-500">Description</p>
                <p className="text-sm text-slate-800 mt-2 whitespace-pre-wrap">
                  {data.description}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-white border rounded-lg p-4">
                  <p className="text-xs text-slate-500">Urgency</p>
                  <div className="mt-2 flex gap-2">
                    <input
                      className="flex-1 border rounded px-3 py-2 text-sm bg-slate-50 focus:bg-white"
                      value={urgency}
                      onChange={(e) => setUrgency(e.target.value)}
                      placeholder="e.g. low / medium / high"
                      disabled={busy}
                    />
                    <button
                      className="text-sm px-3 py-2 rounded border border-slate-300 hover:bg-slate-50 disabled:opacity-60"
                      onClick={saveUrgency}
                      disabled={busy}
                    >
                      Save
                    </button>
                  </div>
                </div>

                <div className="bg-white border rounded-lg p-4">
                  <p className="text-xs text-slate-500">Category</p>
                  <div className="mt-2 flex gap-2">
                    <input
                      className="flex-1 border rounded px-3 py-2 text-sm bg-slate-50 focus:bg-white"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="e.g. plumbing / electrical"
                      disabled={busy}
                    />
                    <button
                      className="text-sm px-3 py-2 rounded border border-slate-300 hover:bg-slate-50 disabled:opacity-60"
                      onClick={saveCategory}
                      disabled={busy}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white border rounded-lg p-4">
                <p className="text-xs text-slate-500">Admin Notes</p>

                <div className="mt-3 space-y-2">
                  {(data.adminNotes || []).length === 0 ? (
                    <p className="text-sm text-slate-600">No notes yet.</p>
                  ) : (
                    (data.adminNotes || []).map((n: any, idx: number) => (
                      <div
                        key={n._id || idx}
                        className="bg-slate-50 border rounded p-3"
                      >
                        <p className="text-sm text-slate-800 whitespace-pre-wrap">
                          {n.note ?? n}
                        </p>
                        {n.createdAt && (
                          <p className="text-xs text-slate-500 mt-1">
                            {new Date(n.createdAt).toLocaleString()}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-3 flex gap-2">
                  <input
                    className="flex-1 border rounded px-3 py-2 text-sm bg-slate-50 focus:bg-white"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Write a note for internal tracking…"
                    disabled={busy}
                  />
                  <button
                    className="text-sm px-3 py-2 rounded border border-slate-300 hover:bg-slate-50 disabled:opacity-60"
                    onClick={submitNote}
                    disabled={busy || !note.trim()}
                  >
                    Add
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
