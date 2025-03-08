import React, { useEffect, useState } from "react";
import { FaLeaf, FaUser, FaHeart, FaSignOutAlt } from "react-icons/fa"; // Added FaHeart and FaSignOutAlt
import { GiHamburgerMenu, GiCrossedBones } from "react-icons/gi";
import { useClickOutside } from "@mantine/hooks";
import { Link, useNavigate } from "react-router-dom"; // Ensure Link is imported
import { BASE_URL, getCurrentUser, getTokenFromCookie } from "../../../helper";
import axios from "axios";
import leafImg from "../../assets/leaf.png";
import toast from "react-hot-toast";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useClickOutside(() => setIsMenuOpen(false));
  const profileRef = useClickOutside(() => setIsOpen(false));
  const [user, setUser] = useState();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfile = () => setIsOpen(!isOpen);
  const navigate = useNavigate();

  const fetchUser = async () => {
    const user1 = await getCurrentUser();
    // console.log(user1); // Logs the User object
    setUser(user1);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(`${BASE_URL}/auth/logout`, null, {
        withCredentials: true,
        headers: {
          Authorization: "Bearer " + getTokenFromCookie(),
        },
      });
      console.log("Logged out successfully");
      toast.success("Logged out successfully");
      // localStorage.removeItem("s_jwt");
      // localStorage.removeItem("role");
      // localStorage.removeItem('username');
      // setLoginStatus(false);
      navigate("/");
    } catch (error) {
      console.error("There was an error logging out:", error);
    } finally {
      setIsLogoutModalVisible(false);
    }
  };

  return (
    <nav className="bg-white shadow-md py-3 md:py-5 px-4 md:px-6 lg:px-20 flex justify-between items-center fixed w-full top-0 z-50 h-16 md:h-20">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <img src={leafImg} width={30} alt="AgriConnect Logo" />
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-400 font-bold text-2xl">
          AgriConnect
        </span>
      </div>

      {/* Desktop Navigation Links */}
      <div className="hidden md:flex space-x-4 lg:space-x-6 text-[#112216] font-medium">
        <a
          href="/"
          className="text-[#34854a] hover:text-[#21462c] text-sm lg:text-base"
        >
          Home
        </a>
        <a
          href="/dashboard"
          className="hover:text-[#21462c] text-sm lg:text-base"
        >
          Dashboard
        </a>
        <a
          href="/contact"
          className="hover:text-[#21462c] text-sm lg:text-base"
        >
          Contact
        </a>
      </div>

      {/* Mobile & Desktop Right Section */}
      <div className="flex items-center space-x-2 md:space-x-4">
        {/* Profile Button */}
        <button
          className="flex items-center space-x-1 md:space-x-2 border border-snowy-mint-700 text-snowy-mint-700 p-1 px-4 py-2 rounded-full hover:bg-snowy-mint-50 transition"
          onClick={toggleProfile}
        >
          <FaUser size={16} md:size={18} />
          <span className="hidden md:inline text-md md:text-md font-semibold text-snowy-mint-700">
            {user?.username}
          </span>
        </button>

        {/* Hamburger Menu (Mobile Only) */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-snowy-mint-900 hover:text-snowy-mint-700 focus:outline-none"
          >
            {isMenuOpen ? (
              <GiCrossedBones size={24} />
            ) : (
              <GiHamburgerMenu size={24} />
            )}
          </button>
        </div>

        {/* Profile Dropdown */}
        {isOpen && (
          <div
            ref={profileRef}
            className="absolute right-0 top-16 md:top-20 mt-2 w-36 md:w-40 bg-white border border-gray-200 shadow-lg rounded-lg"
          >
            <Link
              to="/profile"
              className="flex items-center space-x-2 px-3 md:px-4 py-1 md:py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <FaUser className="text-green-600" />
              <span>Profile</span>
            </Link>
            <a
              href="#"
              className="flex items-center space-x-2 px-3 md:px-4 py-1 md:py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <FaHeart className="text-red-500" />
              <span>Wishlist</span>
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 w-full text-left px-3 md:px-4 py-1 md:py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <FaSignOutAlt className="text-gray-600" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div
          ref={menuRef}
          className="md:hidden absolute top-16 left-0 w-full bg-white shadow-lg border-t border-gray-200 z-40"
        >
          <div className="flex flex-col items-start p-4 space-y-2">
            <a
              href="#"
              className="text-[#34854a] hover:text-[#21462c] text-sm w-full py-2"
            >
              Home
            </a>
            <a href="#" className="hover:text-[#21462c] text-sm w-full py-2">
              Dashboard
            </a>
            <a
              href="/list"
              className="hover:text-[#21462c] text-sm w-full py-2"
            >
              List Product
            </a>
            <a href="#" className="hover:text-[#21462c] text-sm w-full py-2">
              Contact
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
