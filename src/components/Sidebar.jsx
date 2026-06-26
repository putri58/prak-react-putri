import { NavLink } from "react-router-dom";
import {
  LuClipboardList,
  LuUsers,
  LuNotebook,
  LuComponent,
  LuPackage,
  LuLayers,
  LuUser,
  LuPlus,
} from "react-icons/lu";
import { MdSpaceDashboard } from "react-icons/md";
import { useAuth } from "../contexts/AuthContext";

export default function Sidebar() {
  const { role } = useAuth();

  const menuClass = ({ isActive }) =>
    `flex cursor-pointer items-center rounded-xl p-4 space-x-2
        ${
          isActive
            ? "text-hijau bg-green-200 font-extrabold"
            : "text-gray-600 hover:text-hijau hover:bg-green-200 hover:font-extrabold"
        }`;

  const isAdmin = role === "admin";
  const isMember = role === "member";

  return (
    <div
      id="sidebar"
      className="flex min-h-screen w-90 flex-col bg-white p-10 shadow-lg"
    >
      {/* Logo */}
      <div id="sidebar-logo" className="flex flex-col">
        <span className="font-poppins font-[1000] text-[48px]">
          Sedap<b className="text-green-500">.</b>
        </span>
        <span className="text-gray-400 font-semibold font-barlow">
          {isAdmin ? "Admin Dashboard" : "Member Area"}
        </span>
      </div>

      {/* List Menu */}
      <div id="sidebar-menu" className="mt-10">
        <ul id="menu-list" className="space-y-3">
          {/* Dashboard Admin — only admin */}
          {isAdmin && (
            <li>
              <NavLink id="menu-1" to="/" className={menuClass} end>
                <MdSpaceDashboard className="mr-4 text-xl" />
                Dashboard
              </NavLink>
            </li>
          )}

          {/* Dashboard Member — only member */}
          {isMember && (
            <li>
              <NavLink id="menu-member" to="/dashboard-member" className={menuClass}>
                <LuUser className="mr-4 text-xl" />
                My Dashboard
              </NavLink>
            </li>
          )}

          {/* Orders — admin sees all, member sees own */}
          {(isAdmin || isMember) && (
            <li>
              <NavLink to="/orders" id="menu-2" className={menuClass}>
                <div className="flex items-center">
                  <LuClipboardList className="mr-4 text-xl" />
                  Orders
                </div>
              </NavLink>
            </li>
          )}

          {/* Customers — admin only */}
          {isAdmin && (
            <li>
              <NavLink to="/customers" id="menu-3" className={menuClass}>
                <LuUsers className="mr-4 text-xl" />
                Customers
              </NavLink>
            </li>
          )}

          {/* Shop — member only (browse & order) */}
          {isMember && (
            <li>
              <NavLink to="/shop" className={menuClass}>
                <LuPackage className="mr-4 text-xl" />
                Shop
              </NavLink>
            </li>
          )}

          {/* Products — admin only */}
          {isAdmin && (
            <li>
              <NavLink to="/products" id="menu-4" className={menuClass}>
                <LuPackage className="mr-4 text-xl" />
                Products
              </NavLink>
            </li>
          )}

          {/* Admin-only menus */}
          {isAdmin && (
            <>
              <li>
                <NavLink to="/components" className={menuClass}>
                  <LuComponent className="mr-4 text-xl" />
                  Components
                </NavLink>
              </li>
              <li>
                <NavLink to="/fitur-xyz" className={menuClass}>
                  <LuLayers className="mr-4 text-xl" />
                  Fitur Xyz
                </NavLink>
              </li>
              <li>
                <NavLink to="/notes" className={menuClass}>
                  <LuNotebook className="mr-4 text-xl" />
                  Note
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>

      {/* Footer */}
      <div id="sidebar-footer" className="mt-auto">
        <div
          id="footer-card"
          className="bg-hijau px-4 py-2 rounded-md shadow-lg mb-10 flex items-center"
        >
          <div id="footer-text" className="text-white text-sm">
            <span>Please organize your menus through button below!</span>
            <div
              id="add-menu-button"
              className="flex justify-center items-center p-2 mt-3 bg-white rounded-md space-x-2"
            >
              <span className="text-gray-600 flex items-center cursor-pointer">
                <LuPlus className="mr-4 text-xl" />
                Add Menus
              </span>
            </div>
          </div>
          <img
            id="footer-avatar"
            className="w-20 rounded-full"
            src="https://down-id.img.susercontent.com/file/id-11134207-81zth-mewoo3ks67lxaa@resize_w900_nl.webp"
            alt="avatar"
          />
        </div>

        <span id="footer-brand" className="font-bold text-gray-400">
          Sedap Restaurant Admin Dashboard
        </span>
        <p id="footer-copyright" className="font-light text-gray-400">
          &copy; 2026 All Right Reserved
        </p>
      </div>
    </div>
  );
}
