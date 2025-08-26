import React, { useState, useEffect } from "react";
import { FaShoppingCart, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getCurrentUser } from "../../../helper";
import Loader from "../Loader/Loader";
import OrderList from "./OrderList";
import TrackingModal from "./TrackingModal";
import RejectModal from "./RejectModal";
import VerifyModal from "./VerifyModal";
import toast from "react-hot-toast";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [listings, setListings] = useState({});
  const [images, setImages] = useState({});
  const [activeTab, setActiveTab] = useState("pending_payment");
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionComment, setRejectionComment] = useState("");
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [pendingPaymentCount, setPendingPaymentCount] = useState(0);
  const [inProgressCount, setInProgressCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);

    const user = await getCurrentUser();
    if (!user || !user.id) {
      setError("User not logged in or ID not found");
      setIsLoading(false);
      return;
    }
    setCurrentUser(user);

    try {
      const response = await axios.get(
        `http://localhost:2526/orders/u/${user.uniqueHexAddress}`,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const fetchedOrders = response.data;
      setOrders(fetchedOrders);

      // Calculate counts for each tab
      const pendingPayment = fetchedOrders.filter(
        (order) => order.status === "created"
      ).length;
      const inProgress = fetchedOrders.filter((order) =>
        [
          "paid_pending_delivery",
          "delivered",
          "return_requested",
          "return_confirmed",
        ].includes(order.status)
      ).length;
      const completed = fetchedOrders.filter((order) =>
        ["completed", "refunded"].includes(order.status)
      ).length;

      setPendingPaymentCount(pendingPayment);
      setInProgressCount(inProgress);
      setCompletedCount(completed);

      const listingPromises = fetchedOrders.map((order) =>
        fetchListingById(order.listingId).then((listing) => ({
          orderId: order.id,
          listing,
        }))
      );

      const listingsData = await Promise.all(listingPromises);
      const newListings = listingsData.reduce((acc, { orderId, listing }) => {
        if (listing) acc[orderId] = listing;
        return acc;
      }, {});

      setListings(newListings);

      const imagePromises = Object.entries(newListings).map(
        ([orderId, listing]) =>
          listing?.images?.[0]?.id
            ? fetchImage(listing.images[0].id).then((blobUrl) => ({
                orderId,
                blobUrl,
              }))
            : Promise.resolve({ orderId, blobUrl: null })
      );

      const imagesData = await Promise.all(imagePromises);
      const newImages = imagesData.reduce((acc, { orderId, blobUrl }) => {
        if (blobUrl) acc[orderId] = blobUrl;
        return acc;
      }, {});

      setImages(newImages);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError(error.response?.data || "Failed to fetch orders.");
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchImage = async (imageId) => {
    try {
      const res = await axios.get(`http://localhost:2527/image/${imageId}`, {
        responseType: "blob",
      });
      return URL.createObjectURL(res.data);
    } catch (err) {
      console.error("Failed to fetch image:", err);
      return null;
    }
  };

  const fetchListingById = async (listingId) => {
    try {
      const response = await axios.get(
        `http://localhost:2527/listings/get/${listingId}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (err) {
      console.error("Failed to fetch listing:", err);
      return null;
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    switch (activeTab) {
      case "pending_payment":
        return order.status === "created";
      case "in_progress":
        return [
          "paid_pending_delivery",
          "delivered",
          "return_requested",
          "return_confirmed",
        ].includes(order.status);
      case "completed":
        return ["completed", "refunded"].includes(order.status);
      default:
        return true;
    }
  });

  const handleFarmerAction = async (orderId, newStatus, deliveryData) => {
    // console.log(trackingNumber2,' ',newStatus);

    setIsProcessingPayment(true);
    try {
      if (newStatus === "delivered") {
        await axios.post(
          `http://localhost:2526/api/payments/confirm-delivery/${orderId}/${deliveryData.trackingNumber}`,
          {},
          { withCredentials: true }
        );

        

        // const updateListingStatus = await axios.put(
        //   `http://localhost:2527/listings/${listingId}/archived`
        // );
        // if (!updateListingStatus.status === 200) {
        //   const errorText = await updateListingStatus.text();
        //   toast.error(
        //     `Failed to update listing status: ${updateListingStatus.status} - ${errorText}`
        //   );
        //   throw new Error(
        //     `Failed to update listing status: ${updateListingStatus.status} - ${errorText}`
        //   );
        // }

        // console.log(
        //   "Listing status updated successfully:",
        //   updateListingStatus.data
        // );

        

        toast.success("Delivery confirmed successfully!");
      } else if (newStatus === "return_confirmed") {
        await axios.post(
          `http://localhost:2526/api/payments/confirm-return/${orderId}`,
          {},
          { withCredentials: true }
        );
        toast.success("Return confirmed successfully!");
      }
      setShowTrackingModal(false);
      setTrackingNumber("");
      setSelectedOrderId(null);
      fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    } finally {
      setIsProcessingPayment(false); // Stop loader
    }
  };

  const handleBuyerRefund = async (orderId) => {
    setIsProcessingPayment(true);
    try {
      await axios.post(
        `http://localhost:2526/api/payments/reject-delivery/${orderId}`,
        {},
        { withCredentials: true }
      );
      toast.success("Refund processed successfully!");
      fetchOrders();
    } catch (error) {
      console.error("Error processing refund:", error);
      toast.error("Failed to process refund");
    } finally {
      setIsProcessingPayment(false); // Stop loader
    }
  };

  const openTrackingModal = (orderId) => {
    setSelectedOrderId(orderId);
    setShowTrackingModal(true);
  };

  const closeTrackingModal = () => {
    setShowTrackingModal(false);
    setTrackingNumber("");
    setSelectedOrderId(null);
  };

  const handleOpenRejectModal = (orderId) => {
    setSelectedOrderId(orderId);
    setShowRejectModal(true);
  };

  const handleCloseRejectModal = () => {
    setShowRejectModal(false);
    setRejectionReason("");
    setRejectionComment("");
    setSelectedOrderId(null);
  };

  const handleConfirmRejection = async () => {
    if (!rejectionReason) {
      toast.error("Please select a reason for rejection");
      return;
    }

    setIsProcessingPayment(true);
    try {
      const order = orders.find((o) => o.id === selectedOrderId);
      if (!order) {
        toast.error("Order not found");
        return;
      }

      console.log(order.id);
      const finalRes = await axios.post(
        `http://localhost:2526/api/payments/request-return/${order.id}/abcd`,
        { withCredentials: true }
      );
      const res = finalRes.data;
      if (res.success) {
        toast.success(res.message);
        handleCloseRejectModal();
        fetchOrders();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.error("Error rejecting delivery:", error);
      toast.error("Failed to reject delivery");
    } finally {
      setIsProcessingPayment(false); // Stop loader
    }
  };

  const handleVerifyDelivery = (orderId) => {
    setSelectedOrderId(orderId);
    setShowVerifyModal(true);
  };

  return (
    <div className="bg-gray-50 py-8 md:py-12 px-4 md:px-6 lg:px-8 ml-0 md:ml-20 mt-16 md:mt-20 min-h-screen">
      <div className="max-w-full md:max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-green-800 flex items-center">
            <FaShoppingCart className="mr-3 text-green-600" /> My Orders
          </h1>
          <button
            onClick={() => navigate("/crops")}
            className="text-sm md:text-base bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-full transition-all duration-300 flex items-center shadow-md"
          >
            Browse Marketplace <FaArrowRight className="ml-2" />
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-124">
            <Loader />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <FaShoppingCart className="text-red-500 text-5xl mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-red-700 mb-2">Error</h3>
            <p className="text-md text-gray-600 max-w-md mx-auto">{error}</p>
            <button
              onClick={fetchOrders}
              className="mt-4 bg-green-600 text-white py-2 px-4 rounded-full hover:bg-green-700 transition-all"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            {isProcessingPayment && <Loader />}
            <OrderList
              orders={filteredOrders}
              listings={listings}
              images={images}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              currentUser={currentUser}
              openTrackingModal={openTrackingModal}
              handleVerifyDelivery={handleVerifyDelivery}
              handleOpenRejectModal={handleOpenRejectModal}
              handleBuyerRefund={handleBuyerRefund}
              pendingPaymentCount={pendingPaymentCount}
              inProgressCount={inProgressCount}
              completedCount={completedCount}
              handleFarmerAction={handleFarmerAction}
              fetchOrders={fetchOrders}
            />
          </>
        )}
      </div>

      {showTrackingModal && (
        <TrackingModal
          closeTrackingModal={closeTrackingModal}
          trackingNumber={trackingNumber}
          setTrackingNumber={setTrackingNumber}
          selectedOrderId={selectedOrderId}
          orders={orders}
          handleFarmerAction={handleFarmerAction}
        />
      )}

      {showRejectModal && (
        <RejectModal
          handleCloseRejectModal={handleCloseRejectModal}
          rejectionReason={rejectionReason}
          setRejectionReason={setRejectionReason}
          rejectionComment={rejectionComment}
          setRejectionComment={setRejectionComment}
          selectedOrderId={selectedOrderId}
          handleConfirmRejection={handleConfirmRejection}
        />
      )}

      {showVerifyModal && (
        <VerifyModal
          verificationComplete={verificationComplete}
          setShowVerifyModal={setShowVerifyModal}
          confirmDeliveryVerification={confirmDeliveryVerification}
          selectedOrderId={selectedOrderId}
          orders={orders}
          handleBuyerRefund={handleBuyerRefund}
        />
      )}
    </div>
  );
};

export default MyOrders;
