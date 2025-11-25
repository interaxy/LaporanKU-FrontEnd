import React, { useMemo, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logoImg from "../assets/logo.png";

// Icons MUI
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ArticleIcon from "@mui/icons-material/Article";
import SyncProblemIcon from "@mui/icons-material/SyncProblem";
import GroupIcon from "@mui/icons-material/Group";
import ChecklistIcon from "@mui/icons-material/Checklist";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuBookIcon from "@mui/icons-material/MenuBook";

const Sidebar = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(true);

    const currentUser = useMemo(
        () => ({
            username: user?.nama || user?.username || "User",
            email: user?.email || "-",
            role: (user?.role || "user").toLowerCase(),
        }),
        [user]
    );

    const isActive = (path) => location.pathname === path;
    const isAdmin = currentUser.role === "admin";

    const handleLogout = () => {
        if (!window.confirm("Yakin ingin logout?")) return;
        onLogout?.();
        navigate("/login");
    };

    return (
        <aside
            className={`
        bg-white border-r border-gray-200 flex flex-col
        transition-all duration-200
        h-screen
        ${collapsed ? "w-20" : "w-64"}
      `}
        >
            {/* HEADER */}
            <div className="flex items-center p-4 border-b border-gray-200 bg-white">
                {/* Tombol collapse / hamburger */}
                <button
                    type="button"
                    className="p-1 mr-2 rounded hover:bg-gray-100"
                    onClick={() => setCollapsed((prev) => !prev)}
                >
                    <MenuIcon fontSize="small" />
                </button>

                {/* Logo + nama, hanya saat tidak collapsed */}
                {!collapsed && (
                    <>
                        <span className="font-semibold text-xl">LaporanKU</span>
                        <img src={logoImg} alt="Logo" className="h-8 w-8 ml-3" />
                    </>
                )}
            </div>

            {/* USER INFO */}
            {!collapsed && user && (
                <div className="px-4 py-3 text-sm border-b border-gray-100">
                    <div className="font-semibold">{currentUser.username}</div>
                    <div className="text-gray-500">{currentUser.email}</div>
                    <div className="text-gray-600 capitalize">
                        Role: {currentUser.role}
                    </div>
                </div>
            )}

            {/* MENU (scrollable area) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
                {!collapsed && (
                    <p className="px-2 pt-1 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        MENGELOLA
                    </p>
                )}

                {/* Dashboard */}
                <Link
                    to="/dashboard"
                    className={`
            flex items-center ${collapsed ? "justify-center" : ""}
            px-4 py-2.5 rounded-md transition
            ${isActive("/dashboard")
                            ? "bg-blue-500 text-white"
                            : "text-gray-600 hover:bg-blue-100 hover:text-blue-600"
                        }
          `}
                >
                    <DashboardIcon fontSize="small" />
                    {!collapsed && <span className="ml-3 text-sm">Dashboard</span>}
                </Link>

                {/* Laporan */}
                <Link
                    to="/reports"
                    className={`
            flex items-center ${collapsed ? "justify-center" : ""}
            px-4 py-2.5 rounded-md transition
            ${isActive("/reports")
                            ? "bg-blue-500 text-white"
                            : "text-gray-600 hover:bg-blue-100 hover:text-blue-600"
                        }
          `}
                >
                    <ArticleIcon fontSize="small" />
                    {!collapsed && <span className="ml-3 text-sm">Laporan</span>}
                </Link>

                {/* Issue Tracking */}
                <Link
                    to="/issues"
                    className={`
            flex items-center ${collapsed ? "justify-center" : ""}
            px-4 py-2.5 rounded-md transition
            ${isActive("/issues")
                            ? "bg-blue-500 text-white shadow-sm"
                            : "text-gray-600 hover:bg-blue-100 hover:text-blue-600"
                        }
          `}
                >
                    <SyncProblemIcon fontSize="small" />
                    {!collapsed && (
                        <span className="ml-3 text-sm">Issue Tracking</span>
                    )}
                </Link>

                {/* Data Karyawan (ADMIN ONLY) */}
                {isAdmin && (
                    <Link
                        to="/users"
                        className={`
              flex items-center ${collapsed ? "justify-center" : ""}
              px-4 py-2.5 rounded-md transition
              ${isActive("/users")
                                ? "bg-blue-500 text-white"
                                : "text-gray-600 hover:bg-blue-100 hover:text-blue-600"
                            }
            `}
                    >
                        <GroupIcon fontSize="small" />
                        {!collapsed && (
                            <span className="ml-3 text-sm">Data Karyawan</span>
                        )}
                    </Link>
                )}

                {/* Checklist */}
                <Link
                    to="/checklists"
                    className={`
            flex items-center ${collapsed ? "justify-center" : ""}
            px-4 py-2.5 rounded-md transition
            ${isActive("/checklists")
                            ? "bg-blue-500 text-white"
                            : "text-gray-600 hover:bg-blue-100 hover:text-blue-600"
                        }
          `}
                >
                    <ChecklistIcon fontSize="small" />
                    {!collapsed && <span className="ml-3 text-sm">Checklist</span>}
                </Link>

                {/* Materi Utility */}
                <Link
                    to="/materials"
                    className={`
            flex items-center ${collapsed ? "justify-center" : ""}
            px-4 py-2.5 rounded-md transition
            ${isActive("/materials")
                            ? "bg-blue-500 text-white shadow-sm"
                            : "text-gray-600 hover:bg-blue-100 hover:text-blue-600"
                        }
          `}
                >
                    <MenuBookIcon fontSize="small" />
                    {!collapsed && (
                        <span className="ml-3 text-sm">Materi Utility</span>
                    )}
                </Link>
            </div>

            {/* LOGOUT (tetap di bawah sidebar) */}
            <div className="p-4 border-t border-gray-200 bg-white">
                <button
                    onClick={handleLogout}
                    className={`
            w-full flex items-center ${collapsed ? "justify-center" : ""}
            px-4 py-2.5 text-sm font-medium rounded-md
            bg-red-500 hover:bg-red-600 text-white transition
          `}
                >
                    <LogoutIcon fontSize="small" />
                    {!collapsed && <span className="ml-3">Logout</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
