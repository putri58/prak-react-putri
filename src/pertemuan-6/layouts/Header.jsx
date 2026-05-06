import { useState } from "react";
import { FaSearch, FaBell, FaRegEnvelope, FaRegSun } from "react-icons/fa";

export default function Header() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    return (
        <div className="flex items-center justify-between bg-white p-4 mb-6 rounded-xl shadow-sm">
            {/* Search Bar Group */}
            <div className="relative w-1/2">
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search here..." 
                    className="w-full bg-gray-100 pl-10 pr-4 py-2 rounded-lg focus:outline-none cursor-pointer"
                    onClick={() => setIsSearchOpen(true)} // Membuka Modal
                />
            </div>

            {/* Icons & Profile */}
            <div className="flex items-center space-x-6">
                <div className="flex space-x-4 text-gray-400">
                    {/* Improvisasi 3: Notifikasi Animasi Ping */}
                    <div className="relative">
                        <FaBell />
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                    </div>
                    <FaRegEnvelope />
                    <FaRegSun />
                </div>
                <div className="flex items-center space-x-3 border-l pl-6">
                    <div className="text-right">
                        <p className="text-sm font-bold">Putri Agustin</p>
                        <p className="text-xs text-gray-400">Admin</p>
                    </div>
                    <img src="https://down-id.img.susercontent.com/file/id-11134207-81zth-mewoo3ks67lxaa@resize_w900_nl.webp" className="w-10 h-10 rounded-full" alt="avatar" />
                </div>
            </div>

            {/* Modal Improvisasi */}
            {isSearchOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl w-[500px]">
                        <h2 className="text-xl font-bold mb-4">Quick Search</h2>
                        <input 
                            autoFocus
                            type="text" 
                            className="w-full border-b-2 border-hijau py-2 outline-none text-lg"
                            placeholder="Type to find orders, customers..."
                        />
                        <button 
                            className="mt-6 bg-hijau text-white px-6 py-2 rounded-lg"
                            onClick={() => setIsSearchOpen(false)}
                        >
                            Close Search
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}