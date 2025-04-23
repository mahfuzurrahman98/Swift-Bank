import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import useLogout from "../hooks/useLogout";
import useAuth from "../hooks/useAuth";

const Header = () => {
    const { auth } = useAuth();
    const logout = useLogout();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            toast.success("Logged out successfully");
        } catch (error) {
            console.error(error);
        }
    };

    const firstName = auth.name.split(" ")[0];
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        if (!dropdownOpen) return;
        function handleClick(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [dropdownOpen]);

    return (
        <div className="bg-white shadow">
            <nav className="w-full flex justify-between items-center mx-auto h-14 max-w-6xl px-4">
                {/* Dropdown wrapper for outside click detection */}
                <div ref={dropdownRef} className="flex items-center w-full justify-between">
                <div className="flex items-center">
                    <Link
                        to="/"
                        className="text-2xl font-bold text-blue-800 leading-none"
                    >
                        Swift Bank
                    </Link>
                </div>

                {auth.token != "" ? (
                    <div className="relative flex items-center">
                        {/* Dropdown Trigger */}
                        <button
                            className="flex items-center px-4 py-2 bg-gray-200 text-blue-800 font-semibold rounded-md hover:bg-gray-300 transition focus:outline-none"
                            onClick={() => setDropdownOpen((open) => !open)}
                            id="user-menu-button"
                            aria-expanded={dropdownOpen ? "true" : "false"}
                            aria-haspopup="true"
                            type="button"
                        >
                            {firstName}
                            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {/* Dropdown Menu */}
                        {dropdownOpen && (
                            <div
                                className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50 animate-fade-in"
                                role="menu"
                                aria-orientation="vertical"
                                aria-labelledby="user-menu-button"
                                tabIndex={-1}
                            >
                                <Link
                                    to="/profile"
                                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-t-md transition"
                                    role="menuitem"
                                    tabIndex={0}
                                    onClick={() => setDropdownOpen(false)}
                                >
                                    Profile
                                </Link>
                                <button
                                    onClick={() => {
                                        setDropdownOpen(false);
                                        handleLogout();
                                    }}
                                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-b-md transition"
                                    role="menuitem"
                                    tabIndex={0}
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex justify-end items-center">
                        <div className="flex items-center">
                            <Link
                                to="/login"
                                className="bg-blue-800 text-white px-3 py-1 rounded-md hover:bg-blue-700"
                            >
                                Login
                            </Link>
                        </div>
                    </div>
                )}
            </nav>
        </div>
    );
};

export default Header;
