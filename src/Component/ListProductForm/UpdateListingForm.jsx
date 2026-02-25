import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { API_CONFIG } from "../../config/apiConfig";
import Loader from "../Loader/Loader";
import {
  ArrowLeft, Upload, X, Save, ImagePlus, CheckCircle,
} from "lucide-react";
import {
  FaMapMarkerAlt, FaPhone, FaCoins, FaChartLine,
  FaExclamationTriangle, FaInfoCircle,
} from "react-icons/fa";
import { GoogleGenerativeAI } from "@google/generative-ai";

const BASE_URL = API_CONFIG.MARKET_ACCESS;
const MAX_PHOTOS = 5;

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const CROP_TYPES = [
  { value: "Grains",     label: "Grains (e.g., Rice, Wheat)" },
  { value: "Fruits",     label: "Fruits (e.g., Mango, Apple)" },
  { value: "Vegetables", label: "Vegetables (e.g., Tomato, Potato)" },
  { value: "Pulses",     label: "Pulses (e.g., Lentils, Chickpeas)" },
  { value: "Spices",     label: "Spices (e.g., Turmeric, Chili)" },
  { value: "Oilseeds",   label: "Oilseeds (e.g., Soybean, Mustard)" },
  { value: "Herbs",      label: "Herbs (e.g., Basil, Mint)" },
  { value: "Nuts",       label: "Nuts (e.g., Almond, Cashew)" },
  { value: "Sweetener",  label: "Sweetener (e.g., Jaggery)" },
];

const STORAGE_CONDITIONS = [
  "Room Temperature",
  "Refrigerated",
  "Cold Storage",
  "Dry Storage",
  "Cool and Dry",
  "Temperature Controlled",
  "Other",
];

const UpdateListingForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  // tracks all blob URLs created so we can safely revoke on unmount
  const blobUrlsRef = useRef([]);

  const [loading, setLoading]             = useState(true);
  const [submitting, setSubmitting]       = useState(false);
  const [showConfirm, setShowConfirm]     = useState(false);
  const [aiLoading, setAiLoading]         = useState(false);
  const [deletingIndex, setDeletingIndex] = useState(null);
  // track whether images were modified so we only include images in PUT when needed
  const [imagesModified, setImagesModified] = useState(false);
  const [formData, setFormData] = useState({
    productName:       "",
    cropType:          "",
    description:       "",
    quantity:          "",
    unitOfQuantity:    "kg",
    productPhotos:     [],
    harvestDate:       "",
    storageConditions: "",
    certifications:    "",
    shelfLife:         "",
    location:          "",
    contactInfo:       "",
    aiGeneratedPrice:  "",
    finalPrice:        "",
  });
  const [errors, setErrors] = useState({});

  // revoke all tracked blob URLs on unmount
  useEffect(() => {
    return () => {
      blobUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  useEffect(() => {
    fetchListingData();
  }, [id]);

  const fetchListingData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/listings/get/${id}`, {
        withCredentials: true,
      });
      const l = response.data;

      setFormData(prev => ({
        ...prev,
        productName:       l.productName      || "",
        cropType:          l.productType       || "",
        description:       l.productDescription || "",
        quantity:          l.quantity?.toString() || "",
        unitOfQuantity:    l.unitOfQuantity    || "kg",
        harvestDate:       l.harvestedDate     || "",
        storageConditions: l.storageCondition  || "",
        certifications:    l.certifications    || "",
        shelfLife:         l.shelfLifetime?.toString() || "",
        location:          l.location          || "",
        contactInfo:       l.contactOfFarmer   || "",
        aiGeneratedPrice:  l.aiGeneratedPrice?.toString() || "",
        finalPrice:        l.finalPrice?.toString()       || "",
        productPhotos:     [],
      }));

      if (l.images && l.images.length > 0) {
        const photos = await fetchExistingImages(l.images);
        setFormData(prev => ({ ...prev, productPhotos: photos }));
      }
    } catch (error) {
      console.error("Error fetching listing:", error);
      toast.error("Failed to load listing details.");
    } finally {
      setLoading(false);
    }
  };

  const fetchExistingImages = async (images) => {
    const results = await Promise.allSettled(
      images.map(async (img) => {
        const res = await axios.get(`${BASE_URL}/image/${img.id}`, {
          withCredentials: true,
          responseType: "blob",
        });
        const blob = res.data;
        const file = new File([blob], `existing-${img.id}.jpg`, {
          type: blob.type || "image/jpeg",
        });
        const preview = URL.createObjectURL(blob);
        blobUrlsRef.current.push(preview);
        return { file, preview, existingId: img.id };
      })
    );
    return results
      .filter(r => r.status === "fulfilled")
      .map(r => r.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const remaining = MAX_PHOTOS - formData.productPhotos.length;
    if (remaining <= 0) {
      toast.error(`Maximum ${MAX_PHOTOS} photos allowed.`);
      return;
    }
    const newPhotos = files.slice(0, remaining).map(file => {
      const preview = URL.createObjectURL(file);
      blobUrlsRef.current.push(preview);
      return { file, preview };
    });
    setFormData(prev => ({
      ...prev,
      productPhotos: [...prev.productPhotos, ...newPhotos],
    }));
    setImagesModified(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removePhoto = async (index) => {
    const photo = formData.productPhotos[index];
    console.log(photo);

    if (photo.existingId) {
      // delete from server first
      setDeletingIndex(index);
      try {
        await axios.delete(`${BASE_URL}/image/${photo.existingId}`, {
          withCredentials: true,
        });
      } catch (error) {
        console.error("Failed to delete image:", error);
        toast.error("Failed to delete image from server. Please try again.");
        setDeletingIndex(null);
        return;
      }
      setDeletingIndex(null);
    }

    // remove from local state using existingId/preview as stable key to avoid index drift
    setFormData(prev => {
      const updated = prev.productPhotos.filter((_, i) => i !== index);
      return { ...prev, productPhotos: updated };
    });
    setImagesModified(true);
  };

  const fetchAiPrice = async () => {
    if (!formData.productName || !formData.quantity || !formData.location) {
      toast.error("Fill in product name, quantity and location first.");
      return;
    }
    setAiLoading(true);
    try {
      const prompt = `
        You are an agricultural pricing expert. Based on the following details, provide a fair price per kilogram:
        - Product: ${formData.productName}
        - Quantity: ${formData.quantity} ${formData.unitOfQuantity}
        - Location: ${formData.location}
        IMPORTANT: Return ONLY a numeric value per kg without currency or units. Example: "245.50"
        Respond in this JSON format:
        { "price": "245.50" }
      `;
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const match = text.match(/\{.*\}/s);
      if (match) {
        const parsed = JSON.parse(match[0]);
        const price = parseFloat(parsed.price).toFixed(2);
        setFormData(prev => ({
          ...prev,
          aiGeneratedPrice: price,
          finalPrice: prev.finalPrice || price,
        }));
        toast.success(`AI suggested price: ₹${price}/kg`);
      }
    } catch (err) {
      console.error("AI price error:", err);
      toast.error("Failed to fetch AI price. Please enter manually.");
    } finally {
      setAiLoading(false);
    }
  };

  const validate = () => {
    const e = {};
    if (!formData.productName.trim())     e.productName = "Product name is required";
    if (!formData.description.trim())     e.description = "Description is required";
    if (!formData.quantity || isNaN(formData.quantity) || Number(formData.quantity) <= 0)
      e.quantity = "Quantity must be a positive number";
    if (!formData.cropType || formData.cropType === "all")
      e.cropType = "Please select a crop type";
    if (!formData.storageConditions)
      e.storageConditions = "Storage condition is required";
    if (!formData.shelfLife || isNaN(formData.shelfLife) || Number(formData.shelfLife) <= 0)
      e.shelfLife = "Shelf life must be a positive number";
    if (!formData.location.trim())        e.location = "Location is required";
    if (!formData.contactInfo.trim() || !/^\d{10}$/.test(formData.contactInfo))
      e.contactInfo = "Contact must be a 10-digit mobile number";
    if (!formData.finalPrice || isNaN(formData.finalPrice) || Number(formData.finalPrice) <= 0)
      e.finalPrice = "Final price must be a positive number";
    if (formData.productPhotos.length === 0)
      e.productPhotos = "At least one photo is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    setShowConfirm(false);
    const data = new FormData();
    data.append("productName",       formData.productName);
    data.append("productDescription", formData.description);
    data.append("productType",        formData.cropType);
    data.append("quantity",           formData.quantity);
    data.append("unitOfQuantity",     formData.unitOfQuantity);
    data.append("harvestedDate",      formData.harvestDate);
    data.append("storageCondition",   formData.storageConditions);
    data.append("finalPrice",         formData.finalPrice);
    data.append("shelfLifetime",      formData.shelfLife);
    data.append("location",           formData.location);
    data.append("contactOfFarmer",    formData.contactInfo);
    data.append("aiGeneratedPrice",   formData.aiGeneratedPrice || "0");
    if (formData.certifications) {
      data.append("certifications",   formData.certifications);
    }
    // only send new (non-existing) photos; existing photos that weren't
    // deleted are already on the server and preserved automatically
    const newPhotos = formData.productPhotos.filter(p => !p.existingId);
    newPhotos.forEach(photo => data.append("images", photo.file));

    try {
      setSubmitting(true);
      await axios.put(`${BASE_URL}/listings/update/${id}`, data, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Listing updated successfully!");
      navigate("/my-listing");
    } catch (error) {
      console.error("Update error:", error);
      toast.error(
        `Failed to update: ${error.response?.data?.message || "Please try again"}`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveClick = () => {
    if (validate()) setShowConfirm(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen ml-0 md:ml-20 mt-16">
        <Loader />
      </div>
    );
  }

  const inputClass = (field) =>
    `mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-jewel-500 focus:border-jewel-500 sm:text-sm ${
      errors[field] ? "border-red-500 bg-red-50" : "border-gray-300 bg-gray-50"
    }`;

  return (
    <div className="min-h-screen bg-gray-50 ml-0 md:ml-20 mt-16 md:mt-18 px-4 md:px-6 lg:px-8 py-6">
      <div className="max-w-4xl mx-auto">

        {/* ── Header ── */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/my-listing")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
          >
            <ArrowLeft size={16} /> Back to My Listings
          </button>
          <div>
            <h1 className="text-2xl font-bold text-jewel-700">Edit Listing</h1>
            <p className="text-xs text-gray-500">Update your crop listing details below</p>
          </div>
        </div>

        <div className="space-y-6">

          {/* ══ SECTION 1: Basic Info ══ */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-base font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
              Product Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  className={inputClass("productName")}
                  placeholder="e.g., Basmati Rice"
                />
                {errors.productName && <p className="mt-1 text-xs text-red-600">{errors.productName}</p>}
              </div>

              {/* Crop Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Crop Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="cropType"
                  value={formData.cropType}
                  onChange={handleInputChange}
                  className={inputClass("cropType")}
                >
                  <option value="">Select a crop type</option>
                  {CROP_TYPES.map(ct => (
                    <option key={ct.value} value={ct.value}>{ct.label}</option>
                  ))}
                </select>
                {errors.cropType && <p className="mt-1 text-xs text-red-600">{errors.cropType}</p>}
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className={inputClass("description")}
                  placeholder="Describe your product quality, variety, etc."
                />
                {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  min="1"
                  className={inputClass("quantity")}
                  placeholder="e.g., 500"
                />
                {errors.quantity && <p className="mt-1 text-xs text-red-600">{errors.quantity}</p>}
              </div>

              {/* Unit */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Unit</label>
                <select
                  name="unitOfQuantity"
                  value={formData.unitOfQuantity}
                  onChange={handleInputChange}
                  className={inputClass("unitOfQuantity")}
                >
                  <option value="kg">kg</option>
                  <option value="per 20 kg">pieces</option>
                </select>
              </div>

              {/* Certifications */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Certifications <span className="text-gray-400 text-xs">(optional)</span>
                </label>
                <input
                  type="text"
                  name="certifications"
                  value={formData.certifications}
                  onChange={handleInputChange}
                  className={inputClass("certifications")}
                  placeholder="e.g., Organic, FSSAI, ISO"
                />
              </div>
            </div>
          </div>

          {/* ══ SECTION 2: Product Details ══ */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-base font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
              Product Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Harvest Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Harvest Date
                </label>
                <input
                  type="date"
                  name="harvestDate"
                  value={formData.harvestDate}
                  onChange={handleInputChange}
                  className={inputClass("harvestDate")}
                />
              </div>

              {/* Shelf Life */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Shelf Life (days) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="shelfLife"
                  value={formData.shelfLife}
                  onChange={handleInputChange}
                  min="1"
                  className={inputClass("shelfLife")}
                  placeholder="e.g., 30"
                />
                {errors.shelfLife && <p className="mt-1 text-xs text-red-600">{errors.shelfLife}</p>}
              </div>

              {/* Storage Conditions */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Storage Condition <span className="text-red-500">*</span>
                </label>
                <select
                  name="storageConditions"
                  value={formData.storageConditions}
                  onChange={handleInputChange}
                  className={inputClass("storageConditions")}
                >
                  <option value="">Select condition</option>
                  {STORAGE_CONDITIONS.map(sc => (
                    <option key={sc} value={sc}>{sc}</option>
                  ))}
                </select>
                {errors.storageConditions && <p className="mt-1 text-xs text-red-600">{errors.storageConditions}</p>}
              </div>
            </div>
          </div>

          {/* ══ SECTION 3: Location & Pricing ══ */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-base font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
              Location &amp; Pricing
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Location */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
                  <FaMapMarkerAlt className="text-jewel-500" size={12} />
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className={inputClass("location")}
                  placeholder="e.g., Pune, Maharashtra"
                />
                {errors.location && <p className="mt-1 text-xs text-red-600">{errors.location}</p>}
              </div>

              {/* Contact */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
                  <FaPhone className="text-jewel-500" size={12} />
                  Contact Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="contactInfo"
                  value={formData.contactInfo}
                  onChange={handleInputChange}
                  className={inputClass("contactInfo")}
                  placeholder="10-digit mobile number"
                />
                {errors.contactInfo && <p className="mt-1 text-xs text-red-600">{errors.contactInfo}</p>}
              </div>

              {/* AI Price Button */}
              <div className="md:col-span-2">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2 mb-3">
                  <FaExclamationTriangle className="text-yellow-500 flex-shrink-0 mt-0.5" size={13} />
                  <p className="text-xs text-yellow-800">
                    Click <strong>Recalculate AI Price</strong> to get an updated market price suggestion based on your current product details.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={fetchAiPrice}
                  disabled={aiLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-jewel-600 hover:bg-jewel-700 disabled:bg-gray-400 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  {aiLoading ? (
                    <><div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> Calculating...</>
                  ) : (
                    <><FaChartLine size={13} /> Recalculate AI Price</>
                  )}
                </button>
              </div>

              {/* AI Generated Price */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
                  <FaCoins className="text-jewel-500" size={12} />
                  AI-Suggested Price (per kg)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
                  <input
                    type="number"
                    name="aiGeneratedPrice"
                    value={formData.aiGeneratedPrice}
                    onChange={handleInputChange}
                    readOnly
                    className="mt-1 block w-full pl-7 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-600 sm:text-sm cursor-not-allowed"
                    placeholder="Auto-calculated"
                  />
                </div>
              </div>

              {/* Final Price */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
                  <FaCoins className="text-jewel-600" size={12} />
                  Your Final Price (per kg) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
                  <input
                    type="number"
                    name="finalPrice"
                    value={formData.finalPrice}
                    onChange={handleInputChange}
                    step="0.01"
                    className={`mt-1 block w-full pl-7 pr-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-jewel-500 focus:border-jewel-500 sm:text-sm ${
                      errors.finalPrice ? "border-red-500 bg-red-50" : "border-gray-300 bg-gray-50"
                    }`}
                    placeholder="e.g., 250.00"
                  />
                </div>
                {errors.finalPrice && <p className="mt-1 text-xs text-red-600">{errors.finalPrice}</p>}
                {formData.finalPrice && formData.quantity && (
                  <p className="mt-1 text-xs text-gray-500 flex items-center gap-1">
                    <FaInfoCircle size={10} />
                    Total value: <strong>₹{(parseFloat(formData.finalPrice) * parseFloat(formData.quantity)).toFixed(2)}</strong> for {formData.quantity} {formData.unitOfQuantity}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ══ SECTION 4: Photos ══ */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-base font-semibold text-gray-800 mb-1 pb-2 border-b border-gray-100">
              Product Photos
            </h2>
            <p className="text-xs text-gray-500 mb-4">
              Your current photos are shown below. Hover a photo and click <strong>&times;</strong> to remove it
              (existing photos are deleted from the server immediately). Add new photos using the button below.
              Max {MAX_PHOTOS} photos.
            </p>

            {/* Photo Grid */}
            {formData.productPhotos.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-4">
                {formData.productPhotos.map((photo, index) => (
                  <div key={photo.existingId ?? photo.preview} className="relative group aspect-square">
                    <img
                      src={photo.preview}
                      alt={`Photo ${index + 1}`}
                      className={`w-full h-full object-cover rounded-xl border-2 transition-opacity ${
                        deletingIndex === index
                          ? "opacity-40 border-red-300"
                          : photo.existingId
                          ? "border-green-200"
                          : "border-blue-200"
                      }`}
                    />
                    {/* spinner while deleting */}
                    {deletingIndex === index && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-xl">
                        <div className="animate-spin h-5 w-5 border-2 border-red-500 border-t-transparent rounded-full" />
                      </div>
                    )}
                    {/* badge */}
                    {deletingIndex !== index && (
                      <div className={`absolute bottom-1 left-1 text-white text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        photo.existingId ? "bg-green-600" : "bg-blue-500"
                      }`}>
                        {photo.existingId ? "Saved" : "New"}
                      </div>
                    )}
                    {/* remove button */}
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      disabled={deletingIndex !== null}
                      title={photo.existingId ? "Delete from server" : "Remove"}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:cursor-not-allowed"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Button */}
            {formData.productPhotos.length < MAX_PHOTOS && (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload-update"
                />
                <label
                  htmlFor="photo-upload-update"
                  className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-600 font-medium cursor-pointer hover:border-jewel-400 hover:bg-jewel-50 hover:text-jewel-700 transition-all w-full justify-center"
                >
                  <ImagePlus size={18} />
                  Add Photos ({formData.productPhotos.length}/{MAX_PHOTOS})
                </label>
              </div>
            )}
            {errors.productPhotos && (
              <p className="mt-2 text-xs text-red-600">{errors.productPhotos}</p>
            )}
          </div>

          {/* ── Save Button ── */}
          <div className="flex justify-end gap-3 pb-8">
            <button
              type="button"
              onClick={() => navigate("/my-listing")}
              className="px-6 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveClick}
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-jewel-600 hover:bg-jewel-700 disabled:bg-gray-400 text-white text-sm font-semibold transition-colors shadow-sm"
            >
              {submitting ? (
                <><div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> Saving...</>
              ) : (
                <><Save size={16} /> Save Changes</>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Confirmation Modal ── */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 backdrop-blur-sm bg-black/30">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 bg-jewel-100 rounded-full flex items-center justify-center">
                <CheckCircle className="text-jewel-600" size={22} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Confirm Edit</h3>
            </div>
            <p className="text-sm text-gray-600 mb-5">
              Are you sure you want to save these changes to your listing?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-5 py-2 rounded-lg bg-jewel-600 hover:bg-jewel-700 text-white text-sm font-semibold transition-colors"
              >
                Yes, Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateListingForm;
