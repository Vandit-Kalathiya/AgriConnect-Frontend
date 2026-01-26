import React from "react";
import "./App.css";
import Navbar from "./Component/Navbar/Navbar";
import Dashboard from "./Component/Dashboard/Dashboard";
import Sidebar from "./Component/Dashboard/Sidebar";
import { BrowserRouter, Route, Routes, Navigate, Link } from "react-router-dom";
import { CropListingPage } from "./Component/MarketPlace/CropListingPage";
import CropDetailPage from "./Component/MarketPlace/CropDetailPage";
import { MyListing } from "./Component/MyProducts/MyListing";
import Payments from "./Component/Payments/Payments";
import Contracts from "./Component/MyContracts/MyContracts";
import { MantineProvider } from "@mantine/core";
import ListingForm from "./Component/ListProductForm/ListingForm";
import WeatherDashboard from "./Component/Weather/WeatherDashboard";
import UserProfile from "./Component/UserProfile/UserProfile";
import PaymentProcess from "./Component/Payments/PaymentProcess";
import AuthPage from "./Component/Auth/AuthPage";
import { getUsernameFromToken } from "../helper";
import HomePage from "./Component/HomePage/HomePage";
import ColdStoragePage from "./Component/ColdStorage/ColdStorage";
import Agriprice from "./Component/ColdStorage/AgriPrice";
import { ToastContainer } from "react-toastify";
import MyOrders from "./Component/MyOrders/MyOrders";
import Index from "./Component/CropAdvisoryBot/Index";
import ChatbotButton from "./Component/Dashboard/ChatbotButton";
import Index_Bot from "./Component/KisanMitra/Pages/Index";
import QrDetailsPopup from "./Component/MarketPlace/QrDetailsPopup";
import Index2 from "./Component/MarketTrends/Pages/Index2";
import Trends from "./Component/MarketTrends/Pages/Trends";
import Market from "./Component/MarketTrends/Pages/Market";
import Insights from "./Component/MarketTrends/Pages/Insights";
import CropDetail from "./Component/MarketTrends/Pages/CropDetail";

const Layout = ({ children }) => (
  <div className="flex flex-col h-screen font-poppins">
    <Navbar />
    <div className="flex flex-1 relative">
      <Sidebar />
      <main className="flex-1 ml-16 md:ml-0">{children}</main>
    </div>
  </div>
);

// PrivateRoute component to protect authenticated routes
const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!getUsernameFromToken(); // Check if user is logged in
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

// PublicRoute component to restrict logged-in users from login/register
const PublicRoute = ({ children }) => {
  const isAuthenticated = !!getUsernameFromToken(); // Check if user is logged in
  return isAuthenticated ? <Navigate to="/dashboard" /> : children;
};

function App() {
  return (
    <MantineProvider>
      <ToastContainer />
      <Routes>
        {/* Public routes: Only accessible when not logged in */}
        <Route
          path="/auth"
          element={
            <PublicRoute>
              <AuthPage />
            </PublicRoute>
          }
        />
        <Route path="/" element={<HomePage />} />

        {/* Protected routes with layout */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/crops"
          element={
            <PrivateRoute>
              <Layout>
                <CropListingPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/crop/:id"
          element={
            <PrivateRoute>
              <Layout>
                <CropDetailPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/qr-details/:id"
          element={
            <PrivateRoute>
              <Layout>
                <QrDetailsPopup />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/my-listing"
          element={
            <PrivateRoute>
              <Layout>
                <MyListing />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/my-payments"
          element={
            <PrivateRoute>
              <Layout>
                <Payments />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/my-contracts"
          element={
            <PrivateRoute>
              <Layout>
                <Contracts />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/list"
          element={
            <PrivateRoute>
              <Layout>
                <ListingForm />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/weather"
          element={
            <PrivateRoute>
              <Layout>
                <WeatherDashboard />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/crop-advisory"
          element={
            <PrivateRoute>
              <Layout>
                <Index />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/market-trends"
          element={
            <PrivateRoute>
              <Layout>
                <Index2 />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/trends"
          element={
            <PrivateRoute>
              <Layout>
                <Trends />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/market"
          element={
            <PrivateRoute>
              <Layout>
                <Market />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/insights"
          element={
            <PrivateRoute>
              <Layout>
                <Insights />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/crop/market/:cropId"
          element={
            <PrivateRoute>
              <Layout>
                <CropDetail />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/cold-storage"
          element={
            <PrivateRoute>
              <Layout>
                <ColdStoragePage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/agriprice"
          element={
            <PrivateRoute>
              <Layout>
                <Agriprice />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Layout>
                <UserProfile />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <Layout>
                <MyOrders />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/my-orders"
          element={
            <PrivateRoute>
              <Layout>
                <MyOrders />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/payment-process"
          element={
            <PrivateRoute>
              <Layout>
                <PaymentProcess />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/support"
          element={
            <PrivateRoute>
              <Layout>
                <Index_Bot />
              </Layout>
            </PrivateRoute>
          }
        />
      </Routes>
      <ChatbotButton />
    </MantineProvider>
  );
}

export default App;
