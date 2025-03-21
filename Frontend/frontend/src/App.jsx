import React from "react";
import "./App.css";
import Navbar from "./Component/Navbar/Navbar";
import Dashboard from "./Component/Dashboard/Dashboard";
import Sidebar from "./Component/Dashboard/Sidebar";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { CropListingPage } from "./Component/MarketPlace/CropListingPage";
import { CropDetailPage } from "./Component/MarketPlace/CropDetailPage";
import { MyListing } from "./Component/MyProducts/MyListing";
import Payments from "./Component/Payments/Payments";
import Contracts from "./Component/MyContracts/MyContracts";
import { MantineProvider } from "@mantine/core";
import ListingForm from "./Component/ListProductForm/ListingForm";
import WeatherDashboard from "./Component/Weather/WeatherDashboard";
import MarketTrendsDashboard from "./Component/MarketTrends/MarketTrendsDashboard";
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
  const isAuthenticated = !!getUsernameFromToken();
  // console.log("Is authenticated:", isAuthenticated);

  return (
    <MantineProvider>
      <ToastContainer />
      {/* <BrowserRouter> */}
      {/* <ToastContainer> */}
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
        {/* <Route
            path="/register"
            element={
              <PublicRoute>
                <AuthPage />
              </PublicRoute>
            }
          /> */}
        <Route
          path="/"
          element={
            // <PublicRoute>
            <HomePage />
            // </PublicRoute>
          }
        />

        {/* Protected routes: Only accessible when logged in */}
        <Route
          path="*"
          element={
            <PrivateRoute>
              <div className="flex flex-col h-screen font-poppins">
                <Navbar />
                <div className="flex flex-1 relative">
                  <Sidebar />
                  <main className="flex-1 ml-16 md:ml-0">
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/crops" element={<CropListingPage />} />
                      <Route path="/crop/:id" element={<CropDetailPage />} />
                      <Route path="/my-listing" element={<MyListing />} />
                      <Route path="/my-payments" element={<Payments />} />
                      <Route path="/my-contracts" element={<Contracts />} />
                      <Route path="/list" element={<ListingForm />} />
                      <Route path="/advisory" element={<Index/>} />
                      <Route path="/weather" element={<WeatherDashboard />} />
                      <Route
                        path="/market-trends"
                        element={<MarketTrendsDashboard />}
                      />
                      <Route
                        path="/cold-storage"
                        element={<ColdStoragePage />}
                      />
                      <Route path="/agriprice" element={<Agriprice />} />
                      <Route path="/profile" element={<UserProfile />} />
                      <Route path="/my-orders" element={<MyOrders />} />
                      <Route
                        path="/payment-process"
                        element={<PaymentProcess />}
                      />
                      {/* Default route */}
                      {/* <Route path="/" element={<Dashboard />} /> */}
                    </Routes>
                  </main>
                </div>
              </div>
            </PrivateRoute>
          }
        />
      </Routes>
      {/* </ToastContainer> */}
      {/* </BrowserRouter> */}
    </MantineProvider>
  );
}

export default App;
