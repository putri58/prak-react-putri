import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./assets/tailwind.css";
// import Dashboard from "./pages/Dashboard";
// import Orders from "./pages/Orders";
// import Customers from "./pages/Customer";
// import NotFound from "./pages/NotFound";
// import Error400 from "./pages/Error400";
// import Error401 from "./pages/Error401";
// import Error403 from "./pages/Error403";
// import MainLayout from "./layouts/MainLayout";
// import Login from "./pages/pages/Login";
// import Register from "./pages/pages/Register";
// import Forgot from "./pages/pages/Forgot";
// import AuthLayout from "./layouts/AuthLayout";
import React, { Suspense } from "react";
import Loading from "./components/Loading";
// import Products from "./pages/Products";

const Dashboard = React.lazy(() => import("./pages/Dashboard"))
const DashboardMember = React.lazy(() => import("./pages/DashboardMember"))
const Orders = React.lazy(() => import("./pages/Orders"))
const Customers = React.lazy(() => import("./pages/Customer"))
const Products = React.lazy(() => import("./pages/Products"))
const Note = React.lazy(() => import("./pages/Note"))
const ShopPage = React.lazy(() => import("./pages/ShopPage"))
const NotFound = React.lazy(() => import("./pages/NotFound"))
const Error400 = React.lazy(() => import("./pages/Error400"))
const Error401 = React.lazy(() => import("./pages/Error401"))
const Error403 = React.lazy(() => import("./pages/Error403"))
const MainLayout = React.lazy(() => import("./layouts/MainLayout"))
const Login = React.lazy(() => import("./pages/auth/Login"))
const Register = React.lazy(() => import("./pages/auth/Register"))
const Forgot = React.lazy(() => import("./pages/auth/Forgot"))
const AuthLayout = React.lazy(() => import("./layouts/AuthLayout"))
const ProductDetail = React.lazy(() => import("./pages/ProductDetail"))
const Components = React.lazy(() => import("./pages/Components"))
const FiturXyz = React.lazy(() => import("./pages/FiturXyz"))
const ProtectedRoute = React.lazy(() => import("./components/ProtectedRoute"))

function App() {
  return (
    <Suspense fallback={<Loading/>}>
          <Routes>
            {/* Auth routes — accessible to everyone (including guests) */}
            <Route element={<AuthLayout/>}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register/>} />
              <Route path="/forgot" element={<Forgot/>} />
            </Route>

            {/* Protected routes — admin only */}
            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route element={<MainLayout/>}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/components" element={<Components />} />
                <Route path="/fitur-xyz" element={<FiturXyz />} />
                <Route path="/notes" element={<Note />} />
              </Route>
            </Route>

            {/* Protected routes — admin & member */}
            <Route element={<ProtectedRoute allowedRoles={["admin", "member"]} />}>
              <Route element={<MainLayout/>}>
                <Route path="/dashboard-member" element={<DashboardMember />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/products/:id" element={<ProductDetail />} />
              </Route>
            </Route>

            {/* Products — admin only */}
            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route element={<MainLayout/>}>
                <Route path="/products" element={<Products />} />
              </Route>
            </Route>

            {/* Error pages */}
            <Route path="/error-400" element={<Error400 />} />
            <Route path="/error-401" element={<Error401 />} />
            <Route path="/error-403" element={<Error403 />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
      </Suspense>
  );
}

export default App;
