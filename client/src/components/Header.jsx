import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../store/authSlice.js";
import Swal from "sweetalert2";
import { Icon } from "@iconify/react";

const Header = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, logout",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("user");
        dispatch(logoutUser());
        navigate("/login");
        Swal.fire(
          "Logged out!",
          "You have been successfully logged out.",
          "success"
        );
      }
    });
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className="text-2xl font-extrabold tracking-wide !text-white hover:!text-gray-200 transition"
          >
            PetAdopt
          </Link>

          <nav className="hidden md:flex space-x-6 font-semibold text-lg items-center">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="hover:text-gray-300 transition duration-200 flex items-center gap-1"
                >
                  <Icon icon="mdi:login" /> Login
                </Link>
                <Link
                  to="/register"
                  className="hover:text-gray-300 transition duration-200 flex items-center gap-1"
                >
                  <Icon icon="mdi:account-plus" /> Register
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  className="hover:!text-gray-300 !text-white transition duration-200 flex items-center gap-1"
                >
                  <Icon icon="mdi:view-dashboard" /> Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md shadow-sm transition flex items-center gap-1"
                >
                  <Icon icon="mdi:logout" /> Logout
                </button>
              </>
            )}
          </nav>

          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              className="text-white hover:text-gray-300 focus:outline-none"
            >
              <Icon
                icon={menuOpen ? "mdi:close" : "mdi:menu"}
                width="30"
                height="30"
              />
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <nav className="md:hidden bg-gradient-to-b from-blue-700 to-indigo-700 px-4 py-4 space-y-3 font-semibold text-lg">
          {!user ? (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block hover:text-gray-300 transition flex items-center gap-2"
              >
                <Icon icon="mdi:login" /> Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="block hover:text-gray-300 transition flex items-center gap-2"
              >
                <Icon icon="mdi:account-plus" /> Register
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="block hover:text-gray-300 transition flex items-center gap-2"
              >
                <Icon icon="mdi:view-dashboard" /> Dashboard
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="w-full text-left bg-red-500 hover:bg-red-600 px-3 py-2 rounded-md shadow-sm transition flex items-center gap-2"
              >
                <Icon icon="mdi:logout" /> Logout
              </button>
            </>
          )}
        </nav>
      )}
    </header>
  );
};

export default Header;
