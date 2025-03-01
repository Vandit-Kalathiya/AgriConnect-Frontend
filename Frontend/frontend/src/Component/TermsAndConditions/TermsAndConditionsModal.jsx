import React, { useState, useEffect } from "react";
import {
  X,
  Check,
  AlertCircle,
  XCircle,
  CreditCard,
  Clock,
  FileText,
  Shield,
  BookOpen,
  Truck,
  Scale,
  MessageSquare,
  DollarSign,
  Calendar,
  Globe,
} from "lucide-react";

// Terms and Conditions Popup Component
const TermsAndConditionsModal = ({ isOpen, onClose, onAccept }) => {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  // Reset scroll state when modal opens
  useEffect(() => {
    if (isOpen) {
      setHasScrolledToBottom(false);
    }
  }, [isOpen]);

  // Handle scroll event to detect when user reaches bottom
  const handleScroll = (e) => {
    const bottom =
      Math.abs(
        e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight
      ) < 5;
    if (bottom) {
      setHasScrolledToBottom(true);
    }
  };

  if (!isOpen) return null;

  const sections = [
    {
      id: "contract",
      title: "1. Contract Formation",
      icon: <FileText className="h-5 w-5 text-jewel-600" />,
      content:
        "This agreement constitutes a formal offer to purchase agricultural products under the terms specified in the subsequent Contract Agreement. Upon acceptance by both parties, this becomes a legally binding contract.",
    },
    {
      id: "payment",
      title: "2. Payment Terms",
      icon: <DollarSign className="h-5 w-5 text-jewel-600" />,
      content:
        "You agree to make payments according to the schedule defined in the Contract Agreement. Escrow services may be used to hold funds until delivery conditions are met.",
    },
    {
      id: "quality",
      title: "3. Quality Standards",
      icon: <Scale className="h-5 w-5 text-jewel-600" />,
      content:
        "Products must meet the quality specifications outlined in the Contract Agreement. You have the right to inspect products upon delivery and may reject items that fail to meet the agreed standards.",
    },
    {
      id: "delivery",
      title: "4. Delivery Terms",
      icon: <Truck className="h-5 w-5 text-jewel-600" />,
      content:
        "Delivery will be made according to the timeline and location specified in the Contract Agreement. Risk of loss transfers upon successful delivery and acceptance.",
    },
    {
      id: "disputes",
      title: "5. Dispute Resolution",
      icon: <MessageSquare className="h-5 w-5 text-jewel-600" />,
      content:
        "Any disputes arising from this contract will first be resolved through negotiation, then mediation, and finally through binding arbitration if necessary.",
    },
    {
      id: "fees",
      title: "6. Platform Fees",
      icon: <CreditCard className="h-5 w-5 text-jewel-600" />,
      content:
        "AgriConnect charges a service fee of 2% on the total transaction value, which is included in the final price shown.",
    },
    {
      id: "cancellation",
      title: "7. Cancellation Policy",
      icon: <Calendar className="h-5 w-5 text-jewel-600" />,
      content:
        "Cancellation requests must be made within 24 hours of contract submission. Late cancellations may incur a fee of up to 10% of the contract value.",
    },
    {
      id: "law",
      title: "8. Governing Law",
      icon: <Globe className="h-5 w-5 text-jewel-600" />,
      content:
        "This agreement is governed by the applicable agricultural trade laws of your jurisdiction.",
    },
  ];

  return (
    <div className="fixed inset-0  bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-xl max-w-2xl w-full shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-jewel-600" />
            <h2 className="text-xl font-bold text-gray-800">
              Terms & Conditions
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Introduction Banner */}
        <div className="bg-jewel-50 p-4 border-b border-jewel-100">
          <div className="flex items-start gap-3">
            <BookOpen className="h-6 w-6 text-jewel-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-lg text-jewel-800">
                AgriConnect Purchase Agreement
              </h3>
              <p className="text-jewel-700 text-sm">
                By accepting these terms, you agree to enter into a legally
                binding contract with the farmer for the purchase of
                agricultural products through the AgriConnect platform.
              </p>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div
          className="flex-1 overflow-y-auto p-6 space-y-6 text-gray-700"
          onScroll={handleScroll}
        >
          {sections.map((section) => (
            <div key={section.id} className="group">
              <div className="flex items-start gap-3 mb-2">
                {section.icon}
                <h4 className="font-semibold text-gray-800">{section.title}</h4>
              </div>
              <p className="text-gray-600 ml-8">{section.content}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 sticky bottom-0 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="text-sm text-gray-500 flex items-center">
            <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
            Please review all terms before accepting
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Decline
            </button>
            <button
              onClick={onAccept}
              disabled={!hasScrolledToBottom}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                hasScrolledToBottom
                  ? "bg-jewel-600 text-white hover:bg-jewel-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <Check className="h-4 w-4" />
              Accept Terms
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditionsModal;
