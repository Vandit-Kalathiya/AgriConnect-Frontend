import React, { useState, useEffect } from "react";
import axios from "axios";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import { getCurrentUser } from "../../../helper";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const BASE_URL = "http://localhost:2527"; // Replace with your actual backend URL

const ListingForm = () => {
  const [step, setStep] = useState(1);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    productName: "",
    cropType: "all",
    description: "",
    quantity: "",
    unitOfQuantity: "kg",
    productPhotos: [],
    qualityGrade: "Grade A",
    harvestDate: "",
    availabilityDate: "",
    storageConditions: "",
    certifications: "",
    shelfLife: "",
    location: "", // Initially empty, will be set after fetching user
    contactInfo: "", // Initially empty, will be set after fetching user
    aiGeneratedPrice: "",
    finalPrice: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoadingAiPrice, setIsLoadingAiPrice] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const navigate = useNavigate();

  const MAX_PHOTOS = 5;

  const fetchUser = async () => {
    try {
      const user = await getCurrentUser();
      setUser(user);

      // Set default values for location and contactInfo
      setFormData((prevFormData) => ({
        ...prevFormData,
        location: user.address || "", // Use user's address if available
        contactInfo: user.phoneNumber || "", // Use user's phone number if available
      }));
    } catch (err) {
      console.log("User not found");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (value.trim() && errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPhotos = files.slice(
      0,
      MAX_PHOTOS - formData.productPhotos.length
    );

    if (formData.productPhotos.length + newPhotos.length > MAX_PHOTOS) {
      alert(`You can only upload a maximum of ${MAX_PHOTOS} photos.`);
      return;
    }

    const photosWithPreviews = newPhotos.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setFormData({
      ...formData,
      productPhotos: [...formData.productPhotos, ...photosWithPreviews].slice(
        0,
        MAX_PHOTOS
      ),
    });
  };

  const removePhoto = (index) => {
    const updatedPhotos = [...formData.productPhotos];
    URL.revokeObjectURL(updatedPhotos[index].preview);
    updatedPhotos.splice(index, 1);
    setFormData({ ...formData, productPhotos: updatedPhotos });
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.productName.trim())
      newErrors.productName = "Product name is required";
    if (!formData.cropType.trim()) newErrors.cropType = "Crop type is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (
      !formData.quantity.trim() ||
      isNaN(formData.quantity) ||
      Number(formData.quantity) <= 0
    )
      newErrors.quantity = "Quantity must be a positive number";
    if (!formData.unitOfQuantity.trim())
      newErrors.unitOfQuantity = "Unit of quantity is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (formData.productPhotos.length === 0)
      newErrors.productPhotos = "At least one photo is required";
    // if (!formData.qualityGrade.trim())
    //   newErrors.qualityGrade = "Quality grade is required";
    if (!formData.harvestDate && !formData.availabilityDate)
      newErrors.harvestDate = "Harvest date or availability date is required";
    if (!formData.storageConditions.trim())
      newErrors.storageConditions = "Storage conditions are required";
    // if (!formData.certifications.trim())
    //   newErrors.certifications = "Certifications are required";
    if (
      !formData.shelfLife.trim() ||
      isNaN(formData.shelfLife) ||
      Number(formData.shelfLife) <= 0
    )
      newErrors.shelfLife = "Shelf life must be a positive number";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.contactInfo.trim() || !/^\d{10}$/.test(formData.contactInfo))
      newErrors.contactInfo = "Contact info must be a 10-digit mobile number";
    if (
      !formData.aiGeneratedPrice.trim() ||
      isNaN(formData.aiGeneratedPrice) ||
      Number(formData.aiGeneratedPrice) <= 0
    )
      newErrors.aiGeneratedPrice =
        "AI-generated price must be a positive number";
    if (
      !formData.finalPrice.trim() ||
      isNaN(formData.finalPrice) ||
      Number(formData.finalPrice) <= 0
    )
      newErrors.finalPrice = "Final price must be a positive number";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep4 = () => true;

  const handleNext = () => {
    switch (step) {
      case 1:
        if (!validateStep1()) return;
        break;
      case 2:
        if (!validateStep2()) return;
        break;
      case 3:
        if (!validateStep3()) return;
        break;
      case 4:
        if (!validateStep4()) return;
        break;
      default:
        break;
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validateStep4()) return;

    // Create FormData object
    const submissionData = new FormData();

    // Append regular fields
    submissionData.append("productName", formData.productName);
    submissionData.append("productDescription", formData.description);
    submissionData.append("productType", formData.cropType);
    submissionData.append("quantity", formData.quantity.toString().trim());
    submissionData.append("unitOfQuantity", formData.unitOfQuantity);
    submissionData.append("harvestedDate", formData.harvestDate);
    submissionData.append("storageCondition", formData.storageConditions);
    submissionData.append("finalPrice", formData.finalPrice.toString().trim());
    submissionData.append(
      "shelfLifetime",
      formData.shelfLife.toString().trim()
    );
    submissionData.append("location", formData.location);
    submissionData.append("contactOfFarmer", formData.contactInfo);
    submissionData.append(
      "aiGeneratedPrice",
      formData.aiGeneratedPrice.toString().trim()
    );

    // Append multiple files
    if (formData.productPhotos && formData.productPhotos.length > 0) {
      formData.productPhotos.forEach((photo) => {
        submissionData.append("images", photo.file);
      });
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/listings/add`,
        submissionData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Backend response:", response.data);
      toast.success("Listing added successfully");

      // Reset form
      setStep(1);
      setFormData({
        productName: "",
        cropType: "",
        description: "",
        quantity: "",
        unitOfQuantity: "kg",
        productPhotos: [],
        // qualityGrade: "Grade A",
        harvestDate: "",
        // availabilityDate: "",
        storageConditions: "",
        // certifications: "",
        shelfLife: "",
        location: user ? user.address : "", // Reset to user's address
        contactInfo: user ? user.phoneNumber : "", // Reset to user's phone number
        aiGeneratedPrice: "",
        finalPrice: "",
      });
      navigate("/my-listing");
      setErrors({});
    } catch (error) {
      console.error("Error submitting listing:", error);
      alert(
        `Failed to submit listing: ${
          error.response?.data?.message || "Please try again"
        }`
      );
    }
  };

  const fetchListingById = async (listingId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/listings/get/${listingId}`,
        {
          withCredentials: true, // If your API requires authentication
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching listing:", error);
      throw error.response?.data || error.message;
    }
  };

  useEffect(() => {
    const fetchAiPrice = async () => {
      setIsLoadingAiPrice(true);
      try {
        const mockAiPrice = calculateAiPrice(
          formData.qualityGrade,
          formData.productName,
          formData.quantity,
          formData.harvestDate || formData.availabilityDate,
          formData.shelfLife
        );
        setFormData((prev) => ({
          ...prev,
          aiGenPrice: mockAiPrice.toFixed(2),
        }));
      } catch (error) {
        console.error("Error fetching AI price:", error);
        // setFormData((prev) => ({ ...prev, aiGenPrice: "250.00" }));
      } finally {
        setIsLoadingAiPrice(false);
      }
    };

    if (
      formData.qualityGrade &&
      formData.productName &&
      formData.quantity &&
      (formData.harvestDate || formData.availabilityDate) &&
      formData.shelfLife
    ) {
      fetchAiPrice();
    } else {
      setFormData((prev) => ({
        ...prev,
        qualityGrade: "Grade A",
        productName: "",
        quantity: "",
        harvestDate: new Date().toISOString().split("T")[0],
        shelfLife: "",
      }));
      fetchAiPrice();
    }
  }, []);

  const calculateAiPrice = (quality, name, qty, date, shelf) => {
    const basePrice = 200;
    const qualityMultiplier =
      quality === "Grade A" ? 1.5 : quality === "Grade B" ? 1.2 : 1.0;
    const quantityMultiplier = Number(qty) / 1000;
    const freshnessFactor =
      Math.max(
        0,
        30 - Math.abs(new Date(date) - new Date()) / (1000 * 60 * 60 * 24)
      ) / 30;
    const shelfFactor = Number(shelf) / 100;
    return (
      basePrice *
      qualityMultiplier *
      (1 + quantityMultiplier) *
      freshnessFactor *
      (1 + shelfFactor)
    );
  };

  const confirmSubmit = () => {
    setShowConfirmModal(false);
    handleSubmit();
  };

  const cancelSubmit = () => {
    setShowConfirmModal(false);
  };

  useEffect(() => {
    return () => {
      formData.productPhotos.forEach((photo) => {
        if (photo.preview) URL.revokeObjectURL(photo.preview);
      });
    };
  }, []);

  return (
    <div className="flex justify-center items-center px-4 md:px-6 lg:px-8 py-6 md:py-12 ml-0 md:ml-20 mt-5 min-h-screen bg-gray-50">
      <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 w-full max-w-full sm:max-w-lg md:max-w-4xl">
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-jewel-700">
          {step === 4 ? "Review Listing" : "Create New Listing"}
        </h2>
        {step === 1 && (
          <Step1
            formData={formData}
            errors={errors}
            handleInputChange={handleInputChange}
            handleNext={handleNext}
            maxPhotos={MAX_PHOTOS}
          />
        )}
        {step === 2 && (
          <Step2
            formData={formData}
            errors={errors}
            handleInputChange={handleInputChange}
            handlePhotoUpload={handlePhotoUpload}
            removePhoto={removePhoto}
            handleNext={handleNext}
            handleBack={handleBack}
            maxPhotos={MAX_PHOTOS}
          />
        )}
        {step === 3 && (
          <Step3
            formData={formData}
            errors={errors}
            handleInputChange={handleInputChange}
            handleBack={handleBack}
            handleNext={handleNext}
            isLoadingAiPrice={isLoadingAiPrice}
          />
        )}
        {step === 4 && (
          <Step4
            formData={formData}
            errors={errors}
            handleBack={handleBack}
            handleSubmit={() => setShowConfirmModal(true)}
          />
        )}

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 w-full max-w-xs md:max-w-md">
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-4">
                Confirm Submission
              </h3>
              <p className="text-sm md:text-md text-gray-700 mb-4 md:mb-6">
                Are you sure you want to submit this listing?
              </p>
              <div className="flex justify-end space-x-2 md:space-x-4">
                <button
                  onClick={cancelSubmit}
                  className="px-3 md:px-4 py-1 md:py-2 rounded-lg bg-gray-300 text-gray-700 text-sm md:text-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSubmit}
                  className="px-3 md:px-4 py-1 md:py-2 rounded-lg bg-jewel-500 text-white text-sm md:text-md hover:bg-jewel-600 transition-colors"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingForm;
