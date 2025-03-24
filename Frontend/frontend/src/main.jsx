import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import { Toaster } from "./Component/CropAdvisoryBot/components/ui/Toaster.jsx";
import { Toaster as Sonner } from "./Component/CropAdvisoryBot/components/ui/Sonner.jsx";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { TooltipProvider } from "./Component/CropAdvisoryBot/components/ui/Tooltip.jsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <BrowserRouter>
    <TooltipProvider>
      <Toaster
        position="bottom-right"
        containerClassName="font-poppins"
        toastOptions={{ duration: 4000 }}
      />
      <Sonner />
      <App />
    </TooltipProvider>
  </BrowserRouter>
);
