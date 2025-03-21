import React, { useEffect, useState, useRef } from "react";
import {
  FaLeaf,
  FaUser,
  FaHeart,
  FaSignOutAlt,
  FaCog,
  FaShoppingCart,
  FaBell,
} from "react-icons/fa";
import { GiHamburgerMenu, GiCrossedBones } from "react-icons/gi";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { BASE_URL, getCurrentUser, getTokenFromCookie } from "../../../helper";
import axios from "axios";
import leafImg from "../../assets/leaf.png";
import toast from "react-hot-toast";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [signature, setSignature] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const menuRef = useRef(null);
  const profileRef = useRef(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfile = () => setIsOpen(!isOpen);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target) &&
        !event.target.closest("button[data-profile-toggle]")
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchUser = async () => {
    try {
      const user1 = await getCurrentUser();
      // console.log("Fetched user:", user1);
      setUser(user1);

      // Fetch profile picture
      if (user1?.id) {
        const profileResponse = await axios.get(
          `${BASE_URL}/users/profile-image/${user1.id}`,
          {
            responseType: "arraybuffer", // Handle binary data
            headers: {
              Authorization: "Bearer " + getTokenFromCookie(),
            },
          }
        );
        const profileBlob = new Blob([profileResponse.data], {
          type: "image/jpeg",
        });
        setProfilePicture(URL.createObjectURL(profileBlob));

        // Fetch signature
        const signatureResponse = await axios.get(
          `${BASE_URL}/users/signature-image/${user1.id}`,
          {
            responseType: "arraybuffer",
            headers: {
              Authorization: "Bearer " + getTokenFromCookie(),
            },
          }
        );
        const signatureBlob = new Blob([signatureResponse.data], {
          type: "image/jpeg",
        });
        setSignature(URL.createObjectURL(signatureBlob));
      }
    } catch (error) {
      console.error("Error fetching user or images:", error);
      toast.error("Failed to load user data or images");
    }
  };

  useEffect(() => {
    fetchUser();

    // Cleanup URLs to prevent memory leaks
    return () => {
      if (profilePicture) URL.revokeObjectURL(profilePicture);
      if (signature) URL.revokeObjectURL(signature);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(`${BASE_URL}/auth/logout`, null, {
        withCredentials: true,
        headers: {
          Authorization: "Bearer " + getTokenFromCookie(),
        },
      });
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      console.error("There was an error logging out:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Marketplace", path: "/crops" },
    { name: "Contact", path: "/contact" },
  ];

  // console.log("User state:", user);

  return (
    <>
      <nav className="bg-white shadow-md py-3 md:py-4 px-4 md:px-6 lg:px-20 flex justify-between items-center fixed w-full top-0 z-50 h-16 md:h-20">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center space-x-2 group transition-all duration-300"
        >
          <div className="relative">
            <img
              src={leafImg}
              width={30}
              alt="AgriConnect Logo"
              className="group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute -inset-1 bg-green-100 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-400 font-bold text-2xl">
            AgriConnect
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex space-x-6 lg:space-x-8 text-[#112216] font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative px-2 py-1 transition-all duration-200 ${
                isActive(link.path)
                  ? "text-green-600 font-semibold"
                  : "text-gray-700 hover:text-green-600"
              }`}
            >
              {link.name}
              {isActive(link.path) && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500 rounded-full"></span>
              )}
            </Link>
          ))}
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <button className="hidden md:flex text-gray-600 hover:text-green-600 transition-colors duration-200 relative">
            <FaBell size={20} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              3
            </span>
          </button>
          <Link
            to="/cart"
            className="hidden md:flex text-gray-600 hover:text-green-600 transition-colors duration-200 relative"
          >
            <FaShoppingCart size={20} />
            <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              2
            </span>
          </Link>

          {/* Profile Button */}
          <div className="relative">
            <button
              data-profile-toggle="true"
              className="flex items-center space-x-2 border border-green-600 text-green-700 p-1 px-3 md:px-4 py-1.5 md:py-2 rounded-full hover:bg-green-50 transition-all duration-200 shadow-sm"
              onClick={toggleProfile}
            >
              <div className="h-6 w-6 md:h-7 md:w-7 rounded-full bg-green-200 flex items-center justify-center overflow-hidden">
                {profilePicture ? (
                  <img
                    src={profilePicture}
                    alt="Profile"
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <FaUser size={14} className="text-green-600" />
                )}
              </div>
              <span className="hidden md:inline text-sm font-medium">
                {user?.username || "Account"}
              </span>
            </button>

            {/* Profile Dropdown */}
            {isOpen && (
              <div
                ref={profileRef}
                className="absolute right-0 top-12 mt-2 w-64 bg-white border border-gray-200 shadow-xl rounded-lg overflow-hidden transition-all duration-200 transform origin-top-right"
                style={{ animation: "scaleIn 0.2s ease-out" }}
              >
                {user && (
                  <div className="p-4 border-b border-gray-100 bg-green-50">
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 rounded-full bg-green-200 flex items-center justify-center overflow-hidden">
                        {profilePicture ? (
                          <img
                            src={profilePicture}
                            alt={`${user.username}'s profile`}
                            className="h-full w-full rounded-full object-cover"
                          />
                        ) : (
                          <FaUser size={20} className="text-green-600" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">
                          {user.username}
                        </div>
                        <div className="text-xs text-gray-500">
                          {user.phoneNumber || "No contact found"}
                        </div>
                      </div>
                    </div>
                    {signature && (
                      <div className="mt-2">
                        <img
                          src={signature}
                          alt="Signature"
                          className="h-8 w-auto"
                        />
                      </div>
                    )}
                  </div>
                )}
                <div className="py-2">
                  <Link
                    to="/profile"
                    className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <FaUser className="text-green-600" />
                    <span>Profile Settings</span>
                  </Link>
                  <Link
                    to="/wishlist"
                    className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <FaHeart className="text-red-500" />
                    <span>My Wishlist</span>
                  </Link>
                  <Link
                    to="/my-orders"
                    className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <FaShoppingCart className="text-blue-600" />
                    <span>My Orders</span>
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <FaCog className="text-gray-600" />
                    <span>Account Settings</span>
                  </Link>
                </div>
                <div className="border-t border-gray-100">
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <FaSignOutAlt className="text-red-500" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Hamburger Menu */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-green-600 transition-colors focus:outline-none p-1"
            >
              {isMenuOpen ? (
                <GiCrossedBones size={20} />
              ) : (
                <GiHamburgerMenu size={20} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div
            ref={menuRef}
            className="md:hidden absolute top-16 left-0 w-full bg-white shadow-lg border-t border-gray-200 z-40"
            style={{ animation: "slideDown 0.3s ease-out" }}
          >
            <div className="flex flex-col p-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-2 w-full py-3 px-2 rounded-md ${
                    isActive(link.path)
                      ? "text-green-600 bg-green-50 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>{link.name}</span>
                </Link>
              ))}
              <Link
                to="/list-product"
                className="flex items-center space-x-2 w-full py-3 px-2 text-gray-700 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                <FaLeaf className="text-green-500" />
                <span>List Product</span>
              </Link>
              <Link
                to="/cart"
                className="flex items-center space-x-2 w-full py-3 px-2 text-gray-700 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                <FaShoppingCart className="text-blue-600" />
                <span>Shopping Cart</span>
                <span className="ml-auto bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  2
                </span>
              </Link>
              <div className="pt-2 border-t border-gray-100 mt-2">
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center space-x-2 w-full py-3 px-2 text-red-600 hover:bg-red-50 rounded-md"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      <style jsx="true">{`
        @keyframes scaleIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes slideDown {
          from {
            transform: translateY(-10px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
      <div className="h-16 md:h-20"></div>
    </>
  );
};

export default Navbar;
