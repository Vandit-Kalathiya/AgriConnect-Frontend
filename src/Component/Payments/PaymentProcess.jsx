import React, { useState, useEffect } from "react";
import api from "../../config/axiosInstance";
import { useLocation, useNavigate } from "react-router-dom";
import { API_CONFIG } from "../../config/apiConfig";
import {
  Loader2,
  FileText,
  Download,
  CreditCard,
  CheckCircle2,
  XCircle,
  Truck,
  Clock,
  ThumbsUp,
  AlertTriangle,
  Package,
  ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";
import PaymentDetails from "./PaymentDetails";
import DeliveryStatus from "./DeliveryStatus";
import RejectionModal from "./RejectionModal";

const PaymentProcess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { order } = location.state || {};

  useEffect(() => {
    if (!order) {
      navigate("/my-orders");
      toast.error("Invalid order. Please try again.");
      return;
    }
  }, [order, navigate]);

  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(order?.amount);
  const [pdfHash, setPdfHash] = useState("");
  const [paymentCompleted, setPaymentCompleted] = useState(
    order?.status === "paid_pending_delivery" ? true : false,
  );
  const [deliveryStatus, setDeliveryStatus] = useState("waiting");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionComment, setRejectionComment] = useState("");
  const [redirecting, setRedirecting] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(5);

  // Farmer and buyer blockchain addresses
  const farmerAddress = order?.farmerAddress;
  const buyerAddress = order?.buyerAddress;

  const handleNavigateToPayments = () => {
    navigate("/my-payments");
  };

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Effect to handle redirect after verification
  useEffect(() => {
    if (deliveryStatus === "paid_pending_delivery" && !redirecting) {
      setRedirecting(true);

      const countdownInterval = setInterval(() => {
        setRedirectCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            window.location.href = "/my-orders";
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdownInterval);
    }
  }, [deliveryStatus, redirecting]);

  const handlePayNow = async () => {
    if (paymentCompleted) {
      toast.error("Payment already completed.");
      return;
    }

    setLoading(true);

    try {
      const paymentData = new FormData();
      paymentData.append("farmerAddress", farmerAddress);
      paymentData.append("buyerAddress", buyerAddress);
      paymentData.append("orderId", order?.id);
      paymentData.append("amount", Math.round(amount));

      const response = await api.post(
        `${API_CONFIG.CONTRACT_FARMING}/api/payments/create-order`,
        paymentData
      );

      const razorpayData = response.data;
      setPdfHash(razorpayData.pdfHash);

      const options = {
        key: razorpayData.keyId,
        amount: razorpayData.amount,
        currency: razorpayData.currency,
        name: "AgriConnect",
        description: "Escrow Payment for Crop Order",
        order_id: razorpayData.razorpayOrderId,
        handler: async function (response) {
          try {
            const verifyResponse = await fetch(
              `${API_CONFIG.CONTRACT_FARMING}/api/payments/payment-callback`,
              {
                method: "POST",
                credentials: "include",
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
                body: `razorpay_order_id=${response.razorpay_order_id}&razorpay_payment_id=${response.razorpay_payment_id}&razorpay_signature=${response.razorpay_signature}`,
              },
            );

            const verifyData = await verifyResponse.json();
            console.log(verifyData);

            if (verifyData.success) {
              const listingId = order?.listingId || verifyData.data.listingId;
              const quantity = order?.quantity || verifyData.data.quantity;
              const updateListingStatus = await api.put(
                `${API_CONFIG.MARKET_ACCESS}/listings/${listingId}/archived/${quantity}`,
              );
              if (!updateListingStatus.status === 200) {
                const errorText = await updateListingStatus.text();
                toast.error(
                  `Failed to update listing status: ${updateListingStatus.status} - ${errorText}`,
                );
                throw new Error(
                  `Failed to update listing status: ${updateListingStatus.status} - ${errorText}`,
                );
              } else {
                toast.success("Listing updated successfully");
              }
              setPaymentCompleted(true);
              toast.success(verifyData.message);
              window.location.href = `${window.location.origin}/my-orders`;
            } else {
              toast.error("Payment verification failed.");
            }
          } catch (verifyError) {
            console.error("Payment verification failed:", verifyError);
            toast.error("Payment verification failed.");
          }
        },
        prefill: {
          name: order?.buyerName || "Buyer",
          email: "buyer@example.com",
          contact: order?.buyerContact || "9123456789",
        },
        theme: { color: "#34855a" },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Payment initialization failed:", error);
      toast.error("Payment initialization failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyDelivery = () => {
    setDeliveryStatus("verified");
    setRedirecting(true);
  };

  const handleOpenRejectModal = () => {
    setShowRejectModal(true);
  };

  const handleCloseRejectModal = () => {
    setShowRejectModal(false);
  };

  const handleConfirmRejection = () => {
    if (!rejectionReason) {
      alert("Please select a reason for rejection");
      return;
    }

    setDeliveryStatus("rejected");
    setShowRejectModal(false);

    console.log("Rejection data:", {
      reason: rejectionReason,
      comment: rejectionComment,
      contractHash: pdfHash,
    });
  };

  const simulateDelivery = () => {
    setDeliveryStatus("delivered");
  };

  return (
    <>
      <div className="bg-gray-50 min-h-[calc(100vh-3.5rem)] md:ml-20 overflow-x-hidden">
        <div className="mx-auto max-w-4xl py-8 px-4 md:px-6">
          <div className="bg-white rounded-lg shadow-xl mb-6 overflow-hidden">
            <div className="p-6 pb-3 border-b">
              <h2 className="text-2xl font-bold text-center text-emerald-800">
                Order Payment
              </h2>
              <p className="text-center text-gray-500">
                Review your order and proceed with payment
              </p>
            </div>

            <div className="p-6 space-y-6">
              <PaymentDetails amount={amount} />

              {paymentCompleted && (
                <div className="mt-4">
                  <h3 className="font-semibold text-lg mb-3">
                    Delivery Status
                  </h3>
                  <DeliveryStatus
                    deliveryStatus={deliveryStatus}
                    rejectionReason={rejectionReason}
                    rejectionComment={rejectionComment}
                    redirecting={redirecting}
                    redirectCountdown={redirectCountdown}
                    handleVerifyDelivery={handleVerifyDelivery}
                    handleOpenRejectModal={handleOpenRejectModal}
                    handleNavigateToPayments={handleNavigateToPayments}
                  />
                </div>
              )}
            </div>

            <div className="flex justify-center border-t p-6">
              {!paymentCompleted ? (
                <button
                  onClick={handlePayNow}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white w-full max-w-md text-lg py-3 px-6 rounded-md flex items-center justify-center transition-all duration-300"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-5 w-5" />
                      Proceed to Payment
                    </>
                  )}
                </button>
              ) : (
                deliveryStatus === "waiting" && (
                  <button
                    onClick={simulateDelivery}
                    className="bg-blue-600 hover:bg-blue-700 text-white w-full max-w-md text-lg py-3 px-4 rounded-md flex items-center justify-center transition-all duration-300"
                  >
                    <Truck className="mr-2 h-5 w-5" />
                    Simulate Delivery (Demo Only)
                  </button>
                )
              )}
            </div>
          </div>

          <div className="text-center text-sm text-gray-500">
            <p>
              This payment is securely processed through Razorpay. Your
              transaction details will be stored on the blockchain after
              successful payment.
            </p>
          </div>
        </div>
      </div>

      {showRejectModal && (
        <RejectionModal
          rejectionReason={rejectionReason}
          setRejectionReason={setRejectionReason}
          rejectionComment={rejectionComment}
          setRejectionComment={setRejectionComment}
          handleCloseRejectModal={handleCloseRejectModal}
          handleConfirmRejection={handleConfirmRejection}
        />
      )}
    </>
  );
};

export default PaymentProcess;
