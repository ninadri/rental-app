import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useAuth();

  if (!user) return null; // should be guarded by route, but just in case

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white border-b">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
          <Link to="/" className="font-semibold">
            Rental Property
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-700">
              {user.name}{" "}
              <span className="text-xs uppercase text-slate-500 ml-1">
                ({user.role})
              </span>
            </span>
            <button
              className="text-xs px-3 py-1 rounded border border-slate-300 hover:bg-slate-200"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        <h2 className="text-xl font-semibold mb-2">Dashboard</h2>
        <p className="text-sm text-slate-600 mb-4">
          Welcome, <span className="font-medium">{user.name}</span>.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold mb-2 text-sm">Account</h3>
            <p className="text-sm text-slate-600 break-all">
              <span className="font-medium">Email:</span> {user.email}
            </p>
            <p className="text-sm text-slate-600">
              <span className="font-medium">Role:</span> {user.role}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold mb-2 text-sm">Next up</h3>
            <ul className="text-sm text-slate-600 list-disc list-inside space-y-1">
              <li>Account settings page (update name/email)</li>
              <li>Change password form</li>
              <li>Tenant maintenance requests</li>
              <li>Admin: manage tenants & deactivate</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
