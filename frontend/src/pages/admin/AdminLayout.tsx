import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminLayout = () => {
  const { user, logout } = useAuth();

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm px-3 py-2 rounded-md border ${
      isActive
        ? "bg-slate-900 text-white border-slate-900"
        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
    }`;

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <Link to="/" className="font-semibold text-slate-900">
            Rental Property
          </Link>

          <div className="flex items-center gap-3">
            <div className="text-sm text-slate-600">
              Admin: <span className="font-medium">{user?.email}</span>
            </div>

            <button
              className="text-xs px-3 py-1 rounded border border-slate-300 hover:bg-slate-200"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <NavLink to="/admin" end className={navLinkClass}>
            Overview
          </NavLink>
          <NavLink to="/admin/maintenance" className={navLinkClass}>
            Maintenance
          </NavLink>
          <NavLink to="/admin/announcements" className={navLinkClass}>
            Announcements
          </NavLink>
          <NavLink to="/admin/tenants" className={navLinkClass}>
            Tenants
          </NavLink>
        </div>

        {/* 👇 nested pages render here */}
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
