import React, { useState, useEffect, useRef } from "react";
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
  Eye,
  ChevronDown,
  AlertTriangle,
} from "lucide-react";

// Terms and Conditions Popup Component
const TermsAndConditionsModal = ({ isOpen, onClose, onAccept }) => {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState(null);
  const contentRef = useRef(null);
  const sectionRefs = useRef({});

  // Reset scroll state when modal opens
  useEffect(() => {
    if (isOpen) {
      setHasScrolledToBottom(false);
      setActiveSectionId("intro");
    }
  }, [isOpen]);

  // Handle scroll event to detect when user reaches bottom and active section
  const handleScroll = (e) => {
    // Check if scrolled to bottom
    const bottom =
      Math.abs(
        e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight
      ) < 5;

    if (bottom) {
      setHasScrolledToBottom(true);
    }

    // Determine active section based on scroll position
    const scrollPosition = e.target.scrollTop + 100;

    // Find the section that is currently in view
    const sectionIds = Object.keys(sectionRefs.current);
    for (let i = sectionIds.length - 1; i >= 0; i--) {
      const id = sectionIds[i];
      const section = sectionRefs.current[id];
      if (section && scrollPosition >= section.offsetTop) {
        setActiveSectionId(id);
        break;
      }
    }
  };

  const scrollToSection = (sectionId) => {
    const section = sectionRefs.current[sectionId];
    if (section && contentRef.current) {
      contentRef.current.scrollTo({
        top: section.offsetTop - 20,
        behavior: "smooth",
      });
    }
  };

  if (!isOpen) return null;

  const sections = [
    {
      id: "intro",
      title: "Introduction",
      icon: <BookOpen className="h-5 w-5" />,
      content:
        'This agreement ("Agreement") is entered into between you ("Buyer") and the agricultural producer ("Farmer") listed on the AgriConnect platform. This Agreement governs all transactions conducted through the AgriConnect marketplace.',
      important: true,
    },
    {
      id: "contract",
      title: "Contract Formation",
      icon: <FileText className="h-5 w-5" />,
      content:
        "This agreement constitutes a formal offer to purchase agricultural products under the terms specified in the subsequent Contract Agreement. Once accepted by both parties, this document becomes a legally binding contract governed by applicable commercial and agricultural laws. Neither party may modify these terms without written consent from the other party.",
    },
    {
      id: "payment",
      title: "Payment Terms",
      icon: <DollarSign className="h-5 w-5" />,
      content:
        "You agree to make payments according to the schedule defined in the Contract Agreement. Escrow services may be used to hold funds until delivery conditions are met. Late payments will incur a 1.5% monthly interest charge. All payments must be made through the AgriConnect platform to ensure transaction security and verification. Direct payments to farmers outside the platform are strictly prohibited and void all platform protections.",
    },
    {
      id: "quality",
      title: "Quality Standards",
      icon: <Scale className="h-5 w-5" />,
      content:
        "Products must meet the quality specifications outlined in the Contract Agreement. You have the right to inspect products upon delivery and may reject items that fail to meet the agreed standards. Quality disputes must be raised within 24 hours of delivery with photographic evidence. An independent quality assessment may be requested at the expense of the party found to be in error. The Farmer guarantees that all products comply with applicable food safety regulations.",
    },
    {
      id: "delivery",
      title: "Delivery Terms",
      icon: <Truck className="h-5 w-5" />,
      content:
        "Delivery will be made according to the timeline and location specified in the Contract Agreement. Risk of loss transfers upon successful delivery and acceptance. The Farmer must provide tracking information when applicable. Delivery delays due to circumstances beyond the Farmer's control (weather, transportation issues) must be communicated promptly. Alternative delivery arrangements may be negotiated in good faith between parties.",
    },
    {
      id: "disputes",
      title: "Dispute Resolution",
      icon: <MessageSquare className="h-5 w-5" />,
      content:
        "Any disputes arising from this contract will first be resolved through negotiation, then mediation, and finally through binding arbitration if necessary. Dispute resolution costs will be shared equally unless otherwise determined by the arbitrator. All disputes must first be reported through the AgriConnect platform's dispute resolution system. The platform will facilitate communication between parties and provide documentation of resolution attempts.",
    },
    {
      id: "fees",
      title: "Platform Fees",
      icon: <CreditCard className="h-5 w-5" />,
      content:
        "AgriConnect charges a service fee of 2% on the total transaction value, which is included in the final price shown. Additional fees may apply for premium services or expedited processing. All fees are non-refundable once a transaction has been completed. The fee structure ensures the platform can provide secure transactions, quality verification, and dispute resolution services.",
    },
    {
      id: "cancellation",
      title: "Cancellation Policy",
      icon: <Calendar className="h-5 w-5" />,
      content:
        "Cancellation requests must be made within 24 hours of contract submission. Late cancellations may incur a fee of up to 10% of the contract value. Repeated cancellations may result in account restrictions. Force majeure events may qualify for fee-free cancellations at the discretion of AgriConnect. Documentation may be required to substantiate force majeure claims.",
    },
    {
      id: "law",
      title: "Governing Law",
      icon: <Globe className="h-5 w-5" />,
      content:
        "This agreement is governed by the applicable agricultural trade laws of your jurisdiction. Any legal proceedings shall be conducted in the jurisdiction of the defendant. Both parties agree to comply with all applicable regulations regarding agricultural trade, food safety, and commerce. The invalidity or unenforceability of any provision shall not affect the validity of the remaining provisions.",
    },
    {
      id: "liability",
      title: "Limitation of Liability",
      icon: <Shield className="h-5 w-5" />,
      content:
        "AgriConnect's liability is limited to facilitating the transaction and cannot exceed the total transaction value. Neither AgriConnect nor the Farmer shall be liable for any indirect, incidental, special, consequential or punitive damages resulting from any breach of this Agreement. All parties agree to maintain appropriate insurance coverage related to their business activities.",
    },
  ];

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-xl max-w-4xl w-full shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-jewel-50 to-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-jewel-600" />
            <h2 className="text-xl font-bold text-gray-800">
              Terms & Conditions
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition-colors p-1.5 rounded-full hover:bg-gray-100"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Introduction Banner */}
        <div className="bg-gradient-to-r from-jewel-100 to-jewel-50 p-5 border-b border-jewel-200">
          <div className="flex items-start gap-4">
            <AlertCircle className="h-6 w-6 text-jewel-700 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-lg text-jewel-800">
                AgriConnect Purchase Agreement
              </h3>
              <p className="text-jewel-700 mt-1">
                By accepting these terms, you agree to enter into a legally
                binding contract with the farmer for the purchase of
                agricultural products through the AgriConnect platform.
              </p>
              <p className="text-jewel-700 mt-2 text-sm italic">
                Please read all sections carefully before accepting. You must
                scroll through the entire agreement to enable the accept button.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Navigation Sidebar */}
          <div className="hidden md:block w-64 border-r border-gray-200 bg-gray-50 overflow-y-auto">
            <nav className="p-4 space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2.5 transition-colors ${
                    activeSectionId === section.id
                      ? "bg-jewel-100 text-jewel-800"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <span
                    className={`${
                      activeSectionId === section.id
                        ? "text-jewel-600"
                        : "text-gray-500"
                    }`}
                  >
                    {section.icon}
                  </span>
                  <span className="text-sm font-medium">{section.title}</span>
                  {section.important && (
                    <span className="ml-auto">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Main content */}
          <div
            ref={contentRef}
            className="flex-1 overflow-y-auto p-6 space-y-8 text-gray-700"
            onScroll={handleScroll}
          >
            {sections.map((section) => (
              <div
                key={section.id}
                ref={(el) => (sectionRefs.current[section.id] = el)}
                className="group scroll-mt-6"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className={`p-2 rounded-full ${
                      activeSectionId === section.id
                        ? "bg-jewel-100 text-jewel-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {section.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                      {section.title}
                      {section.important && (
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                      )}
                    </h4>
                    <p className="text-gray-600 mt-2 leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                </div>

                {/* Divider */}
                {sections.indexOf(section) < sections.length - 1 && (
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mt-8" />
                )}
              </div>
            ))}

            {/* Warning message at the bottom */}
            <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-lg my-8">
              <div className="flex items-start">
                <AlertTriangle className="h-6 w-6 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="text-lg font-semibold text-red-700 mb-1">
                    Legal Warning
                  </h4>
                  <p className="text-red-600 font-medium">
                    Failure to comply with any terms or conditions outlined in
                    this agreement may result in account suspension, financial
                    penalties, or legal action. By accepting these terms, you
                    acknowledge that you have read and understood all provisions
                    of this agreement.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress indicator (mobile only) */}
        <div className="md:hidden border-t border-gray-200 p-3 bg-gray-50">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>Scroll to review all sections</span>
            <span
              className={
                hasScrolledToBottom ? "text-jewel-600 font-medium" : ""
              }
            >
              {hasScrolledToBottom ? "Completed" : "In progress"}
            </span>
          </div>
          <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-jewel-500 h-full rounded-full transition-all duration-300"
              style={{ width: hasScrolledToBottom ? "100%" : "30%" }}
            ></div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-200 bg-gray-50 sticky bottom-0 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="text-sm flex items-center">
            {!hasScrolledToBottom ? (
              <>
                <ChevronDown className="h-4 w-4 mr-2 text-amber-500 animate-bounce" />
                <span className="text-amber-700 font-medium">
                  Please scroll to the bottom to enable acceptance
                </span>
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2 text-jewel-600" />
                <span className="text-jewel-700">
                  You've reviewed all terms
                </span>
              </>
            )}
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Decline
            </button>
            <button
              onClick={onAccept}
              disabled={!hasScrolledToBottom}
              className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors font-medium ${
                hasScrolledToBottom
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <Check className="h-4 w-4" />I Accept All Terms
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditionsModal;
