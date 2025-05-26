import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { Menu, X } from "lucide-react"; // Install: npm install lucide-react

export default function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navItemStyle = ({ isActive }) =>
    isActive
      ? "text-blue-600 font-semibold"
      : "text-gray-700 hover:text-blue-600";

  return (
    <header className="bg-white w-[100vw] border-b shadow-md sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo / Title */}
        <NavLink to="/" className="text-xl font-bold text-gray-800">
          Admin Dashboard
        </NavLink>
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <NavLink to="/dashboard" className={navItemStyle}>
            Dashboard
          </NavLink>
          <NavLink to="/natural-stones" className={navItemStyle}>
            Natural Stones
          </NavLink>
          <NavLink to="/completed-projects" className={navItemStyle}>
            Completed Projects
          </NavLink>
          <NavLink to="/quartz" className={navItemStyle}>
            Quartz
          </NavLink>
          <NavLink to="/kitchen-projects" className={navItemStyle}>
            Kitchen Projects
          </NavLink>
          <button
            onClick={handleLogout}
            className="px-4 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md"
          >
            Logout
          </button>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-gray-700 focus:outline-none"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Items */}
      {isOpen && (
        <div className="md:hidden flex flex-col bg-white border-t border-gray-200 px-4 py-4 space-y-3 text-sm">
          <NavLink
            to="/dashboard"
            className={navItemStyle}
            onClick={toggleMenu}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/natural-stones"
            className={navItemStyle}
            onClick={toggleMenu}
          >
            Marbles
          </NavLink>
          <NavLink
            to="/completed-projects"
            className={navItemStyle}
            onClick={toggleMenu}
          >
            Completed Projects
          </NavLink>
          <NavLink
            to="/kitchen-projects"
            className={navItemStyle}
            onClick={toggleMenu}
          >
            Kitchen Projects
          </NavLink>
          <button
            onClick={() => {
              toggleMenu();
              handleLogout();
            }}
            className="w-full text-left px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
