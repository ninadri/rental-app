import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="font-semibold text-slate-900">
            Rental Property
          </Link>

          <div className="text-sm text-slate-600">
            Admin: <span className="font-medium">{user?.email}</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <h1 className="text-xl font-semibold text-slate-900">
            Admin Dashboard
          </h1>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            Manage tenants, maintenance requests, and announcements.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-white rounded-xl border shadow-sm p-5">
            <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">
              Users
            </p>
            <p className="text-sm text-slate-700 leading-relaxed">
              Create tenant/admin accounts and deactivate tenants.
            </p>
          </div>

          <div className="bg-white rounded-xl border shadow-sm p-5">
            <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">
              Maintenance
            </p>
            <p className="text-sm text-slate-700 leading-relaxed">
              Review and manage maintenance requests.
            </p>
          </div>

          <div className="bg-white rounded-xl border shadow-sm p-5">
            <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">
              Announcements
            </p>
            <p className="text-sm text-slate-700 leading-relaxed">
              Post announcements to tenants.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
