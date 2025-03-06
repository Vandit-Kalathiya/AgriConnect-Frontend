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

const CropContractAgreement = () => {
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
      farmerName: "Rahul",
      farmerAddress: "Anand, Gujarat",
      farmerContact: "7990137814",
    },
    buyerInfo: {
      buyerName: "Raj",
      buyerAddress: "Anand, Gujarat",
      buyerContact: "8780850751",
    },
    cropDetails: {
      type: "Organic Tomatoes",
      variety: "Roma, Grade A",
      quantity: "5,000 kg",
      pricePerUnit: "$2.50 per kg",
      qualityStandards: [
        "Minimum 90% of tomatoes must be free from blemishes",
        "Size: Medium to large (6-8 cm diameter)",
        "Color: Deep red, fully ripened",
        "Pesticide-free certification required",
      ],
    },
    deliveryTerms: {
      date: "2025-04-15",
      location: "Sunshine Groceries Warehouse, 789 Distribution Ave",
      transportation: "Farmer",
      packaging: "Food-grade crates, max 20kg per crate",
    },
    paymentTerms: {
      totalValue: "$12,500.00",
      method: "Bank Transfer",
      advancePayment: "30%",
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
    additionalNotes:
      "Buyer to provide reusable crates one week before harvest. Farmer agrees to participate in buyer's farm-to-table marketing program.",
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
      fetchFarmerDetails(response.data.contactOfFarmer);
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
    const user = getCurrentUser();
    setBuyerAddress(user.uniqueHexAddress);
    return user;
  };

  useEffect(() => {
    fetchUser();
    fetchListingById();
  }, []);

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

      const updateListingStatus = axios.put(
        `http://localhost:2527/listings/${listingId}/archived`
      );
      if (!response.ok) {
        const errorText = await updateListingStatus.text();
        throw new Error(
          `Failed to generate PDF: ${updateListingStatus.status} - ${errorText}`
        );
      }

      console.log(
        "Listing status updated successfully:",
        updateListingStatus.data
      );

      alert("Contract submitted and PDF generated successfully!");
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
    if (!contractFile) {
      setError("Please select a PDF file to upload");
      return;
    }

    const lis = await fetchListingById();
    const far = await fetchFarmerDetails(lis.contactOfFarmer);
    const buy = await fetchUser();

    const uploadData = new FormData();
    uploadData.append("file", contractFile);
    uploadData.append("farmerAddress", far.uniqueHexAddress);
    uploadData.append("buyerAddress", buy.uniqueHexAddress);
    uploadData.append("listingId", listingId);
    uploadData.append("amount", lis.finalPrice * lis.quantity);

    try {
      const response = await axios.post(
        "http://localhost:2526/api/agreements/upload",
        uploadData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      alert(
        `Contract uploaded successfully!\nPDF Hash: ${response.data.pdfHash}\nTransaction Hash: ${response.data.txHash}`
      );
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
