import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import axios from "axios";
import toast from "react-hot-toast";

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
  });

  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(order?.amount); // Default from order or 12500
  const [pdfHash, setPdfHash] = useState("");
  const [paymentCompleted, setPaymentCompleted] = useState(
    order?.status === "paid_pending_delivery" ? true : false
  );
  const [deliveryStatus, setDeliveryStatus] = useState("waiting");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionComment, setRejectionComment] = useState("");
  const [redirecting, setRedirecting] = useState(false);
  const [contractFile, setContractFile] = useState(null); // New state for uploaded file
  const [redirectCountdown, setRedirectCountdown] = useState(5); // Countdown for redirect

  // Farmer and buyer blockchain addresses (hidden from UI, adjust as needed)
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

  const handleDownloadContract = () => {
    if (!contractFile) {
      alert("No contract file uploaded yet!");
      return;
    }

    // Trigger download of the uploaded file
    const url = window.URL.createObjectURL(contractFile);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Contract_${order?.id || "agreement"}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    alert("Downloading contract PDF...");
  };

  const handlePayNow = async () => {
    if (paymentCompleted) {
      toast.error("Payment already completed.");
      return;
    }

    setLoading(true);

    if (!contractFile) {
      alert("Please upload the agreement file before proceeding with payment");
      setLoading(false);
      return;
    }

    try {
      const paymentData = new FormData();
      paymentData.append("file", contractFile);
      paymentData.append("farmerAddress", farmerAddress);
      paymentData.append("buyerAddress", buyerAddress);
      paymentData.append("orderId", order?.id);
      paymentData.append("amount", Math.round(amount));

      const response = await axios.post(
        "http://localhost:2526/api/payments/create-order",
        paymentData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
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
              "http://localhost:2526/api/payments/payment-callback",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
                body: `razorpay_order_id=${response.razorpay_order_id}&razorpay_payment_id=${response.razorpay_payment_id}&razorpay_signature=${response.razorpay_signature}`,
              }
            );

            const verifyData = await verifyResponse.json();
            // console.log(verifyData);
            
            if (verifyData.success) {
              setPaymentCompleted(true);
              // localStorage.setItem(
              //   `paymentStatus_${order?.id}`,
              //   "paid_pending_delivery"
              // );
              toast.success(verifyData.message);
              window.location.href = "http://localhost:5173/my-orders";
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

  const renderDeliveryStatus = () => {
    // ... (unchanged from your original code)
    switch (deliveryStatus) {
      case "waiting":
        return (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-blue-900">
                  Waiting for Delivery
                </h3>
                <p className="text-sm text-blue-700">
                  The farmer will confirm when your order is delivered
                </p>
              </div>
            </div>
            <div className="animate-pulse bg-blue-200 h-2 w-24 rounded-full"></div>
          </div>
        );
      case "delivered":
        return (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-yellow-100 p-2 rounded-full">
                <Package className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-medium text-yellow-900">
                  Delivery Confirmed by Farmer
                </h3>
                <p className="text-sm text-yellow-700">
                  Please verify that you've received the goods as per the
                  contract
                </p>
              </div>
            </div>
            <div className="flex gap-3 mt-2">
              <button
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md flex items-center justify-center flex-1"
                onClick={handleVerifyDelivery}
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Verify Delivery
              </button>
              <button
                className="border border-red-300 text-red-700 hover:bg-red-50 px-4 py-2 rounded-md flex items-center justify-center flex-1"
                onClick={handleOpenRejectModal}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Reject Delivery
              </button>
            </div>
          </div>
        );
      case "verified":
        return (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 text-center">
            <div className="flex flex-col items-center gap-2 mb-4">
              <div className="bg-emerald-100 p-3 rounded-full">
                <ThumbsUp className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="font-bold text-emerald-900 text-xl mt-2">
                Delivery Verified!
              </h3>
              <p className="text-emerald-700">
                You have successfully verified the delivery. Payment will be
                released to the farmer.
              </p>
            </div>
            <div className="text-sm text-emerald-600 mt-2">
              Transaction completed on {new Date().toLocaleDateString()}
            </div>
            {redirecting && (
              <button
                onClick={handleNavigateToPayments}
                className="bg-emerald-700 mx-auto mt-4 hover:bg-emerald-800 text-white px-4 py-2 rounded-md flex items-center gap-2"
              >
                <ArrowRight className="h-4 w-4" />
                Go to Payments ({redirectCountdown}s)
              </button>
            )}
          </div>
        );
      case "rejected":
        return (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 p-2 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-medium text-red-900">Delivery Rejected</h3>
                <p className="text-sm text-red-700">
                  Reason: {rejectionReason}{" "}
                  {rejectionComment ? `- ${rejectionComment}` : ""}
                </p>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              A dispute resolution process will begin. Our team will contact you
              shortly.
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const simulateDelivery = () => {
    setDeliveryStatus("delivered");
  };

  return (
    <>
      <div className="mt-16 md:mt-20 bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-4xl py-8 px-4 md:px-6">
          <div className="bg-white rounded-lg shadow-xl mb-6 overflow-hidden">
            <div className="p-6 pb-3 border-b">
              <h2 className="text-2xl font-bold text-center text-emerald-800">
                My Contract
              </h2>
              <p className="text-center text-gray-500">
                Review your contract and proceed with payment
              </p>
            </div>

            <div className="p-6 space-y-6">
              {/* New File Upload Section */}
              <div className="bg-emerald-50 p-4 rounded-md border border-emerald-200">
                <label className="block font-medium mb-2 text-emerald-800">
                  Upload Agreement File
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setContractFile(e.target.files[0])}
                  className="w-full p-2 border border-gray-300 rounded-md text-gray-700"
                />
                {contractFile && (
                  <div className="mt-2 flex items-center gap-2 text-emerald-600">
                    <FileText className="h-4 w-4" />
                    <span>{contractFile.name}</span>
                    <button
                      onClick={handleDownloadContract}
                      className="ml-2 text-emerald-600 hover:text-emerald-800 flex items-center gap-1"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </button>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Please upload the signed contract agreement (PDF format only)
                </p>
              </div>

              <div>
                <label className="block font-medium mb-2">Payment Amount</label>
                <input
                  type="text"
                  value={`₹ ${amount?.toLocaleString()}`}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md font-semibold text-lg text-emerald-700 bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This is the total contract value as specified in the agreement
                </p>
              </div>

              {paymentCompleted && (
                <div className="mt-4">
                  <h3 className="font-semibold text-lg mb-3">
                    Delivery Status
                  </h3>
                  {renderDeliveryStatus()}
                </div>
              )}
            </div>

            <div className="flex justify-center border-t p-6">
              {!paymentCompleted ? (
                <button
                  onClick={handlePayNow}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white w-full max-w-md text-lg py-3 px-6 rounded-md flex items-center justify-center transition-all duration-300"
                  disabled={loading || !contractFile}
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
              This payment is securely processed through Razorpay. Your contract
              will be stored on the blockchain after successful payment.
            </p>
          </div>
        </div>
      </div>

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Reject Delivery
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for rejection:
              </label>
              <select
                className="w-full p-2 border rounded-md focus:ring focus:ring-red-300 focus:border-red-500 focus:outline-none"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              >
                <option value="">Select a reason</option>
                <option value="Product quality does not match contract specifications">
                  Product quality does not match contract specifications
                </option>
                <option value="Incomplete delivery - missing items">
                  Incomplete delivery - missing items
                </option>
                <option value="Damaged goods received">
                  Damaged goods received
                </option>
                <option value="Incorrect items delivered">
                  Incorrect items delivered
                </option>
                <option value="Delayed delivery beyond acceptable timeframe">
                  Delayed delivery beyond acceptable timeframe
                </option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional comments:
              </label>
              <textarea
                className="w-full p-2 border rounded-md h-24 focus:ring focus:ring-red-300 focus:border-red-500 focus:outline-none"
                placeholder="Please provide details about the issue..."
                value={rejectionComment}
                onChange={(e) => setRejectionComment(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                className="border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-50"
                onClick={handleCloseRejectModal}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center"
                onClick={handleConfirmRejection}
                disabled={!rejectionReason}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PaymentProcess;
