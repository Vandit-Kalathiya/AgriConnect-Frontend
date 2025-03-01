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
      className={`bg-white h-screen fixed top-0 left-0 shadow-md border-r border-slate-300 transition-all duration-300 z-40 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Toggle Button */}
      <div className="p-4 flex justify-between items-center mt-20">
        <button
          onClick={toggleSidebar}
          className="text-gray-600 hover:text-jewel-700 focus:outline-none cursor-pointer pl-2.5"
        >
          {isCollapsed ? <FaBars size={24} /> : <FaTimes size={24} />}
        </button>
      </div>

      {/* Sidebar Content */}
      <div className={`${isCollapsed ? "space-y-4" : "space-y-2"}`}>
        <SidebarSection title="Market" isCollapsed={isCollapsed}>
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

        <SidebarSection title="Insights" isCollapsed={isCollapsed}>
          <SidebarItem
            icon={<HiTrendingUp />}
            text="Market Trends"
            to="/market-trends"
            isCollapsed={isCollapsed}
            toggleSidebar={toggleSidebar}
          />
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

        <SidebarSection title="Operations" isCollapsed={isCollapsed}>
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

const SidebarSection = ({ title, children, isCollapsed }) => (
  <div className={`${isCollapsed ? "px-4 py-2" : "px-4 py-2"}`}>
    {!isCollapsed && <div className="text-gray-500 text-sm mb-2">{title}</div>}
    <ul className={isCollapsed ? "space-y-4" : "space-y-2"}>{children}</ul>
  </div>
);

const SidebarItem = ({ icon, text, to, isCollapsed, toggleSidebar }) => {
  const handleClick = () => {
    if (!isCollapsed) {
      toggleSidebar(); // Collapse sidebar only if it's currently expanded
    }
  };

  return (
    <li>
      <NavLink
        to={to}
        onClick={handleClick}
        className={({ isActive }) =>
          `flex items-center gap-3 px-4 py-3 transition-colors duration-200 ${
            isActive
              ? "bg-jewel-500 text-white rounded-lg"
              : "text-gray-800 hover:bg-jewel-700 hover:text-white rounded-lg"
          } ${isCollapsed ? "justify-center" : ""}`
        }
      >
        <span className="text-lg">{icon}</span>
        {!isCollapsed && <span className="text-sm md:text-md">{text}</span>}
      </NavLink>
    </li>
  );
};

export default Sidebar;
