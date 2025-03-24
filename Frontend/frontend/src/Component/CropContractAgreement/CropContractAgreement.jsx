import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { getCurrentUser } from "../../../helper";
import PartyInformation from "./PartyInformation";
import CropDetails from "./CropDetails";
import DeliveryTerms from "./DeliveryTerms";
import PaymentTerms from "./PaymentTerms";
import TermsAndConditions from "./TermsAndConditions";
import Signatures from "./Signatures";
import UploadContract from "./UploadContract";
import NavigationButtons from "./NavigationButtons";
import toast from "react-hot-toast";

const CropContractAgreement = ({quantity}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [userType, setUserType] = useState("farmer");
  const [farmerSignature, setFarmerSignature] = useState(null);
  const [buyerSignature, setBuyerSignature] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [farmerAddress, setFarmerAddress] = useState("");
  const [buyerAddress, setBuyerAddress] = useState("");
  const [contractGenerated, setContractGenerated] = useState(false);
  const [contractFile, setContractFile] = useState(null);
  const [listing, setListing] = useState({});
  const [farmer, setFarmer] = useState({});
  const navigate = useNavigate();
  const { id: listingId } = useParams();

  const [formData, setFormData] = useState({
    farmerInfo: {
      farmerName: "",
      farmerAddress: "",
      farmerContact: "",
    },
    buyerInfo: {
      buyerName: "",
      buyerAddress: "",
      buyerContact: "",
    },
    cropDetails: {
      type: "",
      variety: "",
      quantity: "",
      pricePerUnit: "",
      qualityStandards: [],
    },
    deliveryTerms: {
      date: "",
      location: "",
      transportation: "Farmer",
      packaging: "Standard packaging",
    },
    paymentTerms: {
      totalValue: "",
      method: "Bank Transfer",
      advancePayment: "100%",
      balanceDue: "On Delivery",
    },
    termsConditions: [
      {
        tId: 1,
        title: "Quality Inspection",
        content:
          "Buyer has the right to inspect crops upon delivery and may reject if they do not meet the agreed quality standards.",
      },
      {
        tId: 2,
        title: "Force Majeure",
        content:
          "Neither party shall be liable for failure to perform due to natural disasters, extreme weather, or other circumstances beyond reasonable control.",
      },
      {
        tId: 3,
        title: "Dispute Resolution",
        content:
          "All disputes shall first be resolved through negotiation, then mediation, and finally through arbitration.",
      },
      {
        tId: 4,
        title: "Termination",
        content:
          "This contract may be terminated by mutual agreement with 30 days written notice.",
      },
      {
        tId: 5,
        title: "Amendments",
        content:
          "Any changes to this contract must be in writing and signed by both parties.",
      },
      {
        tId: 6,
        title: "Insurance",
        content:
          "The farmer must maintain appropriate crop insurance throughout the growing season.",
      },
      {
        tId: 7,
        title: "Governing Law",
        content:
          "This contract shall be governed by the laws of [State/Country].",
      },
    ],
    additionalNotes: "",
  });

  const fetchListingById = async () => {
    try {
      const response = await axios.get(
        `http://localhost:2527/listings/get/${listingId}`,
        {
          withCredentials: true,
        }
      );
      console.log("Listing details:", response.data);
      setListing(response.data);
      return response.data;
    } catch (err) {
      console.error("Failed to fetch listing details:", err);
    }
  };

  const fetchFarmerDetails = async (farmerContact) => {
    try {
      const response = await axios.get(
        `http://localhost:2525/users/${farmerContact}`,
        {
          withCredentials: true,
        }
      );
      console.log("Farmer details:", response.data);
      setFarmer(response.data);
      setFarmerAddress(response.data.uniqueHexAddress);
      return response.data;
    } catch (err) {
      console.error("Failed to fetch farmer details:", err);
    }
  };

  const fetchUser = async () => {
    try {
      const user = await getCurrentUser();
      const listing = await fetchListingById();
      const farmer = await fetchFarmerDetails(listing.contactOfFarmer);
      setBuyerAddress(user.uniqueHexAddress);

      setFormData((prevFormData) => ({
        ...prevFormData,
        farmerInfo: {
          farmerName: farmer.username || "",
          farmerAddress: farmer.address || "",
          farmerContact: farmer.phoneNumber || "",
        },
        buyerInfo: {
          buyerName: user.username || "",
          buyerAddress: user.address || "",
          buyerContact: user.phoneNumber || "",
        },
      }));

      return user;
    } catch (err) {
      console.error("Failed to fetch current user:", err);
    }
  };

  useEffect(() => {
    const initializeFormData = async () => {
      const user = await fetchUser();
      const listingData = await fetchListingById();
      console.log(listingData);

      if (listingData) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          cropDetails: {
            type: listingData.productType,
            variety: listingData.productName,
            quantity: `${listingData.quantity}`,
            pricePerUnit: `${listingData.finalPrice} per kg`,
            qualityStandards: [
              listingData.qualityGrade
                ? `Quality Grade: ${listingData.qualityGrade}`
                : "No specific quality grade specified",
              `Storage Condition: ${listingData.storageCondition}`,
              `Shelf Life: ${listingData.shelfLifetime} days`,
              "Harvested on: " + listingData.harvestedDate,
            ],
          },
          deliveryTerms: {
            ...prevFormData.deliveryTerms,
            date: Date.now(),
            location: listingData.location,
          },
          paymentTerms: {
            ...prevFormData.paymentTerms,
            totalValue: `${
              listingData.finalPrice && listingData.quantity
                ? (listingData.finalPrice * listingData.quantity).toFixed(2)
                : "0.00"
            }`,
          },
          additionalNotes: listingData.productDescription
            ? `Product Description: ${listingData.productDescription}`
            : "No additional notes provided.",
        }));
      }
    };

    initializeFormData();
  }, [listingId]);

  const toggleUserType = () => {
    setUserType(userType === "farmer" ? "buyer" : "farmer");
  };

  const nextStep = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveAndNext = () => {
    saveFormData();
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    }
    if (currentStep === 5) {
      handleSubmit();
    }
  };

  const saveFormData = () => {
    console.log("Saving form data locally:", formData);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    const submitData = new FormData();

    const agreementDetails = {
      farmerInfo: formData.farmerInfo,
      buyerInfo: formData.buyerInfo,
      cropDetails: formData.cropDetails,
      deliveryTerms: formData.deliveryTerms,
      paymentTerms: formData.paymentTerms,
      termsConditions: formData.termsConditions,
      additionalNotes: formData.additionalNotes,
    };

    submitData.append(
      "agreementDetails",
      new Blob([JSON.stringify(agreementDetails)], { type: "application/json" })
    );

    if (farmerSignature) {
      submitData.append("farmerSignature", farmerSignature);
    }
    if (buyerSignature) {
      submitData.append("buyerSignature", buyerSignature);
    }

    try {
      const saveResponse = await axios.post(
        "http://localhost:2526/agreements/save",
        submitData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      console.log("Contract saved successfully:", saveResponse.data);

      const agreementId = saveResponse.data.id;
      if (!agreementId) {
        throw new Error("Agreement ID not returned from save response");
      }

      const fetchResponse = await axios.get(
        `http://localhost:2526/agreements/get/${agreementId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const fetchedAgreementDetails = fetchResponse.data;
      console.log("Fetched agreement details:", fetchedAgreementDetails);

      const contractRequest = {
        farmerInfo: fetchedAgreementDetails.farmerInfo,
        buyerInfo: fetchedAgreementDetails.buyerInfo,
        cropDetails: fetchedAgreementDetails.cropDetails,
        deliveryTerms: fetchedAgreementDetails.deliveryTerms,
        paymentTerms: fetchedAgreementDetails.paymentTerms,
        termsConditions: fetchedAgreementDetails.termsConditions,
        additionalNotes: fetchedAgreementDetails.additionalNotes,
      };

      const response = await fetch("http://localhost:2529/contracts/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/pdf",
        },
        body: JSON.stringify(contractRequest),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to generate PDF: ${response.status} - ${errorText}`
        );
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `AgriConnect_Contract_${contractRequest.farmerInfo.farmerName.replace(
        /\s+/g,
        "_"
      )}_${contractRequest.buyerInfo.buyerName.replace(/\s+/g, "_")}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      console.log("Contract PDF generated successfully");

      const updateListingStatus = await axios.put(
        `http://localhost:2527/listings/${listingId}/archived`
      );
      if (!updateListingStatus.status === 200) {
        const errorText = await updateListingStatus.text();
        toast.error(
          `Failed to update listing status: ${updateListingStatus.status} - ${errorText}`
        );
        throw new Error(
          `Failed to update listing status: ${updateListingStatus.status} - ${errorText}`
        );
      }

      console.log(
        "Listing status updated successfully:",
        updateListingStatus.data
      );

      toast.success("Contract PDF Generated Successfully");
      setContractGenerated(true);
    } catch (err) {
      const errorMessage = err.response?.data || err.message;
      setError(`Failed to submit contract or generate PDF: ${errorMessage}`);
      console.error("Submission error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleContractUpload = async () => {
    // if (!contractFile) {
    //   setError("Please select a PDF file to upload");
    //   return;
    // }

    const lis = await fetchListingById();
    const far = await fetchFarmerDetails(lis.contactOfFarmer);
    const buy = await fetchUser();

    // const uploadData = new FormData();
    // // uploadData.append("file", contractFile);
    // uploadData.append("farmerAddress", far.uniqueHexAddress);
    // uploadData.append("buyerAddress", buy.uniqueHexAddress);
    // uploadData.append("listingId", listingId);
    // uploadData.append(
    //   "amount",
    //   formData.cropDetails.pricePerUnit.split(" ")[0] *
    //     formData.cropDetails.quantity.split(" ")[0]
    // );

    console.log(formData);
    

    const orderRequest = {
      farmerAddress: far.uniqueHexAddress,
      buyerAddress: buy.uniqueHexAddress,
      listingId,
      amount: parseFloat(
        formData.cropDetails.pricePerUnit.split(" ")[0] *
          formData.cropDetails.quantity
      ),
      quantity: formData.cropDetails.quantity
    };

    try {
      const response = await axios.post(
        "http://localhost:2526/orders/create",
        orderRequest,
        {
          withCredentials: true,
        }
      );
      toast.success("Order Created!");
      
      const updateListingStatus = await axios.put(
        `http://localhost:2527/listings/${listingId}/archived/${formData.cropDetails.quantity}`
      );
      if (!updateListingStatus.status === 200) {
        const errorText = await updateListingStatus.text();
        toast.error(
          `Failed to update listing status: ${updateListingStatus.status} - ${errorText}`
        );
        throw new Error(
          `Failed to update listing status: ${updateListingStatus.status} - ${errorText}`
        );
      }
      navigate("/my-orders", { state: listing });
    } catch (err) {
      setError(err.response?.data || "Failed to upload contract");
      console.error("Upload error:", err);
    }
  };

  const handleImageUpload = (event, setSignature) => {
    const file = event.target.files[0];
    if (file) {
      setSignature(file);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <PartyInformation
            formData={formData}
            userType={userType}
            setFormData={setFormData}
          />
        );
      case 2:
        return (
          <CropDetails
            formData={formData}
            userType={userType}
            setFormData={setFormData}
            quantity={quantity}
          />
        );
      case 3:
        return (
          <DeliveryTerms
            formData={formData}
            userType={userType}
            setFormData={setFormData}
          />
        );
      case 4:
        return (
          <PaymentTerms
            formData={formData}
            userType={userType}
            setFormData={setFormData}
          />
        );
      case 5:
        return (
          <TermsAndConditions
            formData={formData}
            userType={userType}
            setFormData={setFormData}
            handleContractUpload={handleContractUpload}
            prevStep={prevStep}
          />
        );
      case 6:
        return (
          <Signatures
            userType={userType}
            farmerSignature={farmerSignature}
            setFarmerSignature={setFarmerSignature}
            buyerSignature={buyerSignature}
            setBuyerSignature={setBuyerSignature}
            handleImageUpload={handleImageUpload}
          />
        );
      case 7:
        return (
          <UploadContract
            contractFile={contractFile}
            setContractFile={setContractFile}
            handleContractUpload={handleContractUpload}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="mb-4 text-right">
          <button
            onClick={toggleUserType}
            className="text-sm text-jewel-600 hover:text-jewel-800"
          >
            Current role: {userType === "farmer" ? "Farmer" : "Buyer"} (click to
            toggle)
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div>{renderStepContent()}</div>
        <NavigationButtons
          currentStep={currentStep}
          userType={userType}
          prevStep={prevStep}
          nextStep={nextStep}
          handleSaveAndNext={handleSaveAndNext}
          handleSubmit={handleSubmit}
          loading={loading}
          farmerSignature={farmerSignature}
          buyerSignature={buyerSignature}
        />
      </div>
    </div>
  );
};

export default CropContractAgreement;
