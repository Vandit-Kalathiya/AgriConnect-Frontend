import React, { useState } from "react";
import {
  FaThLarge,
  FaStore,
  FaBox,
  FaChartBar,
  FaCloudSun,
  FaMoneyBillWave,
  FaBars,
  FaTimes,
  FaShoppingCart,
} from "react-icons/fa";
import { HiTrendingUp } from "react-icons/hi";
import { RiContractLine } from "react-icons/ri";
import { NavLink } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import { GrStorage } from "react-icons/gr";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside
      className={`bg-white/95 backdrop-blur-md h-screen fixed top-0 left-0 shadow-xl border-r border-slate-200/50 transition-all duration-500 ease-in-out z-40 ${
        isCollapsed ? "w-20" : "w-64"
      } hover:shadow-2xl`}
    >
      <div
        className={`${
          isCollapsed ? "space-y-4" : "space-y-3"
        } overflow-y-auto scrollbar-thin scrollbar-thumb-jewel-300 scrollbar-track-transparent hover:scrollbar-thumb-jewel-400 transition-all duration-300 mt-20`}
        style={{ maxHeight: "calc(100vh - 80px)" }}
      >
        <SidebarSection
          title="Market"
          isCollapsed={isCollapsed}
          toggleSidebar={toggleSidebar}
        >
          <SidebarItem
            icon={<FaThLarge />}
            text="Dashboard"
            to="/dashboard"
            isCollapsed={isCollapsed}
            toggleSidebar={toggleSidebar}
          />
          <SidebarItem
            icon={<FaStore />}
            text="Marketplace"
            to="/crops"
            isCollapsed={isCollapsed}
            toggleSidebar={toggleSidebar}
          />
          <SidebarItem
            icon={<FaBox />}
            text="My Products"
            to="/my-listing"
            isCollapsed={isCollapsed}
            toggleSidebar={toggleSidebar}
          />
          <SidebarItem
            icon={<IoMdAdd />}
            text="List Product"
            to="/list"
            isCollapsed={isCollapsed}
            toggleSidebar={toggleSidebar}
          />
          <SidebarItem
            icon={<GrStorage />}
            text="Cold Storage"
            to="/cold-storage"
            isCollapsed={isCollapsed}
            toggleSidebar={toggleSidebar}
          />
        </SidebarSection>

        <SidebarSection
          title="Insights"
          isCollapsed={isCollapsed}
          toggleSidebar={toggleSidebar}
        >
          {/* <SidebarItem
            icon={<HiTrendingUp />}
            text="Market Trends"
            to="/market-trends"
            isCollapsed={isCollapsed}
            toggleSidebar={toggleSidebar}
          /> */}
          {/* <SidebarItem
            icon={<FaChartBar />}
            text="Analytics"
            to="/analytics"
            isCollapsed={isCollapsed}
            toggleSidebar={toggleSidebar}
          /> */}
          <SidebarItem
            icon={<FaCloudSun />}
            text="Weather"
            to="/weather"
            isCollapsed={isCollapsed}
            toggleSidebar={toggleSidebar}
          />
        </SidebarSection>

        <SidebarSection
          title="Operations"
          isCollapsed={isCollapsed}
          toggleSidebar={toggleSidebar}
        >
          <SidebarItem
            icon={<RiContractLine />}
            text="My Contracts"
            to="/my-contracts"
            isCollapsed={isCollapsed}
            toggleSidebar={toggleSidebar}
          />
          <SidebarItem
            icon={<FaMoneyBillWave />}
            text="My Payments"
            to="/my-payments"
            isCollapsed={isCollapsed}
            toggleSidebar={toggleSidebar}
          />
          <SidebarItem
            icon={<FaShoppingCart />}
            text="My Orders"
            to="/my-orders"
            isCollapsed={isCollapsed}
            toggleSidebar={toggleSidebar}
          />
        </SidebarSection>
      </div>
    </aside>
  );
};

const SidebarSection = ({ title, children, isCollapsed, toggleSidebar }) => (
  <div
    className={`${
      isCollapsed ? "px-3 py-3" : "px-4 py-3"
    } transition-all duration-300 ease-in-out`}
  >
    {/* Section header with toggle button for first section */}
    {title === "Market" && (
      <div className="flex items-center justify-between mb-3">
        {!isCollapsed && (
          <div className="text-gray-500 text-sm font-medium tracking-wide uppercase opacity-70 transition-all duration-300 ease-in-out transform">
            {title}
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className={`text-gray-600 hover:text-jewel-700 focus:outline-none cursor-pointer transition-all duration-300 ease-in-out hover:scale-110 hover:bg-jewel-50 rounded-lg p-2 active:scale-95 ${
            isCollapsed ? "mx-auto" : "ml-auto"
          }`}
        >
          <div className="transition-transform duration-300 ease-in-out">
            {isCollapsed ? <FaBars size={20} /> : <FaTimes size={20} />}
          </div>
        </button>
      </div>
    )}

    {/* Regular section header for other sections */}
    {title !== "Market" && !isCollapsed && (
      <div className="text-gray-500 text-sm mb-3 font-medium tracking-wide uppercase opacity-70 transition-all duration-300 ease-in-out transform">
        {title}
      </div>
    )}

    <ul
      className={`${
        isCollapsed ? "space-y-3" : "space-y-1"
      } transition-all duration-300 ease-in-out`}
    >
      {children}
    </ul>
  </div>
);

const SidebarItem = ({ icon, text, to, isCollapsed, toggleSidebar }) => {
  const handleClick = () => {
    if (!isCollapsed) {
      toggleSidebar(); // Collapse sidebar only if it's currently expanded
    }
  };

  return (
    <li className="group">
      <NavLink
        to={to}
        onClick={handleClick}
        className={({ isActive }) =>
          `flex items-center gap-3 mx-2 px-3 py-3 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 ${
            isActive
              ? "bg-gradient-to-r from-jewel-500 to-jewel-600 text-white rounded-xl shadow-lg shadow-jewel-500/25"
              : "text-gray-700 hover:bg-gradient-to-r hover:from-jewel-50 hover:to-jewel-100 hover:text-jewel-700 rounded-xl hover:shadow-md"
          } ${isCollapsed ? "justify-center" : ""} relative overflow-hidden`
        }
      >
        {/* Background animation effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-jewel-400 to-jewel-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ease-in-out rounded-xl"></div>

        <span
          className={`text-lg transition-all duration-300 ease-in-out relative z-10 ${
            isCollapsed ? "transform group-hover:scale-110" : ""
          }`}
        >
          {icon}
        </span>

        {!isCollapsed && (
          <span className="text-sm md:text-base font-medium transition-all duration-300 ease-in-out relative z-10 group-hover:translate-x-1">
            {text}
          </span>
        )}

        {/* Tooltip for collapsed state */}
        {isCollapsed && (
          <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out whitespace-nowrap z-50 shadow-lg">
            {text}
            <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900"></div>
          </div>
        )}
      </NavLink>
    </li>
  );
};

export default Sidebar;
