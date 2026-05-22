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
const Orders = React.lazy(() => import("./pages/Orders"))
const Customers = React.lazy(() => import("./pages/Customer"))
const Products = React.lazy(() => import("./pages/Products"))
const NotFound = React.lazy(() => import("./pages/NotFound"))
const Error400 = React.lazy(() => import("./pages/Error400"))
const Error401 = React.lazy(() => import("./pages/Error401"))
const Error403 = React.lazy(() => import("./pages/Error403"))
const MainLayout = React.lazy(() => import("./Layouts/MainLayout"))
const Login = React.lazy(() => import("./pages/auth/Login"))
const Register = React.lazy(() => import("./pages/auth/Register"))
const Forgot = React.lazy(() => import("./pages/auth/Forgot"))
const AuthLayout = React.lazy(() => import("./Layouts/AuthLayout"))
const ProductDetail = React.lazy(() => import("./pages/ProductDetail"))

function App() {
  return (
    <Suspense fallback={<Loading/>}>
          <Routes>
            <Route element={<MainLayout/>}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/products" element={<Products />} />
             <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/error-400" element={<Error400 />} />
            <Route path="/error-401" element={<Error401 />} />
            <Route path="/error-403" element={<Error403 />} />
            <Route path="*" element={<NotFound />} />
            </Route>
             <Route element={<AuthLayout/>}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register/>} />
            <Route path="/forgot" element={<Forgot/>} />
        </Route>
          </Routes>
      </Suspense>
          
  );
}

export default App;
