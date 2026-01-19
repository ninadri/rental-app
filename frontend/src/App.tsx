import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";
import DashboardPage from "./pages/Dashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminRoute from "./pages/routes/AdminRoute";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminMaintenancePage from "./pages/admin/AdminMaintenancePage";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-600 text-lg">Loading...</p>
      </div>
    );
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route
          path="/login"
          element={
            user ? (
              <Navigate
                to={user.role === "admin" ? "/admin" : "/dashboard"}
                replace
              />
            ) : (
              <LoginPage />
            )
          }
        />

        <Route
          path="/dashboard"
          element={user ? <DashboardPage /> : <Navigate to="/login" replace />}
        />

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="maintenance" element={<AdminMaintenancePage />} />
          <Route
            path="announcements"
            element={<div>Announcements (next)</div>}
          />
          <Route path="tenants" element={<div>Tenants (next)</div>} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
