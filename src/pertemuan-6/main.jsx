import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom"; // ✅ tambah ini
import "./assets/tailwind.css";
import Sidebar from "./layouts/Sidebar";
import Header from "./layouts/Header";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Customers from "./pages/Customer";
import NotFound from "./pages/NotFound";

createRoot(document.getElementById("root")).render(
  <BrowserRouter> {/* ✅ tambah ini */}
    <div id="app-container" className="bg-gray-100 min-h-screen flex">
      <div id="layout-wrapper" className="flex flex-row flex-1">
        <Sidebar />
        <div id="main-content" className="flex-1 p-4">
          <Header />
          <Routes>
             <Route path="*" element={<NotFound />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/customers" element={<Customers />} />
          </Routes>
        </div>
      </div>
    </div>
  </BrowserRouter>
);