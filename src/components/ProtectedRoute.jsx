import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ allowedRoles }) {
  const { user, role, loading, profileError, retryFetchProfile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  // Guest: redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User exists but profile not loaded yet — still loading
  if (role === null && loading === false && profileError === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-500">Memuat profil...</p>
        </div>
      </div>
    );
  }

  // Profile fetch failed — user exists but no profile found
  if (role === null && profileError) {
    // If this is an auth route (login, register), allow access
    if (location.pathname === "/login" || location.pathname === "/register") {
      return <Outlet />;
    }

    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-md max-w-md text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Profil Tidak Ditemukan
          </h2>
          <p className="text-gray-500 mb-4">
            Akun Anda belum memiliki profil. Ini mungkin terjadi jika Anda
            mendaftar sebelum sistem database diinisialisasi.
          </p>
          <p className="text-sm text-gray-400 mb-6">
            Error: {profileError}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={retryFetchProfile}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition"
            >
              Coba Lagi
            </button>
            <button
              onClick={async () => {
                await signOut();
                navigate("/login");
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If roles are specified, check if user's role is allowed
  if (allowedRoles && !allowedRoles.includes(role)) {
    // If member tries to access admin page, redirect to member dashboard
    if (role === "member") {
      return <Navigate to="/dashboard-member" replace />;
    }
    // If admin tries to access member page, redirect to admin dashboard
    if (role === "admin") {
      return <Navigate to="/" replace />;
    }
    // Fallback: redirect to login
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
