import React, { useEffect, useState } from "react";
import Login from "./Login"
import SignUp from "./SignUp";
import leafImg from "../../assets/leaf.png";
import { useLocation } from "react-router-dom";

const AuthPage = () => {
  const [currentPage, setCurrentPage] = useState("login");
  const location = useLocation();

  const navigateToSignUp = () => {
    setCurrentPage("signup");
  };

  const navigateToLogin = () => {
    setCurrentPage("login");
  };

  useEffect(() => {
    if (location.state && location.state.defaultView) {
      setCurrentPage(location.state.defaultView);
    }
  }, [location.state]);

  return (
    <div className="flex min-h-screen overflow-hidden w-full">
      {/* left section with blurred image and centered message */}
      <div className="relative w-1/2 hidden md:block">
        <div className="absolute inset-0 bg-black/20 z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449"
          alt="Agriculture background"
          className="h-full w-full object-cover filter blur-[2px]"
        />
        
        {/* Centered welcome message */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-8 text-white">
          <h2 className="text-4xl font-bold mb-4">Welcome to AgriConnect</h2>
          <p className="text-xl text-center max-w-md">
            Connect directly with buyers and sellers in the agricultural marketplace. Get fair prices, secure contracts, and real-time market insights.
          </p>
        </div>
      </div>

      {/* right section */}
      <div className="flex justify-center items-center w-full md:w-1/2 bg-gray-50">
        <div className="w-full max-w-md ">
          <div className="flex items-center gap-x-2 mb-6">
            <img src={leafImg} width={40} alt="Leaf icon" />
            <h1 className="text-3xl font-bold text-[#34854a]">AgriConnect</h1>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            {currentPage === "login" ? (
              <Login onNavigateToSignUp={navigateToSignUp} />
            ) : (
              <SignUp onNavigateToLogin={navigateToLogin} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;