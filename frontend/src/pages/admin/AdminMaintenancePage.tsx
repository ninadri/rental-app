import { useEffect, useMemo, useState } from "react";
import type {
  MaintenanceRequest,
  MaintenanceStatus,
} from "../../types/maintenance";
import {
  addAdminNote,
  closeMaintenanceAdmin,
  getAllMaintenanceAdmin,
  getClosedMaintenanceAdmin,
  getOpenMaintenanceAdmin,
  updateMaintenanceStatusAdmin,
} from "../../lib/maintenanceAdminApi";
import MaintenanceDetailsModal from "./components/MaintenanceDetailsModal";

type ViewMode = "all" | "open" | "closed";

const STATUS_OPTIONS: MaintenanceStatus[] = [
  "pending",
  "in-progress",
  "completed",
  "closed",
];

const prettyStatus = (s: MaintenanceStatus) => {
  if (s === "in-progress") return "In Progress";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const AdminMaintenancePage = () => {
  const [items, setItems] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [view, setView] = useState<ViewMode>("open");
  const [q, setQ] = useState("");

  const [busyId, setBusyId] = useState<string | null>(null);

  // ✅ modal state MUST be inside component
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const load = async (mode: ViewMode = view) => {
    setErr(null);
    setLoading(true);
    try {
      const data =
        mode === "all"
          ? await getAllMaintenanceAdmin()
          : mode === "closed"
          ? await getClosedMaintenanceAdmin()
          : await getOpenMaintenanceAdmin();

      setItems(data);
    } catch (e: any) {
      console.error(e);
      setErr(
        e?.response?.data?.message || "Failed to load maintenance requests."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(view);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return items
      .filter((r) => {
        if (!query) return true;
        const userEmail = typeof r.user === "string" ? "" : r.user?.email || "";
        const userName = typeof r.user === "string" ? "" : r.user?.name || "";
        return (
          r.title.toLowerCase().includes(query) ||
          r.description.toLowerCase().includes(query) ||
          userEmail.toLowerCase().includes(query) ||
          userName.toLowerCase().includes(query) ||
          r._id.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => {
        const ad = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bd = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bd - ad;
      });
  }, [items, q]);

  const onChangeStatus = async (id: string, next: MaintenanceStatus) => {
    setBusyId(id);
    setErr(null);

    setItems((prev) =>
      prev.map((r) => (r._id === id ? { ...r, status: next } : r))
    );

    try {
      if (next === "closed") {
        const updated = await closeMaintenanceAdmin(id);
        if (view === "open") {
          setItems((prev) => prev.filter((r) => r._id !== id));
        } else {
          setItems((prev) => prev.map((r) => (r._id === id ? updated : r)));
        }
      } else {
        const updated = await updateMaintenanceStatusAdmin(id, next);
        setItems((prev) => prev.map((r) => (r._id === id ? updated : r)));
      }
    } catch (e: any) {
      console.error(e);
      setErr(e?.response?.data?.message || "Failed to update status.");
      await load(view);
    } finally {
      setBusyId(null);
    }
  };

  const onAddNote = async (id: string) => {
    const note = prompt("Add admin note:");
    if (!note?.trim()) return;

    setBusyId(id);
    setErr(null);

    try {
      const updated = await addAdminNote(id, note.trim());
      setItems((prev) => prev.map((r) => (r._id === id ? updated : r)));
    } catch (e: any) {
      console.error(e);
      setErr(e?.response?.data?.message || "Failed to add note.");
      await load(view);
    } finally {
      setBusyId(null);
    }
  };

  const TabButton = ({ label, mode }: { label: string; mode: ViewMode }) => (
    <button
      onClick={() => setView(mode)}
      className={`text-sm px-3 py-2 rounded-md border ${
        view === mode
          ? "bg-slate-900 text-white border-slate-900"
          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
      }`}
      disabled={loading}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">
              Maintenance
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Review tenant requests and update statuses.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <TabButton label="Open" mode="open" />
            <TabButton label="Closed" mode="closed" />
            <TabButton label="All" mode="all" />

            <button
              onClick={() => load(view)}
              className="text-sm px-4 py-2 rounded-md border border-slate-300 hover:bg-slate-50"
              disabled={loading}
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="mt-5">
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Search
          </label>
          <input
            className="w-full border rounded px-3 py-2 text-sm bg-slate-50 focus:bg-white"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search title, description, tenant name/email, request id…"
          />
        </div>

        {err && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded">
            {err}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 text-sm text-slate-600">Loading requests…</div>
        ) : filtered.length === 0 ? (
          <div className="p-6 text-sm text-slate-600">No requests found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="text-left font-medium text-slate-600 px-4 py-3">
                    Tenant
                  </th>
                  <th className="text-left font-medium text-slate-600 px-4 py-3">
                    Title
                  </th>
                  <th className="text-left font-medium text-slate-600 px-4 py-3">
                    Status
                  </th>
                  <th className="text-left font-medium text-slate-600 px-4 py-3">
                    Created
                  </th>
                  <th className="text-right font-medium text-slate-600 px-4 py-3">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((r) => {
                  const tenantLabel =
                    typeof r.user === "string"
                      ? r.user
                      : `${r.user?.name || "Tenant"} • ${r.user?.email || ""}`;

                  const disableRow = busyId === r._id;

                  return (
                    <tr
                      key={r._id}
                      className="border-b last:border-b-0 hover:bg-slate-50 cursor-pointer"
                      onClick={() => {
                        setSelectedId(r._id);
                        setDetailsOpen(true);
                      }}
                    >
                      <td className="px-4 py-3 text-slate-700">
                        <div className="font-medium">{tenantLabel}</div>
                        <div className="text-xs text-slate-500 break-all">
                          {r._id}
                        </div>
                      </td>

                      <td className="px-4 py-3 text-slate-800">
                        <div className="font-medium">{r.title}</div>
                        <div className="text-xs text-slate-600 line-clamp-2 mt-1">
                          {r.description}
                        </div>
                      </td>

                      <td
                        className="px-4 py-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <select
                          className="border rounded px-2 py-1 text-sm bg-slate-50 focus:bg-white disabled:opacity-60"
                          value={r.status}
                          onChange={(e) =>
                            onChangeStatus(
                              r._id,
                              e.target.value as MaintenanceStatus
                            )
                          }
                          disabled={disableRow}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                              {prettyStatus(s)}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="px-4 py-3 text-slate-700">
                        {r.createdAt
                          ? new Date(r.createdAt).toLocaleString()
                          : "—"}
                      </td>

                      <td
                        className="px-4 py-3 text-right space-x-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          className="text-xs px-3 py-1 rounded border border-slate-300 hover:bg-slate-50 disabled:opacity-60"
                          onClick={() => onAddNote(r._id)}
                          disabled={disableRow}
                          title="Add admin note"
                        >
                          Note
                        </button>

                        <button
                          className="text-xs px-3 py-1 rounded border border-slate-300 hover:bg-slate-50 disabled:opacity-60"
                          onClick={() => onChangeStatus(r._id, "closed")}
                          disabled={disableRow || r.status === "closed"}
                          title="Archive (soft close)"
                        >
                          Close
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ✅ Modal */}
      <MaintenanceDetailsModal
        id={selectedId}
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        onUpdated={(updated) => {
          setItems((prev) =>
            prev.map((x) => (x._id === updated._id ? updated : x))
          );
        }}
      />
    </div>
  );
};

export default AdminMaintenancePage;
