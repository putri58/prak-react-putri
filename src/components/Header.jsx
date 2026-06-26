import { useState } from "react";
import { FaSearch, FaRegEnvelope, FaRegSun, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";

export default function Header() {
    const { profile, role, signOut } = useAuth();
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const isAdmin = role === "admin";
    const isMember = role === "member";

    const getRoleBadge = () => {
        if (isAdmin) {
            return (
                <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-full ml-1">
                    ADMIN
                </span>
            );
        }
        if (isMember) {
            const tierColors = {
                bronze: "bg-yellow-100 text-yellow-700",
                silver: "bg-gray-200 text-gray-700",
                gold: "bg-yellow-100 text-yellow-600",
            };
            const color = tierColors[profile?.tier] || tierColors.bronze;
            return (
                <span className={`${color} text-[10px] font-bold px-2 py-0.5 rounded-full ml-1`}>
                    {profile?.tier?.toUpperCase() || "MEMBER"}
                </span>
            );
        }
        return null;
    };

    const handleLogout = async () => {
        await signOut();
        window.location.href = "/login";
    };

    return (
        <div className={`flex items-center justify-between p-4 mb-6 rounded-xl shadow-sm ${isAdmin ? "bg-white" : "bg-gradient-to-r from-white to-green-50"}`}>
            {/* Search Bar Group */}
            <div className="relative w-1/2">
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <input 
                    type="text" 
                    placeholder={isAdmin ? "Search orders, customers..." : "Search products..."}
                    className="w-full bg-gray-100 pl-10 pr-4 py-2 rounded-lg focus:outline-none cursor-pointer"
                    onClick={() => setIsSearchOpen(true)}
                />
            </div>

            {/* Icons & Profile */}
            <div className="flex items-center space-x-6">
                <div className="flex space-x-4 text-gray-400">
                    <FaRegEnvelope />
                    <FaRegSun />
                </div>
                <div className={`flex items-center space-x-3 pl-6 ${isAdmin ? "border-l" : "border-l border-green-200"}`}>
                    <div className="text-right">
                        <p className={`text-sm font-bold flex items-center justify-end gap-1 ${isAdmin ? "text-gray-800" : "text-green-800"}`}>
                            {isAdmin && <span className="text-purple-500">👑</span>}
                            HI {profile?.full_name?.split(" ")[0]?.toUpperCase() || "USER"}!
                            {getRoleBadge()}
                        </p>
                        <p className={`text-xs ${isAdmin ? "text-gray-400" : "text-green-600"} capitalize`}>
                            {isAdmin ? "Administrator" : "Member"}
                            {profile?.tier && role === "member" && (
                                <span className="ml-1 font-semibold">
                                    · {profile.tier === "gold" ? "🥇" : profile.tier === "silver" ? "🥈" : "🥉"}
                                    {profile.points} pts
                                </span>
                            )}
                        </p>
                    </div>
                    <div className="relative">
                        <img 
                            src={`https://ui-avatars.com/api/?name=${profile?.full_name || "User"}&background=${isAdmin ? "7c3aed" : "10b981"}&color=fff&bold=true`}
                            className="w-10 h-10 rounded-full"
                            alt="avatar"
                        />
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${isAdmin ? "bg-purple-500" : "bg-green-500"}`}></div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        title="Logout"
                    >
                        <FaSignOutAlt className="text-lg" />
                    </button>
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