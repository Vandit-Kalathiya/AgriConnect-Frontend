import React, { useEffect, useState, useRef } from "react";
import {
  FaUser,
  FaHeart,
  FaSignOutAlt,
  FaCog,
  FaBox,
  FaCloudSun,
  FaMoneyBillWave,
  FaShoppingCart,
  FaBell,
} from "react-icons/fa";
import { GiHamburgerMenu, GiCrossedBones } from "react-icons/gi";
import { IoMdAdd } from "react-icons/io";
import { GrStorage } from "react-icons/gr";
import { RiContractLine } from "react-icons/ri";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { BASE_URL, getCurrentUser, getTokenFromCookie } from "../../../helper";
import api, { clearAuthToken } from "../../config/axiosInstance";
import leafImg from "../../assets/leaf.png";
import toast from "react-hot-toast";
import NotificationDrawer from "../Notifications/NotificationDrawer";
import NotificationToast from "../Notifications/NotificationToast";
import { useNotificationStore } from "../../stores/notificationStore";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [signature, setSignature] = useState(null);
  const [showSignature, setShowSignature] = useState(false);

  // Notification state from Zustand store
  const {
    unreadCount,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
    initForUser,
    disconnect,
    isEnabled,
  } = useNotificationStore();

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
        setShowSignature(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchUser = async () => {
    try {
      const user1 = await getCurrentUser();
      setUser(user1);

      if (user1?.id) {
        // Initialise notification store: loads data + connects WebSocket
        const jwtToken = getTokenFromCookie() ?? "";
        initForUser(user1.id, jwtToken);

        // Fetch profile picture
        const profileResponse = await api.get(
          `${BASE_URL}/users/profile-image/${user1.id}`,
          { responseType: "arraybuffer" },
        );
        const profileBlob = new Blob([profileResponse.data], {
          type: "image/jpeg",
        });
        setProfilePicture(URL.createObjectURL(profileBlob));

        // Fetch signature
        const signatureResponse = await api.get(
          `${BASE_URL}/users/signature-image/${user1.id}`,
          { responseType: "arraybuffer" },
        );
        const signatureBlob = new Blob([signatureResponse.data], {
          type: "image/jpeg",
        });
        setSignature(URL.createObjectURL(signatureBlob));
      }
    } catch (error) {
      toast.error("Failed to load user data or images");
    }
  };

  useEffect(() => {
    fetchUser();

    return () => {
      // Disconnect WebSocket on unmount (e.g. full page unload)
      disconnect();
      if (profilePicture) URL.revokeObjectURL(profilePicture);
      if (signature) URL.revokeObjectURL(signature);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await api.post(`${BASE_URL}/auth/logout`, null);
      disconnect(); // close WebSocket before clearing auth
      clearAuthToken();
      document.cookie = "jwt_token=; Max-Age=0; path=/";
      toast.success("Logged out successfully");
      navigate("/auth");
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };

  const isActive = (path) => location.pathname === path;
  const getInitials = (name) => {
    if (!name) return "AC";
    return name.trim().slice(0, 2).toUpperCase();
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Marketplace", path: "/crops" },
    { name: "Crop Advisory", path: "/crop-advisory" },
    { name: "Market Trends", path: "/market-trends" },
  ];

  const mobileQuickLinks = [
    { name: "My Products", path: "/my-listing", icon: <FaBox /> },
    { name: "List Product", path: "/list", icon: <IoMdAdd /> },
    { name: "Cold Storage", path: "/cold-storage", icon: <GrStorage /> },
    { name: "Weather", path: "/weather", icon: <FaCloudSun /> },
    { name: "My Contracts", path: "/my-contracts", icon: <RiContractLine /> },
    { name: "My Payments", path: "/my-payments", icon: <FaMoneyBillWave /> },
    { name: "My Orders", path: "/orders", icon: <FaShoppingCart /> },
  ];
  const profileMenuItems = [
    {
      to: "/profile",
      icon: <FaUser className="text-green-600" />,
      label: "Profile Settings",
    },
    {
      to: "/wishlist",
      icon: <FaHeart className="text-red-500" />,
      label: "My Wishlist",
    },
    {
      to: "/orders",
      icon: <FaShoppingCart className="text-blue-600" />,
      label: "My Orders",
    },
    {
      to: "/settings",
      icon: <FaCog className="text-gray-600" />,
      label: "Account Settings",
    },
  ];

  return (
    <>
      <nav className="bg-white shadow-md px-3 sm:px-4 md:px-6 lg:px-10 xl:px-20 flex justify-between items-center fixed w-full top-0 z-50 h-14 gap-2">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center space-x-2 group transition-all duration-300 min-w-0"
        >
          <div className="relative">
            <img
              src={leafImg}
              width={26}
              alt="AgriConnect Logo"
              className="group-hover:scale-110 transition-transform duration-300 shrink-0"
            />
            <div className="absolute -inset-1 bg-green-100 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-400 font-bold text-sm sm:text-xl truncate">
            AgriConnect
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex space-x-4 xl:space-x-6 text-[#112216] font-medium">
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
        <div className="flex items-center space-x-1 sm:space-x-3 md:space-x-4 shrink-0">
          {/* <Link
            to="/cart"
            className="hidden md:flex text-gray-600 hover:text-green-600 transition-colors duration-200 relative"
          >
            <FaShoppingCart size={20} />
            <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              2
            </span>
          </Link> */}

          {/* Profile Button */}
          <div className="relative">
            <button
              data-profile-toggle="true"
              className="flex items-center space-x-2 border border-green-600 text-green-700 px-2 sm:px-3 py-1.5 rounded-full hover:bg-green-50 transition-all duration-200 shadow-sm"
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
                  <span className="text-[10px] md:text-xs font-semibold text-green-700">
                    {getInitials(user?.username)}
                  </span>
                )}
              </div>
              <span className="hidden lg:inline xl:inline text-sm font-medium max-w-24 truncate">
                {user?.username || "Account"}
              </span>
            </button>

            {/* Profile Dropdown */}
            {isOpen && (
              <div
                ref={profileRef}
                className="absolute right-0 top-12 mt-2 w-[min(88vw,16.5rem)] bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden transition-all duration-200 transform origin-top-right"
                style={{ animation: "scaleIn 0.2s ease-out" }}
              >
                {user && (
                  <div className="p-3 border-b border-gray-100 bg-green-50/60">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-green-200 flex items-center justify-center overflow-hidden ring-2 ring-white">
                        {profilePicture ? (
                          <img
                            src={profilePicture}
                            alt={`${user.username}'s profile`}
                            className="h-full w-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-sm font-semibold text-green-700">
                            {getInitials(user?.username)}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-gray-800 truncate text-sm">
                          {user.username}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {user.phoneNumber || "No contact found"}
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-green-100">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[11px] text-gray-500">Signature</p>
                        <button
                          type="button"
                          className="text-[11px] font-medium text-green-700 hover:underline"
                          onClick={() => setShowSignature((prev) => !prev)}
                        >
                          {showSignature ? "Hide signature" : "Show signature"}
                        </button>
                      </div>
                      {showSignature && (
                        <div className="mt-1">
                          {signature ? (
                            <img
                              src={signature}
                              alt="Signature"
                              className="h-7 w-auto rounded"
                            />
                          ) : (
                            <p className="text-xs text-gray-500">
                              Signature not uploaded yet.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <div className="py-2">
                  {profileMenuItems.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="flex items-center space-x-3 px-3.5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
                <div className="border-t border-gray-100">
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 w-full text-left px-3.5 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                  >
                    <FaSignOutAlt className="text-red-500" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            data-notification-bell="true"
            onClick={() => (isDrawerOpen ? closeDrawer() : openDrawer())}
            className={`hidden lg:flex transition-colors duration-200 relative ${
              isEnabled
                ? "text-gray-600 hover:text-green-600"
                : "text-gray-400 cursor-not-allowed opacity-60"
            }`}
            aria-label="Open notifications"
            title={
              !isEnabled ? "Notifications are disabled" : "Open notifications"
            }
          >
            <FaBell size={20} />
            {isEnabled && unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center leading-none">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {/* Mobile bell */}
          <button
            data-notification-bell="true"
            onClick={() => (isDrawerOpen ? closeDrawer() : openDrawer())}
            className={`lg:hidden transition-colors duration-200 relative p-1 ${
              isEnabled
                ? "text-gray-600 hover:text-green-600"
                : "text-gray-400 cursor-not-allowed opacity-60"
            }`}
            aria-label="Open notifications"
            title={
              !isEnabled ? "Notifications are disabled" : "Open notifications"
            }
          >
            <FaBell size={18} />
            {isEnabled && unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full h-3.5 w-3.5 flex items-center justify-center leading-none">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Hamburger Menu */}
          <div className="lg:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-green-600 transition-colors focus:outline-none p-2 rounded-lg hover:bg-gray-100"
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
            className="lg:hidden absolute top-14 left-0 w-full bg-white shadow-lg border-t border-gray-200 z-40"
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
              <div className="pt-2 mt-2 border-t border-gray-100">
                <p className="px-2 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Quick Access
                </p>
                {mobileQuickLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="flex items-center space-x-2 w-full py-3 px-2 text-gray-700 hover:bg-gray-50 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="text-green-600">{link.icon}</span>
                    <span>{link.name}</span>
                  </Link>
                ))}
              </div>
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

      {/* Notification drawer — reads isDrawerOpen from Zustand, rendered via portal */}
      <NotificationDrawer userId={user?.id ?? null} />

      {/* Real-time toast popups driven by WebSocket */}
      <NotificationToast userId={user?.id ?? null} />
    </>
  );
};

export default Navbar;
