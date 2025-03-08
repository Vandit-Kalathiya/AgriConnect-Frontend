// import React, { useEffect, useState } from "react";
// import leafImg from "../../assets/leaf.png";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios"; // Import axios for API calls
// import { getCurrentUser } from "../../../helper";

// export const CropContractAgreement = () => {
//   const [currentStep, setCurrentStep] = useState(1);
//   const [userType, setUserType] = useState("farmer"); // 'farmer' or 'buyer'
//   const [farmerSignature, setFarmerSignature] = useState(null); // Store as File object
//   const [buyerSignature, setBuyerSignature] = useState(null); // Store as File object
//   const [loading, setLoading] = useState(false); // For API call feedback
//   const [error, setError] = useState(null); // For error handling
//   const [file, setFile] = useState(null);
//   const [farmerAddress, setFarmerAddress] = useState("");
//   const [buyerAddress, setBuyerAddress] = useState("");vv
//   const [contractGenerated, setContractGenerated] = useState(false);
//   const [contractFile, setContractFile] = useState(null);
//   const [listing, setListing] = useState({});
//   const [farmer, setFarmer] = useState({});
//   const navigate = useNavigate();
//   const { id: listingId } = useParams();

//   const fetchListingById = async () => {
//     try {
//       const response = await axios.get(
//         `http://localhost:2527/listings/get/${listingId}`,
//         {
//           withCredentials: true,
//         }
//       );
//       console.log("Listing details:", response.data);
//       fetchFarmerDetails(response.data.contactOfFarmer);
//       setListing(response.data);
//       return response.data;
//     } catch (err) {
//       console.error("Failed to fetch listing details:", err);
//     }
//   };

//   const fetchFarmerDetails = async (farmerContact) => {
//     try {
//       const response = await axios.get(
//         `http://localhost:2525/users/${farmerContact}`,
//         {
//           withCredentials: true,
//         }
//       );
//       console.log("Farmer details:", response.data);
//       setFarmer(response.data);
//       setFarmerAddress(response.data.uniqueHexAddress);
//       return response.data;
//     } catch (err) {
//       console.error("Failed to fetch farmer details:", err);
//     }
//   };

//   const fetchUser = async () => {
//     const user = getCurrentUser();
//     setBuyerAddress(user.uniqueHexAddress);
//     return user;
//   };

//   useEffect(() => {
//     fetchUser();
//     fetchListingById();
//   }, []);

//   const [formData, setFormData] = useState({
//     farmerInfo: {
//       farmerName: "Rahul",
//       farmerAddress: "Anand, Gujarat",
//       farmerContact: "7990137814",
//     },
//     buyerInfo: {
//       buyerName: "Raj",
//       buyerAddress: "Anand, Gujarat",
//       buyerContact: "8780850751",
//     },
//     cropDetails: {
//       type: "Organic Tomatoes",
//       variety: "Roma, Grade A",
//       quantity: "5,000 kg",
//       pricePerUnit: "$2.50 per kg",
//       qualityStandards: [
//         "Minimum 90% of tomatoes must be free from blemishes",
//         "Size: Medium to large (6-8 cm diameter)",
//         "Color: Deep red, fully ripened",
//         "Pesticide-free certification required",
//       ],
//     },
//     deliveryTerms: {
//       date: "2025-04-15",
//       location: "Sunshine Groceries Warehouse, 789 Distribution Ave",
//       transportation: "Farmer",
//       packaging: "Food-grade crates, max 20kg per crate",
//     },
//     paymentTerms: {
//       totalValue: "$12,500.00",
//       method: "Bank Transfer",
//       advancePayment: "30%",
//       balanceDue: "On Delivery",
//     },
//     termsConditions: [
//       {
//         tId: 1,
//         title: "Quality Inspection",
//         content:
//           "Buyer has the right to inspect crops upon delivery and may reject if they do not meet the agreed quality standards.",
//       },
//       {
//         tId: 2,
//         title: "Force Majeure",
//         content:
//           "Neither party shall be liable for failure to perform due to natural disasters, extreme weather, or other circumstances beyond reasonable control.",
//       },
//       {
//         tId: 3,
//         title: "Dispute Resolution",
//         content:
//           "All disputes shall first be resolved through negotiation, then mediation, and finally through arbitration.",
//       },
//       {
//         tId: 4,
//         title: "Termination",
//         content:
//           "This contract may be terminated by mutual agreement with 30 days written notice.",
//       },
//       {
//         tId: 5,
//         title: "Amendments",
//         content:
//           "Any changes to this contract must be in writing and signed by both parties.",
//       },
//       {
//         tId: 6,
//         title: "Insurance",
//         content:
//           "The farmer must maintain appropriate crop insurance throughout the growing season.",
//       },
//       {
//         tId: 7,
//         title: "Governing Law",
//         content:
//           "This contract shall be governed by the laws of [State/Country].",
//       },
//     ],
//     additionalNotes:
//       "Buyer to provide reusable crates one week before harvest. Farmer agrees to participate in buyer's farm-to-table marketing program.",
//   });

//   const toggleUserType = () => {
//     setUserType(userType === "farmer" ? "buyer" : "farmer");
//   };

//   const nextStep = () => {
//     if (currentStep < 6) {
//       setCurrentStep(currentStep + 1);
//     }
//   };

//   const prevStep = () => {
//     if (currentStep > 1) {
//       setCurrentStep(currentStep - 1);
//     }
//   };

//   const handleSaveAndNext = () => {
//     saveFormData();
//     if (currentStep < 7) {
//       setCurrentStep(currentStep + 1);
//     }
//   };

//   const saveFormData = () => {
//     console.log("Saving form data locally:", formData);
//     // Optionally save to localStorage or state management if needed
//   };

//   const handleSubmit = async () => {
//     setLoading(true);
//     setError(null);

//     const submitData = new FormData();

//     // Prepare agreement details for saving
//     const agreementDetails = {
//       farmerInfo: formData.farmerInfo,
//       buyerInfo: formData.buyerInfo,
//       cropDetails: formData.cropDetails,
//       deliveryTerms: formData.deliveryTerms,
//       paymentTerms: formData.paymentTerms,
//       termsConditions: formData.termsConditions,
//       additionalNotes: formData.additionalNotes,
//     };

//     submitData.append(
//       "agreementDetails",
//       new Blob([JSON.stringify(agreementDetails)], { type: "application/json" })
//     );

//     if (farmerSignature) {
//       submitData.append("farmerSignature", farmerSignature);
//     }
//     if (buyerSignature) {
//       submitData.append("buyerSignature", buyerSignature);
//     }

//     try {
//       // Step 1: Save the contract
//       const saveResponse = await axios.post(
//         "http://localhost:2526/agreements/save",
//         submitData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//           withCredentials: true,
//         }
//       );

//       console.log("Contract saved successfully:", saveResponse.data);

//       // Step 2: Fetch the saved agreement details (assuming saveResponse.data includes the ID)
//       const agreementId = saveResponse.data.id; // Adjust based on actual response structure
//       if (!agreementId) {
//         throw new Error("Agreement ID not returned from save response");
//       }

//       const fetchResponse = await axios.get(
//         `http://localhost:2526/agreements/get/${agreementId}`,
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//           withCredentials: true,
//         }
//       );

//       const fetchedAgreementDetails = fetchResponse.data;
//       console.log("Fetched agreement details:", fetchedAgreementDetails);

//       // Step 3: Generate the PDF using fetched details
//       const contractRequest = {
//         farmerInfo: fetchedAgreementDetails.farmerInfo,
//         buyerInfo: fetchedAgreementDetails.buyerInfo,
//         cropDetails: fetchedAgreementDetails.cropDetails,
//         deliveryTerms: fetchedAgreementDetails.deliveryTerms,
//         paymentTerms: fetchedAgreementDetails.paymentTerms,
//         termsConditions: fetchedAgreementDetails.termsConditions,
//         additionalNotes: fetchedAgreementDetails.additionalNotes,
//       };

//       const response = await fetch("http://localhost:2529/contracts/generate", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Accept: "application/pdf",
//         },
//         body: JSON.stringify(contractRequest),
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(
//           `Failed to generate PDF: ${response.status} - ${errorText}`
//         );
//       }

//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.download = `AgriConnect_Contract_${contractRequest.farmerInfo.farmerName.replace(
//         /\s+/g,
//         "_"
//       )}_${contractRequest.buyerInfo.buyerName.replace(/\s+/g, "_")}.pdf`;
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(url);
//       console.log("Contract PDF generated successfully");

//       const updateListingStatus = axios.put(
//         `http://localhost:2527/listings/${listingId}/archived`
//       );
//       if (!response.ok) {
//         const errorText = await updateListingStatus.text();
//         throw new Error(
//           `Failed to generate PDF: ${updateListingStatus.status} - ${errorText}`
//         );
//       }

//       console.log(
//         "Listing status updated successfully:",
//         updateListingStatus.data
//       );

//       alert("Contract submitted and PDF generated successfully!");
//       setContractGenerated(true);
//       // navigate("/my-orders");
//     } catch (err) {
//       const errorMessage = err.response?.data || err.message;
//       setError(`Failed to submit contract or generate PDF: ${errorMessage}`);
//       console.error("Submission error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleContractUpload = async () => {
//     if (!contractFile) {
//       setError("Please select a PDF file to upload");
//       return;
//     }
//     // if (!farmerAddress || !buyerAddress) {
//     //   setError("Farmer address and buyer address are required");
//     //   return;
//     // }
//     console.log("farmer");

//     const lis = await fetchListingById();
//     const far = await fetchFarmerDetails(lis.contactOfFarmer);
//     const buy = await fetchUser();

//     console.log(far, " ", buy);

//     const uploadData = new FormData();
//     uploadData.append("file", contractFile);
//     uploadData.append("farmerAddress", far.uniqueHexAddress);
//     uploadData.append("buyerAddress", buy.uniqueHexAddress);
//     uploadData.append("listingId", listingId);
//     uploadData.append("amount", lis.finalPrice * lis.quantity);

//     try {
//       const response = await axios.post(
//         "http://localhost:2526/api/agreements/upload",
//         uploadData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//           withCredentials: true,
//         }
//       );
//       alert(
//         `Contract uploaded successfully!\nPDF Hash: ${response.data.pdfHash}\nTransaction Hash: ${response.data.txHash}`
//       );
//       navigate("/my-orders", { state: listing });
//     } catch (err) {
//       setError(err.response?.data || "Failed to upload contract");
//       console.error("Upload error:", err);
//     }
//   };

//   const handleImageUpload = (event, setSignature) => {
//     const file = event.target.files[0];
//     if (file) {
//       setSignature(file); // Store the raw File object for MultipartFile upload
//     }
//   };

//   const renderPartyInformation = () => (
//     <div className="space-y-6 max-w-2xl mx-auto bg-white p-6">
//       <div className="flex flex-col items-center gap-y-2 pb-3">
//         <div className="flex items-center gap-x-2">
//           <img src={leafImg} width={30} alt="AgriConnect logo" />
//           <h1 className="text-2xl font-bold text-snowy-mint-900">
//             AgriConnect
//           </h1>
//         </div>
//         <div className="bg-jewel-50 w-full text-center mb-2 font-poppins py-2 rounded-md text-snowy-mint-900 font-semibold">
//           CROP CONTRACT AGREEMENT
//         </div>
//       </div>

//       <div className="border-b pb-2 mb-4">
//         <h2 className="text-lg font-semibold text-jewel-700 flex items-center gap-x-2">
//           <span className="bg-jewel-100 h-6 w-6 flex items-center justify-center rounded-full text-sm">
//             1
//           </span>
//           Parties Information
//         </h2>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
//         <div className="space-y-4">
//           <h3 className="font-medium text-jewel-600 text-sm uppercase tracking-wider">
//             Farmer/Supplier Details
//           </h3>
//           <div>
//             <label className="block font-medium text-sm mb-1 text-gray-700">
//               Full Name
//             </label>
//             <input
//               type="text"
//               className="w-full p-2 border rounded-lg focus:ring focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none transition-all duration-200"
//               value={formData.farmerInfo.farmerName}
//               disabled={userType === "buyer"}
//               onChange={(e) =>
//                 setFormData({
//                   ...formData,
//                   farmerInfo: { ...formData.farmerInfo, name: e.target.value },
//                 })
//               }
//               placeholder="Enter farmer's name"
//             />
//           </div>
//           <div>
//             <label className="block font-medium mb-1 text-sm text-gray-700">
//               Address
//             </label>
//             <input
//               type="text"
//               className="w-full p-2 border rounded-lg focus:ring focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none transition-all duration-200"
//               value={formData.farmerInfo.farmerAddress}
//               disabled={userType === "buyer"}
//               onChange={(e) =>
//                 setFormData({
//                   ...formData,
//                   farmerInfo: {
//                     ...formData.farmerInfo,
//                     address: e.target.value,
//                   },
//                 })
//               }
//               placeholder="Enter farmer's address"
//             />
//           </div>
//           <div>
//             <label className="block font-medium mb-1 text-sm text-gray-700">
//               Contact Number
//             </label>
//             <input
//               type="text"
//               className="w-full p-2 border rounded-lg focus:ring focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none transition-all duration-200"
//               value={formData.farmerInfo.farmerContact}
//               disabled={userType === "buyer"}
//               onChange={(e) =>
//                 setFormData({
//                   ...formData,
//                   farmerInfo: {
//                     ...formData.farmerInfo,
//                     contact: e.target.value,
//                   },
//                 })
//               }
//               placeholder="Enter farmer's contact number"
//             />
//           </div>
//         </div>

//         <div className="space-y-4">
//           <h3 className="font-medium text-jewel-600 text-sm uppercase tracking-wider">
//             Buyer Details
//           </h3>
//           <div>
//             <label className="block font-medium mb-1 text-sm text-gray-700">
//               Full Name
//             </label>
//             <input
//               type="text"
//               className="w-full p-2 border rounded-lg focus:ring focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none transition-all duration-200"
//               value={formData.buyerInfo.buyerName}
//               disabled={userType === "farmer"}
//               onChange={(e) =>
//                 setFormData({
//                   ...formData,
//                   buyerInfo: { ...formData.buyerInfo, name: e.target.value },
//                 })
//               }
//               placeholder="Enter buyer's name"
//             />
//           </div>
//           <div>
//             <label className="block font-medium mb-1 text-sm text-gray-700">
//               Address
//             </label>
//             <input
//               type="text"
//               className="w-full p-2 border rounded-lg focus:ring focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none transition-all duration-200"
//               value={formData.buyerInfo.buyerAddress}
//               disabled={userType === "farmer"}
//               onChange={(e) =>
//                 setFormData({
//                   ...formData,
//                   buyerInfo: { ...formData.buyerInfo, address: e.target.value },
//                 })
//               }
//               placeholder="Enter buyer's address"
//             />
//           </div>
//           <div>
//             <label className="block font-medium mb-1 text-sm text-gray-700">
//               Contact Number
//             </label>
//             <input
//               type="text"
//               className="w-full p-2 border rounded-lg focus:ring focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none transition-all duration-200"
//               value={formData.buyerInfo.buyerContact}
//               disabled={userType === "farmer"}
//               onChange={(e) =>
//                 setFormData({
//                   ...formData,
//                   buyerInfo: { ...formData.buyerInfo, contact: e.target.value },
//                 })
//               }
//               placeholder="Enter buyer's contact number"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const renderCropDetails = () => (
//     <div className="space-y-6 max-w-2xl mx-auto bg-white p-6">
//       <div className="border-b pb-2 mb-4">
//         <h2 className="text-lg font-semibold text-jewel-700 flex items-center gap-x-2">
//           <span className="bg-jewel-100 h-6 w-6 flex items-center justify-center rounded-full text-sm">
//             2
//           </span>
//           Crop Details
//         </h2>
//       </div>

//       <div className="space-y-5">
//         <div>
//           <label className="block font-medium text-sm mb-1 text-gray-700">
//             Crop Type
//           </label>
//           <div className="relative">
//             <select
//               className="w-full p-2 pl-3 border rounded-lg focus:ring focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none appearance-none transition-all duration-200 bg-white"
//               value={formData.cropDetails.type}
//               disabled={userType === "buyer"}
//               onChange={(e) =>
//                 setFormData({
//                   ...formData,
//                   cropDetails: {
//                     ...formData.cropDetails,
//                     type: e.target.value,
//                   },
//                 })
//               }
//             >
//               <option value="Organic Tomatoes">Organic Tomatoes</option>
//               <option value="Organic Potatoes">Organic Potatoes</option>
//               <option value="Organic Lettuce">Organic Lettuce</option>
//             </select>
//             <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-jewel-500">
//               <svg
//                 className="w-4 h-4"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M19 9l-7 7-7-7"
//                 />
//               </svg>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="block font-medium text-sm mb-1 text-gray-700">
//               Variety/Grade
//             </label>
//             <input
//               type="text"
//               className="w-full p-2 border rounded-lg focus:ring focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none transition-all duration-200"
//               value={formData.cropDetails.variety}
//               disabled={userType === "buyer"}
//               onChange={(e) =>
//                 setFormData({
//                   ...formData,
//                   cropDetails: {
//                     ...formData.cropDetails,
//                     variety: e.target.value,
//                   },
//                 })
//               }
//               placeholder="e.g., Roma, Cherry, Beefsteak"
//             />
//           </div>
//           <div>
//             <label className="block font-medium text-sm mb-1 text-gray-700">
//               Quantity
//             </label>
//             <input
//               type="text"
//               className="w-full p-2 border rounded-lg focus:ring focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none transition-all duration-200"
//               value={formData.cropDetails.quantity}
//               disabled={userType === "buyer"}
//               onChange={(e) =>
//                 setFormData({
//                   ...formData,
//                   cropDetails: {
//                     ...formData.cropDetails,
//                     quantity: e.target.value,
//                   },
//                 })
//               }
//               placeholder="e.g., 500 kg, 2 tons"
//             />
//           </div>
//         </div>

//         <div>
//           <label className="block font-medium text-sm mb-1 text-gray-700">
//             Price per Unit
//           </label>
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <span className="text-gray-500">$</span>
//             </div>
//             <input
//               type="text"
//               className="w-full p-2 pl-8 border rounded-lg focus:ring focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none transition-all duration-200"
//               value={formData.cropDetails.pricePerUnit}
//               disabled={userType === "buyer"}
//               onChange={(e) =>
//                 setFormData({
//                   ...formData,
//                   cropDetails: {
//                     ...formData.cropDetails,
//                     pricePerUnit: e.target.value,
//                   },
//                 })
//               }
//               placeholder="0.00"
//             />
//           </div>
//         </div>

//         <div className="bg-jewel-50 p-3 rounded-lg">
//           <div className="flex justify-between items-center">
//             <span className="text-sm font-medium text-gray-700">
//               Total Value:
//             </span>
//             <span className="font-semibold text-jewel-700">
//               $
//               {(
//                 parseFloat(formData.cropDetails.pricePerUnit || 0) *
//                 parseFloat(formData.cropDetails.quantity || 0)
//               ).toFixed(2)}
//             </span>
//           </div>
//         </div>

//         <div>
//           <label className="block font-medium text-sm mb-1 text-gray-700">
//             Quality Standards & Specifications
//           </label>
//           <div className="border rounded-lg p-3 max-h-36 overflow-y-auto bg-gray-50">
//             {formData.cropDetails.qualityStandards.length > 0 ? (
//               formData.cropDetails.qualityStandards.map((standard, index) => (
//                 <div key={index} className="mb-2 flex items-start">
//                   <div className="h-5 w-5 text-jewel-500 mr-2">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       viewBox="0 0 20 20"
//                       fill="currentColor"
//                     >
//                       <path
//                         fillRule="evenodd"
//                         d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                   </div>
//                   <span className="text-gray-700">{standard}</span>
//                 </div>
//               ))
//             ) : (
//               <div className="text-gray-500 text-sm italic">
//                 No quality standards specified
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const renderDeliveryTerms = () => (
//     <div className="space-y-6 max-w-2xl mx-auto bg-white p-6">
//       <div className="border-b pb-2 mb-4">
//         <h2 className="text-lg font-semibold text-jewel-700 flex items-center gap-x-2">
//           <span className="bg-jewel-100 h-6 w-6 flex items-center justify-center rounded-full text-sm">
//             3
//           </span>
//           Delivery Terms
//         </h2>
//       </div>

//       <div className="space-y-5">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="block font-medium text-sm mb-1 text-gray-700">
//               Delivery Date
//             </label>
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <svg
//                   className="h-4 w-4 text-jewel-500"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
//                   />
//                 </svg>
//               </div>
//               <input
//                 type="date"
//                 className="w-full p-2 pl-10 border rounded-lg focus:ring focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none transition-all duration-200"
//                 value={formData.deliveryTerms.date}
//                 disabled={userType === "buyer"}
//                 onChange={(e) =>
//                   setFormData({
//                     ...formData,
//                     deliveryTerms: {
//                       ...formData.deliveryTerms,
//                       date: e.target.value,
//                     },
//                   })
//                 }
//               />
//             </div>
//             <div className="text-xs text-gray-500 mt-1">46 days from today</div>
//           </div>

//           <div>
//             <label className="block font-medium text-sm mb-1 text-gray-700">
//               Delivery Location
//             </label>
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <svg
//                   className="h-4 w-4 text-jewel-500"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
//                   />
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
//                   />
//                 </svg>
//               </div>
//               <input
//                 type="text"
//                 className="w-full p-2 pl-10 border rounded-lg focus:ring focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none transition-all duration-200"
//                 value={formData.deliveryTerms.location}
//                 disabled={userType === "buyer"}
//                 onChange={(e) =>
//                   setFormData({
//                     ...formData,
//                     deliveryTerms: {
//                       ...formData.deliveryTerms,
//                       location: e.target.value,
//                     },
//                   })
//                 }
//                 placeholder="Enter delivery address"
//               />
//             </div>
//           </div>
//         </div>

//         <div>
//           <label className="block font-medium text-sm mb-2 text-gray-700">
//             Transportation Responsibility
//           </label>
//           <div className="grid grid-cols-3 gap-2">
//             {["Farmer", "Buyer", "Shared"].map((option) => (
//               <div
//                 key={option}
//                 className={`
//                   border rounded-lg p-3 text-center cursor-pointer transition-all duration-200
//                   ${
//                     formData.deliveryTerms.transportation === option
//                       ? "bg-jewel-50 border-jewel-300 text-jewel-700"
//                       : "bg-white hover:bg-gray-50"
//                   }
//                   ${
//                     userType === "buyer" ? "opacity-80 pointer-events-none" : ""
//                   }
//                 `}
//                 onClick={() => {
//                   if (userType !== "buyer") {
//                     setFormData({
//                       ...formData,
//                       deliveryTerms: {
//                         ...formData.deliveryTerms,
//                         transportation: option,
//                       },
//                     });
//                   }
//                 }}
//               >
//                 <div className="flex items-center justify-center gap-2">
//                   <div
//                     className={`h-4 w-4 rounded-full border ${
//                       formData.deliveryTerms.transportation === option
//                         ? "border-jewel-500 bg-jewel-500"
//                         : "border-gray-400"
//                     }`}
//                   >
//                     {formData.deliveryTerms.transportation === option && (
//                       <div className="h-2 w-2 rounded-full bg-white m-auto mt-0.5"></div>
//                     )}
//                   </div>
//                   <span>{option}</span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div>
//           <label className="block font-medium text-sm mb-1 text-gray-700">
//             Packaging Requirements
//           </label>
//           <textarea
//             className="w-full p-3 border rounded-lg focus:ring focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none transition-all duration-200 min-h-24"
//             value={formData.deliveryTerms.packaging}
//             disabled={userType === "buyer"}
//             onChange={(e) =>
//               setFormData({
//                 ...formData,
//                 deliveryTerms: {
//                   ...formData.deliveryTerms,
//                   packaging: e.target.value,
//                 },
//               })
//             }
//             placeholder="Specify packaging type, materials, weight limits, etc."
//           />
//         </div>

//         <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//           <div className="flex items-start gap-3">
//             <div className="text-jewel-500 mt-0.5">
//               <svg
//                 className="h-5 w-5"
//                 fill="currentColor"
//                 viewBox="0 0 20 20"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//             </div>
//             <div>
//               <h3 className="text-sm font-medium text-gray-800">
//                 Delivery Instructions
//               </h3>
//               <p className="text-xs text-gray-600 mt-1">
//                 All deliveries must be scheduled at least 24 hours in advance.
//                 Upon arrival, please contact the receiving department at the
//                 provided number.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const renderPaymentTerms = () => {
//     const isBuyer = userType === "buyer";

//     return (
//       <div className="bg-white p-6">
//         <div className="border-b border-gray-200 pb-4 mb-6">
//           <h2 className="text-xl font-semibold text-jewel-700 flex items-center">
//             <span className="bg-jewel-100 text-jewel-700 w-8 h-8 rounded-full flex items-center justify-center mr-3">
//               4
//             </span>
//             Payment Terms
//           </h2>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label className="block font-medium text-gray-700 mb-2">
//               Total Contract Value
//             </label>
//             <div className="relative">
//               <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
//                 $
//               </span>
//               <input
//                 type="text"
//                 className={`w-full pl-8 p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none transition-colors ${
//                   isBuyer ? "bg-gray-100 text-gray-700" : "hover:bg-white"
//                 }`}
//                 value={formData.paymentTerms.totalValue}
//                 disabled={isBuyer}
//                 onChange={(e) =>
//                   setFormData({
//                     ...formData,
//                     paymentTerms: {
//                       ...formData.paymentTerms,
//                       totalValue: e.target.value,
//                     },
//                   })
//                 }
//                 placeholder="0.00"
//               />
//             </div>
//             {!isBuyer && (
//               <p className="text-xs text-gray-500 mt-1">
//                 Enter the full contract amount
//               </p>
//             )}
//           </div>

//           <div>
//             <label className="block font-medium text-gray-700 mb-2">
//               Payment Method
//             </label>
//             <select
//               className={`w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none transition-colors ${
//                 isBuyer ? "bg-gray-100 text-gray-700" : "hover:bg-white"
//               }`}
//               value={formData.paymentTerms.method}
//               disabled={isBuyer}
//               onChange={(e) =>
//                 setFormData({
//                   ...formData,
//                   paymentTerms: {
//                     ...formData.paymentTerms,
//                     method: e.target.value,
//                   },
//                 })
//               }
//             >
//               <option value="Bank Transfer">Bank Transfer</option>
//               <option value="Check">Check</option>
//               <option value="Cash">Cash</option>
//               <option value="Credit Card">Credit Card</option>
//               <option value="Wire Transfer">Wire Transfer</option>
//             </select>
//           </div>

//           <div>
//             <label className="block font-medium text-gray-700 mb-2">
//               Advance Payment (%)
//             </label>
//             <div className="relative">
//               <input
//                 type="text"
//                 className={`w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none transition-colors ${
//                   isBuyer ? "bg-gray-100 text-gray-700" : "hover:bg-white"
//                 }`}
//                 value={formData.paymentTerms.advancePayment}
//                 disabled={isBuyer}
//                 onChange={(e) =>
//                   setFormData({
//                     ...formData,
//                     paymentTerms: {
//                       ...formData.paymentTerms,
//                       advancePayment: e.target.value,
//                     },
//                   })
//                 }
//                 placeholder="0"
//               />
//               <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">
//                 %
//               </span>
//             </div>
//           </div>

//           <div>
//             <label className="block font-medium text-gray-700 mb-2">
//               Balance Payment Due
//             </label>
//             <select
//               className={`w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none transition-colors ${
//                 isBuyer ? "bg-gray-100 text-gray-700" : "hover:bg-white"
//               }`}
//               value={formData.paymentTerms.balanceDue}
//               disabled={isBuyer}
//               onChange={(e) =>
//                 setFormData({
//                   ...formData,
//                   paymentTerms: {
//                     ...formData.paymentTerms,
//                     balanceDue: e.target.value,
//                   },
//                 })
//               }
//             >
//               <option value="On Delivery">On Delivery</option>
//               <option value="Net 15">Net 15 (15 days)</option>
//               <option value="Net 30">Net 30 (30 days)</option>
//               <option value="Net 45">Net 45 (45 days)</option>
//               <option value="Net 60">Net 60 (60 days)</option>
//             </select>
//           </div>
//         </div>

//         {!isBuyer && (
//           <div className="mt-6 pt-4 border-t border-gray-200">
//             <button
//               type="button"
//               className="px-4 py-2 bg-jewel-100 text-jewel-700 rounded-md hover:bg-jewel-200 transition-colors text-sm font-medium"
//               onClick={() => {
//                 /* Add custom payment terms handler */
//               }}
//             >
//               + Add Custom Payment Terms
//             </button>
//           </div>
//         )}
//       </div>
//     );
//   };

//   const renderTermsAndConditions = () => (
//     <div className="space-y-8">
//       <div>
//         <div className="flex items-center mb-4">
//           <div className="bg-jewel-100 text-jewel-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 font-bold">
//             5
//           </div>
//           <h2 className="text-xl font-semibold text-gray-800">
//             Terms & Conditions
//           </h2>
//         </div>

//         <div className="bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
//           <div className="p-4 bg-gray-100 border-b border-gray-200 flex justify-between items-center">
//             <h3 className="font-medium text-gray-700">Contract Terms</h3>
//             <span className="text-xs bg-jewel-100 text-jewel-600 px-2 py-1 rounded-full">
//               Required
//             </span>
//           </div>

//           <div className="max-h-72 overflow-y-auto p-4">
//             {formData.termsConditions.map((term, index) => (
//               <div
//                 key={term.id}
//                 className={`mb-4 pb-4 ${
//                   index < formData.termsConditions.length - 1
//                     ? "border-b border-gray-100"
//                     : ""
//                 }`}
//               >
//                 <div className="font-semibold text-gray-800 mb-1 flex items-start">
//                   <span className="bg-jewel-50 text-jewel-600 rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2 flex-shrink-0">
//                     {term.id}
//                   </span>
//                   <span>{term.title}</span>
//                 </div>
//                 <div className="text-gray-600 pl-8">{term.content}</div>
//               </div>
//             ))}
//           </div>

//           <div className="p-3 bg-jewel-50 border-t border-gray-200 text-xs text-gray-500 italic">
//             By proceeding, you acknowledge that you have read and agree to these
//             terms.
//           </div>
//         </div>
//       </div>

//       <div>
//         <div className="flex items-center mb-4">
//           <div className="bg-jewel-100 text-jewel-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 font-bold">
//             6
//           </div>
//           <h2 className="text-xl font-semibold text-gray-800">
//             Additional Notes
//           </h2>
//         </div>

//         <div className="bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
//           <div className="p-4 bg-gray-100 border-b border-gray-200 flex justify-between items-center">
//             <h3 className="font-medium text-gray-700">
//               Special Instructions or Comments
//             </h3>
//             <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
//               Optional
//             </span>
//           </div>

//           <div className="p-4">
//             <textarea
//               className="w-full p-3 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none resize-none transition-all"
//               value={formData.additionalNotes}
//               disabled={userType === "buyer"}
//               onChange={(e) =>
//                 setFormData({ ...formData, additionalNotes: e.target.value })
//               }
//               placeholder={
//                 userType === "buyer"
//                   ? "No additional notes provided by the farmer"
//                   : "Add any special instructions, requirements or information..."
//               }
//             />
//             {userType === "buyer" && (
//               <div className="mt-2 text-sm text-gray-500 flex items-center">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-4 w-4 mr-1"
//                   viewBox="0 0 20 20"
//                   fill="currentColor"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 116 0z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//                 This field can only be edited by the farmer
//               </div>
//             )}
//             {userType === "farmer" && (
//               <div className="mt-2 text-xs text-gray-500">
//                 {formData.additionalNotes.length} / 500 characters
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const renderSignatures = () => {
//     const currentDate = new Date().toLocaleDateString();
//     const userRole = userType;

//     const canEditSignature = (role) => userRole === role;

//     const renderSignatureBox = (role, signature, setSignature) => {
//       const isEditable = canEditSignature(role);
//       const roleLabel = role === "farmer" ? "Farmer" : "Buyer";

//       return (
//         <div
//           className={`space-y-4 p-6 rounded-lg border ${
//             isEditable ? "bg-white" : "bg-gray-50"
//           } ${
//             isEditable ? "border-jewel-200" : "border-gray-200"
//           } transition-all hover:shadow-md`}
//         >
//           <div className="text-center">
//             <div
//               className={`font-semibold text-lg ${
//                 isEditable ? "text-jewel-700" : "text-gray-700"
//               } mb-1`}
//             >
//               {roleLabel} Signature
//             </div>
//             <div className="text-sm text-gray-500">Date: {currentDate}</div>
//           </div>

//           {signature ? (
//             <div className="relative group">
//               <img
//                 src={URL.createObjectURL(signature)}
//                 alt={`${roleLabel} Signature`}
//                 className="w-full h-24 object-contain mx-auto border p-2 bg-white rounded-md"
//               />
//               {isEditable && (
//                 <button
//                   onClick={() => setSignature(null)}
//                   className="absolute top-2 right-2 bg-red-100 text-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
//                   aria-label="Remove signature"
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-4 w-4"
//                     viewBox="0 0 20 20"
//                     fill="currentColor"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                 </button>
//               )}
//             </div>
//           ) : (
//             <div
//               className={`w-full h-24 mx-auto border border-dashed ${
//                 isEditable ? "border-jewel-300" : "border-gray-300"
//               } bg-white flex flex-col items-center justify-center rounded-md ${
//                 isEditable ? "text-jewel-400" : "text-gray-400"
//               }`}
//             >
//               {isEditable ? (
//                 <>
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-8 w-8 text-jewel-300 mb-2"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={1.5}
//                       d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
//                     />
//                   </svg>
//                   <span className="text-sm">Your Signature Required</span>
//                 </>
//               ) : (
//                 <>
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-8 w-8 text-gray-300 mb-2"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={1.5}
//                       d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
//                     />
//                   </svg>
//                   <span className="text-sm">
//                     Awaiting {roleLabel} Signature
//                   </span>
//                 </>
//               )}
//             </div>
//           )}

//           {isEditable && !signature && (
//             <div className="flex justify-center mt-4">
//               <label className="cursor-pointer flex items-center justify-center px-4 py-2 bg-jewel-600 text-white rounded-md hover:bg-jewel-700 transition-colors text-sm">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-4 w-4 mr-2"
//                   viewBox="0 0 20 20"
//                   fill="currentColor"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//                 Upload Signature
//                 <input
//                   type="file"
//                   accept="image/*"
//                   className="hidden"
//                   onChange={(e) => handleImageUpload(e, setSignature)}
//                 />
//               </label>
//             </div>
//           )}

//           {isEditable && signature && (
//             <div className="text-center text-xs text-jewel-600 font-medium">
//               Your signature has been added
//             </div>
//           )}
//         </div>
//       );
//     };

//     return (
//       <div className="space-y-8 p-8">
//         <div className="text-center mb-8">
//           <h3 className="text-xl font-semibold text-gray-800 mb-2">
//             Contract Signatures
//           </h3>
//           <p className="text-gray-500 max-w-md mx-auto">
//             Both parties must sign to finalize this contract. You can only sign
//             in your designated area.
//           </p>
//         </div>

//         <div className="grid md:grid-cols-2 gap-8">
//           {renderSignatureBox("farmer", farmerSignature, setFarmerSignature)}
//           {renderSignatureBox("buyer", buyerSignature, setBuyerSignature)}
//         </div>

//         <div className="mt-8 p-4 bg-gray-50 border border-gray-100 rounded-lg text-center text-sm text-gray-600">
//           <div className="flex items-center justify-center mb-2">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-5 w-5 text-jewel-500 mr-2"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//               />
//             </svg>
//             <span className="font-medium">Legal Agreement</span>
//           </div>
//           By uploading your signature, you confirm that you have read and agree
//           to all terms and conditions outlined in this contract. This digital
//           signature carries the same legal weight as a physical signature.
//         </div>
//       </div>
//     );
//   };

//   const renderStepContent = () => {
//     switch (currentStep) {
//       case 1:
//         return renderPartyInformation();
//       case 2:
//         return renderCropDetails();
//       case 3:
//         return renderDeliveryTerms();
//       case 4:
//         return renderPaymentTerms();
//       case 5:
//         return renderTermsAndConditions();
//       case 6:
//         return renderSignatures();
//       case 7:
//         return UploadContract();
//       default:
//         return null;
//     }
//   };

//   const renderNavigationButtons = () => {
//     if (userType === "buyer") {
//       return (
//         <div className="flex justify-between pt-6">
//           <div>
//             {currentStep > 1 && (
//               <button
//                 onClick={prevStep}
//                 className="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300"
//               >
//                 Back
//               </button>
//             )}
//           </div>

//           <div className="flex space-x-3">
//             {currentStep === 1 && (
//               <button
//                 onClick={handleSaveAndNext}
//                 className="bg-jewel-600 text-white px-4 py-2 rounded hover:bg-jewel-700"
//               >
//                 Save and Next
//               </button>
//             )}

//             {currentStep > 1 && currentStep < 6 && (
//               <button
//                 onClick={nextStep}
//                 className="bg-jewel-600 text-white px-4 py-2 rounded hover:bg-jewel-700"
//               >
//                 Next
//               </button>
//             )}

//             {currentStep === 6 && (
//               <button
//                 onClick={handleSubmit}
//                 disabled={loading || !farmerSignature || !buyerSignature}
//                 className={`bg-jewel-600 text-white px-4 py-2 rounded hover:bg-jewel-700 ${
//                   loading || !farmerSignature || !buyerSignature
//                     ? "bg-gray-400 cursor-not-allowed"
//                     : "bg-green-600 hover:bg-green-700"
//                 }`}
//               >
//                 {loading ? "Submitting..." : "Submit"}
//               </button>
//             )}
//           </div>
//         </div>
//       );
//     } else {
//       // Farmer
//       return (
//         <div className="flex justify-between pt-6">
//           <div>
//             {currentStep > 1 && (
//               <button
//                 onClick={prevStep}
//                 className="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300"
//               >
//                 Back
//               </button>
//             )}
//           </div>

//           <div className="flex space-x-3">
//             {currentStep === 1 && (
//               <button
//                 onClick={handleSaveAndNext}
//                 className="bg-jewel-600 text-white px-4 py-2 rounded hover:bg-jewel-700"
//               >
//                 Save and Next
//               </button>
//             )}

//             {currentStep > 1 && currentStep < 6 && (
//               <button
//                 onClick={handleSaveAndNext}
//                 className="bg-jewel-600 text-white px-4 py-2 rounded hover:bg-jewel-700"
//               >
//                 Save and Next
//               </button>
//             )}

//             {currentStep === 6 && (
//               <div className="flex flex-col space-y-4">
//                 <button
//                   onClick={handleSubmit}
//                   disabled={loading || !farmerSignature || !buyerSignature}
//                   className={`bg-jewel-600 text-white px-4 py-2 rounded hover:bg-jewel-700 ${
//                     loading || !farmerSignature || !buyerSignature
//                       ? "bg-gray-400 cursor-not-allowed"
//                       : "bg-green-600 hover:bg-green-700"
//                   }`}
//                 >
//                   {loading ? "Submitting..." : "Generate Contract"}
//                 </button>
//               </div>
//             )}

//             {currentStep === 6 && (
//               <button
//                 onClick={handleSaveAndNext}
//                 className="bg-jewel-600 text-white px-4 py-2 rounded hover:bg-jewel-700"
//               >
//                 Save and Next
//               </button>
//             )}
//           </div>
//         </div>
//       );
//     }
//   };

//   const UploadContract = () => {
//     return (
//       <div>
//         <div className="flex flex-col space-y-2">
//           <input
//             type="file"
//             accept="application/pdf"
//             onChange={(e) => setContractFile(e.target.files[0])}
//             className="w-full p-2 border rounded-lg"
//           />
//           <button
//             onClick={handleContractUpload}
//             disabled={!contractFile}
//             className={`px-4 py-2 rounded text-white ${
//               !contractFile
//                 ? "bg-gray-400 cursor-not-allowed"
//                 : "bg-jewel-600 hover:bg-jewel-700"
//             }`}
//           >
//             Upload Contract
//           </button>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
//         <div className="mb-4 text-right">
//           <button
//             onClick={toggleUserType}
//             className="text-sm text-jewel-600 hover:text-jewel-800"
//           >
//             Current role: {userType === "farmer" ? "Farmer" : "Buyer"} (click to
//             toggle)
//           </button>
//         </div>

//         {error && (
//           <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
//             {error}
//           </div>
//         )}

//         <div>{renderStepContent()}</div>
//         {renderNavigationButtons()}
//       </div>
//     </div>
//   );
// };








import React, { useEffect, useState } from "react";
import leafImg from "../../assets/leaf.png";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios"; // Import axios for API calls
import { getCurrentUser } from "../../../helper";
import { Upload, FileText, CheckCircle } from "lucide-react";

export const CropContractAgreement = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [userType, setUserType] = useState("farmer"); // 'farmer' or 'buyer'
  const [farmerSignature, setFarmerSignature] = useState(null); // Store as File object
  const [buyerSignature, setBuyerSignature] = useState(null); // Store as File object
  const [loading, setLoading] = useState(false); // For API call feedback
  const [error, setError] = useState(null); // For error handling
  const [contractFile, setContractFile] = useState(null);
  const [farmerAddress, setFarmerAddress] = useState(null);
  const [buyerAddress, setBuyerAddress] = useState(null);
  // const [user, setUser] = useState(null);
  const [contractGenerated, setContractGenerated] = useState(false);
  const navigate = useNavigate();
  const { id: listingId } = useParams();
  const fetchUser = async () => {
    const user = await getCurrentUser();
    // setUser(user);
    setBuyerAddress(user.uniqueHexAddress);
    return user;
  };

  useEffect(() => {
    fetchUser();
    fetchListingById();
  }, []);

  const [formData, setFormData] = useState({
    farmerInfo: {
      farmerName: "",
      farmerAddress: "",
      farmerContact: "",
      // farmerSignature: "",
    },
    buyerInfo: {
      buyerName: "",
      buyerAddress: "",
      buyerContact: "",
      // buyerSignature: "",
    },
    cropDetails: {
      type: "",
      variety: "",
      quantity: "",
      pricePerUnit: "",
      qualityStandards: [
        "Minimum 90% of tomatoes must be free from blemishes",
        "Size: Medium to large (6-8 cm diameter)",
        "Color: Deep red, fully ripened",
        "Pesticide-free certification required",
      ],
    },
    deliveryTerms: {
      date: "",
      location: "",
      transportation: "Farmer",
      packaging: "",
    },
    paymentTerms: {
      totalValue: "",
      method: "Online Transfer",
      advancePayment: "100%",
      balanceDue: "On Delivery",
    },
    termsConditions: [
      {
        Id: 1,
        title: "Quality Inspection",
        content:
          "Buyer has the right to inspect crops upon delivery and may reject if they do not meet the agreed quality standards.",
      },
      {
        Id: 2,
        title: "Force Majeure",
        content:
          "Neither party shall be liable for failure to perform due to natural disasters, extreme weather, or other circumstances beyond reasonable control.",
      },
      {
        Id: 3,
        title: "Dispute Resolution",
        content:
          "All disputes shall first be resolved through negotiation, then mediation, and finally through arbitration.",
      },
      {
        Id: 4,
        title: "Termination",
        content:
          "This contract may be terminated by mutual agreement with 30 days written notice.",
      },
      {
        Id: 5,
        title: "Amendments",
        content:
          "Any changes to this contract must be in writing and signed by both parties.",
      },
      {
        Id: 6,
        title: "Insurance",
        content:
          "The farmer must maintain appropriate crop insurance throughout the growing season.",
      },
      {
        Id: 7,
        title: "Governing Law",
        content:
          "This contract shall be governed by the laws of [State/Country].",
      },
    ],
    additionalNotes: "",
  });

  const formDataToSave = new FormData();

  const fetchListingById = async () => {
    try {
      const response = await axios.get(
        `http://localhost:2527/listings/get/${listingId}`,
        {
          withCredentials: true,
        }
      );
      console.log("Listing details:", response.data);

      const farmer = await fetchFarmerDetails(response.data.contactOfFarmer);

      const farmerDetails = {
        farmerName: farmer.username,
        farmerAddress: farmer.address,
        farmerContact: farmer.phoneNumber,
      };

      const user = await getCurrentUser();
      console.log(user);
      const buyerDetails = {
        buyerName: user.username,
        buyerAddress: user.address,
        buyerContact: user.phoneNumber,
      };

      const cropDetails = {
        type: response.data.productType,
        variety: response.data.qualityGrade,
        pricePerUnit: `${response.data.finalPrice} ${response.data.unitOfQuantity}`,
      };

      console.log(farmerDetails);
      console.log(cropDetails);

      setFormData((prev) => ({
        ...prev,
        farmerInfo: farmerDetails,
        buyerInfo: buyerDetails,
        cropDetails: { ...prev.cropDetails, ...cropDetails },
      }));

      try {
        // Fetch the image file from your assets
        const response = leafImg;
        const blob = await response.blob();

        // Convert blob to base64 string
        const reader = new FileReader();
        reader.onloadend = () => {
          setFarmerSignature(reader.result);
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error("Failed to convert farmer signature to base64:", error);
      }

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
      return response.data;
    } catch (err) {
      console.error("Failed to fetch farmer details:", err);
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
    // Append all form data
    formDataToSave.append("farmerInfo", JSON.stringify(formData.farmerInfo));
    formDataToSave.append("buyerInfo", JSON.stringify(formData.buyerInfo));
    formDataToSave.append("cropDetails", JSON.stringify(formData.cropDetails));
    formDataToSave.append(
      "deliveryTerms",
      JSON.stringify(formData.deliveryTerms)
    );
    formDataToSave.append(
      "paymentTerms",
      JSON.stringify(formData.paymentTerms)
    );
    formDataToSave.append("additionalNotes", formData.additionalNotes);

    // Append signatures if they exist
    if (farmerSignature) {
      formDataToSave.append("farmerSignature", farmerSignature);
    }
    if (buyerSignature) {
      formDataToSave.append("buyerSignature", buyerSignature);
    }

    console.log("Saving form data:", Object.fromEntries(formDataToSave));
  };

  const calculateTotalValue = () => {
    const quantity = parseFloat(formData.cropDetails.quantity) || 0;
    const pricePerUnit =
      parseFloat(formData.cropDetails.pricePerUnit.replace("$", "")) || 0;
    const total = (quantity * pricePerUnit).toFixed(2);
    setFormData((prev) => ({
      ...prev,
      paymentTerms: { ...prev.paymentTerms, totalValue: `$${total}` },
    }));
    return `$${total}`;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    const submitData = new FormData();

    // Prepare agreement details for saving
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
      // Step 1: Save the contract
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

      // Step 2: Fetch the saved agreement details (assuming saveResponse.data includes the ID)
      const agreementId = saveResponse.data.id; // Adjust based on actual response structure
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

      // Step 3: Generate the PDF using fetched details
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

      alert("Contract submitted and PDF generated successfully!");
      setContractGenerated(true);
      // navigate("/my-orders");
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
    // if (!farmerAddress || !buyerAddress) {
    //   setError("Farmer address and buyer address are required");
    //   return;
    // }
    console.log("farmer");

    const lis = await fetchListingById();
    const far = await fetchFarmerDetails(lis.contactOfFarmer);
    const buy = await fetchUser();

    console.log(far, " ", buy);

    const uploadData = new FormData();
    uploadData.append("file", contractFile);
    uploadData.append("farmerAddress", far.uniqueHexAddress);
    uploadData.append("buyerAddress", buy.uniqueHexAddress);

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
      navigate("/my-orders");
    } catch (err) {
      setError(err.response?.data || "Failed to upload contract");
      console.error("Upload error:", err);
    }
  };

  const renderPartyInformation = () => (
    <div className="space-y-6 max-w-2xl mx-auto bg-white p-6">
      {/* Header with logo and title */}
      <div className="flex flex-col items-center gap-y-2 pb-3">
        <div className="flex items-center gap-x-2">
          <img src={leafImg} width={30} alt="AgriConnect logo" />
          <h1 className="text-2xl font-bold text-snowy-mint-900">
            AgriConnect
          </h1>
        </div>
        <div className="bg-jewel-50 w-full text-center mb-2 font-poppins py-2 rounded-md text-snowy-mint-900 font-semibold">
          CROP CONTRACT AGREEMENT
        </div>
      </div>

      {/* Section title with improved styling */}
      <div className="border-b pb-2 mb-4">
        <h2 className="text-lg font-semibold text-jewel-700 flex items-center gap-x-2">
          <span className="bg-jewel-100 h-6 w-6 flex items-center justify-center rounded-full text-sm">
            1
          </span>
          Parties Information
        </h2>
      </div>

      {/* Two-column layout for farmer and buyer information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        {/* Farmer Information Column */}
        <div className="space-y-4">
          <h3 className="font-medium text-jewel-600 text-sm uppercase tracking-wider">
            Farmer/Supplier Details
          </h3>

          <div>
            <label className="block font-medium text-sm mb-1 text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg focus:ring focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none transition-all duration-200"
              value={formData.farmerInfo.farmerName}
              disabled
            />
          </div>

          <div>
            <label className="block font-medium mb-1 text-sm text-gray-700">
              Address
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg focus:ring focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none transition-all duration-200"
              value={formData.farmerInfo.farmerAddress}
              disabled
            />
          </div>

          <div>
            <label className="block font-medium mb-1 text-sm text-gray-700">
              Contact Number
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg focus:ring focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none transition-all duration-200"
              value={formData.farmerInfo.farmerContact}
              disabled={true}
            />
          </div>
        </div>

        {/* Buyer Information Column */}
        <div className="space-y-4">
          <h3 className="font-medium text-jewel-600 text-sm uppercase tracking-wider">
            Buyer Details
          </h3>

          <div>
            <label className="block font-medium mb-1 text-sm text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg focus:ring focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none transition-all duration-200"
              value={formData.buyerInfo.buyerName}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  buyerInfo: {
                    ...formData.buyerInfo,
                    buyerName: e.target.value,
                  },
                })
              }
              placeholder="Enter buyer's name"
            />
          </div>

          <div>
            <label className="block font-medium mb-1 text-sm text-gray-700">
              Address
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg focus:ring focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none transition-all duration-200"
              value={formData.buyerInfo.buyerAddress}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  buyerInfo: {
                    ...formData.buyerInfo,
                    buyerAddress: e.target.value,
                  },
                })
              }
              placeholder="Enter buyer's address"
            />
          </div>

          <div>
            <label className="block font-medium mb-1 text-sm text-gray-700">
              Contact Number
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg focus:ring focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none transition-all duration-200"
              value={formData.buyerInfo.buyerContact}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  buyerInfo: {
                    ...formData.buyerInfo,
                    buyerContact: e.target.value,
                  },
                })
              }
              placeholder="Enter buyer's contact number"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderCropDetails = () => (
    <div className="space-y-6 max-w-2xl mx-auto bg-white p-6">
      {/* Section title with improved styling */}
      <div className="border-b pb-2 mb-4">
        <h2 className="text-lg font-semibold text-jewel-700 flex items-center gap-x-2">
          <span className="bg-jewel-100 h-6 w-6 flex items-center justify-center rounded-full text-sm">
            2
          </span>
          Crop Details
        </h2>
      </div>

      <div className="space-y-5">
        {/* Crop Type Selector with Icon */}
        <div>
          <label className="block font-medium text-sm mb-1 text-gray-700">
            Crop Type
          </label>
          <div className="relative">
            <input
              className="w-full p-2 pl-3 border rounded-lg focus:ring focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none appearance-none transition-all duration-200 bg-white"
              value={formData.cropDetails.type}
              disabled
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-jewel-500">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Two-column layout for crop information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-sm mb-1 text-gray-700">
              Variety/Grade
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg focus:ring focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none transition-all duration-200"
              value={formData.cropDetails.variety}
              disabled
            />
          </div>

          <div>
            <label className="block font-medium text-sm mb-1 text-gray-700">
              Quantity
            </label>
            <div className="relative">
              <input
                type="text"
                className="w-full p-2 border rounded-lg focus:ring focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none transition-all duration-200"
                value={formData.cropDetails.quantity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    cropDetails: {
                      ...formData.cropDetails,
                      quantity: e.target.value,
                    },
                  })
                }
                placeholder="e.g., 500 kg, 2 tons"
                onBlur={calculateTotalValue}
              />
            </div>
          </div>
        </div>

        {/* Price with currency icon */}
        <div>
          <label className="block font-medium text-sm mb-1 text-gray-700">
            Price per Unit
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">$</span>
            </div>
            <input
              type="text"
              className="w-full p-2 pl-8 border rounded-lg focus:ring focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none transition-all duration-200"
              value={formData.cropDetails.pricePerUnit}
              disabled
            />
          </div>
        </div>

        {/* Total Price Calculation (New Feature) */}
        <div className="bg-jewel-50 p-3 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">
              Total Value:
            </span>
            <span className="font-semibold text-jewel-700">
              {formData.paymentTerms.totalValue || "$0.00"}
            </span>
          </div>
        </div>

        {/* Improved Quality Standards Section */}
        <div>
          <label className="block font-medium text-sm mb-1 text-gray-700">
            Quality Standards & Specifications
          </label>
          <div className="border rounded-lg p-3 max-h-36 overflow-y-auto bg-gray-50">
            {formData.cropDetails.qualityStandards.length > 0 ? (
              formData.cropDetails?.qualityStandards.map((standard, index) => (
                <div key={index} className="mb-2 flex items-start">
                  <div className="h-5 w-5 text-jewel-500 mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700">{standard}</span>
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-sm italic">
                No quality standards specified
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderDeliveryTerms = () => (
    <div className="space-y-6 max-w-2xl mx-auto bg-white p-6 ">
      {/* Section title with improved styling */}
      <div className="border-b pb-2 mb-4">
        <h2 className="text-lg font-semibold text-jewel-700 flex items-center gap-x-2">
          <span className="bg-jewel-100 h-6 w-6 flex items-center justify-center rounded-full text-sm">
            3
          </span>
          Delivery Terms
        </h2>
      </div>

      <div className="space-y-5">
        {/* Date and location in a two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-sm mb-1 text-gray-700">
              Delivery Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-4 w-4 text-jewel-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <input
                type="date"
                className="w-full p-2 pl-10 border rounded-lg focus:ring focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none transition-all duration-200"
                value="2025-04-15"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    deliveryTerms: {
                      ...formData.deliveryTerms,
                      date: e.target.value,
                    },
                  })
                }
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-sm mb-1 text-gray-700">
              Delivery Location
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-4 w-4 text-jewel-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                className="w-full p-2 pl-10 border rounded-lg focus:ring focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none transition-all duration-200"
                value={formData.deliveryTerms.location}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    deliveryTerms: {
                      ...formData.deliveryTerms,
                      location: e.target.value,
                    },
                  })
                }
                placeholder="Enter delivery address"
              />
            </div>
          </div>
        </div>

        {/* Transportation responsibility with radio buttons for better UX */}
        <div>
          <label className="block font-medium text-sm mb-2 text-gray-700">
            Transportation Responsibility
          </label>
          <div className="grid grid-cols-3 gap-2">
            {["Farmer", "Buyer", "Shared"].map((option) => (
              <div
                key={option}
                className={`
                border rounded-lg p-3 text-center cursor-pointer transition-all duration-200
                ${
                  formData.deliveryTerms.transportation === option
                    ? "bg-jewel-50 border-jewel-300 text-jewel-700"
                    : "bg-white hover:bg-gray-50"
                }
              `}
                onClick={() => {
                  setFormData({
                    ...formData,
                    deliveryTerms: {
                      ...formData.deliveryTerms,
                      transportation: option,
                    },
                  });
                }}
              >
                <div className="flex items-center justify-center gap-2">
                  <div
                    className={`h-4 w-4 rounded-full border ${
                      formData.deliveryTerms.transportation === option
                        ? "border-jewel-500 bg-jewel-500"
                        : "border-gray-400"
                    }`}
                  >
                    {formData.deliveryTerms.transportation === option && (
                      <div className="h-2 w-2 rounded-full bg-white m-auto mt-0.5"></div>
                    )}
                  </div>
                  <span>{option}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Packaging requirements with textarea for more space */}
        <div>
          <label className="block font-medium text-sm mb-1 text-gray-700">
            Packaging Requirements
          </label>
          <textarea
            className="w-full p-3 border rounded-lg focus:ring focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none transition-all duration-200 min-h-24"
            value={formData.deliveryTerms.packaging}
            onChange={(e) =>
              setFormData({
                ...formData,
                deliveryTerms: {
                  ...formData.deliveryTerms,
                  packaging: e.target.value,
                },
              })
            }
            placeholder="Specify packaging type, materials, weight limits, etc."
          />
        </div>

        {/* Additional delivery notes section */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex items-start gap-3">
            <div className="text-jewel-500 mt-0.5">
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-800">
                Delivery Instructions
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                All deliveries must be scheduled at least 24 hours in advance.
                Upon arrival, please contact the receiving department at the
                provided number.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPaymentTerms = () => {
    return (
      <div className="bg-white p-6">
        <div className="border-b border-gray-200 pb-4 mb-6">
          <h2 className="text-xl font-semibold text-jewel-700 flex items-center">
            <span className="bg-jewel-100 text-jewel-700 w-8 h-8 rounded-full flex items-center justify-center mr-3">
              4
            </span>
            Payment Terms
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Total Contract Value
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                $
              </span>
              <input
                type="text"
                className={`w-full pl-8 p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none transition-colors text-gray-700`}
                value={formData.paymentTerms.totalValue}
                disabled
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Payment Method
            </label>
            <input
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none transition-colors
                bg-gray-100 text-gray-700`}
              value={formData.paymentTerms.method}
              disabled
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Advance Payment (%)
            </label>
            <div className="relative">
              <input
                type="text"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none transition-colors bg-gray-100 text-gray-700`}
                value={formData.paymentTerms.advancePayment}
                disabled
              />
              <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">
                %
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTermsAndConditions = () => (
    <div className="space-y-8">
      {/* Terms & Conditions Section */}
      <div>
        <div className="flex items-center mb-4">
          <div className="bg-jewel-100 text-jewel-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 font-bold">
            5
          </div>
          <h2 className="text-xl font-semibold text-gray-800">
            Terms & Conditions
          </h2>
        </div>

        <div className="bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
          <div className="p-4 bg-gray-100 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-medium text-gray-700">Contract Terms</h3>
            <span className="text-xs bg-jewel-100 text-jewel-600 px-2 py-1 rounded-full">
              Required
            </span>
          </div>

          <div className="max-h-72 overflow-y-auto p-4">
            {formData.termsConditions.map((term, index) => (
              <div
                key={term.id}
                className={`mb-4 pb-4 ${
                  index < formData.termsConditions.length - 1
                    ? "border-b border-gray-100"
                    : ""
                }`}
              >
                <div className="font-semibold text-gray-800 mb-1 flex items-start">
                  <span className="bg-jewel-50 text-jewel-600 rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2 flex-shrink-0">
                    {term.id}
                  </span>
                  <span>{term.title}</span>
                </div>
                <div className="text-gray-600 pl-8">{term.content}</div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-jewel-50 border-t border-gray-200 text-xs text-gray-500 italic">
            By proceeding, you acknowledge that you have read and agree to these
            terms.
          </div>
        </div>
      </div>

      {/* Additional Notes Section */}
      <div>
        <div className="flex items-center mb-4">
          <div className="bg-jewel-100 text-jewel-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 font-bold">
            6
          </div>
          <h2 className="text-xl font-semibold text-gray-800">
            Additional Notes
          </h2>
        </div>

        <div className="bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
          <div className="p-4 bg-gray-100 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-medium text-gray-700">
              Special Instructions or Comments
            </h3>
            <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
              Optional
            </span>
          </div>

          <div className="p-4">
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none resize-none transition-all"
              value={formData.additionalNotes}
              onChange={(e) =>
                setFormData({ ...formData, additionalNotes: e.target.value })
              }
              placeholder={
                "Add any special instructions, requirements or information that might be relevant..."
              }
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSignatures = () => {
    const currentDate = new Date().toLocaleDateString();
    const userRole = "buyer";

    const handleImageUpload = (event, setSignature) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const signatureData = reader.result;

          // Update the signature state for displaying the image
          setSignature(signatureData);
        };
        reader.readAsDataURL(file);
      }
    };

    // Function to check if signature can be edited based on user role
    const canEditSignature = (role) => {
      return userRole === role;
    };

    // Function to render signature box with appropriate states
    const renderSignatureBox = (role, signature, setSignature) => {
      const isEditable = canEditSignature(role);
      const roleLabel = role === "farmer" ? "farmer" : "buyer";

      return (
        <div
          className={`space-y-4 p-6 rounded-lg border ${
            isEditable ? "bg-white" : "bg-gray-50"
          } 
        ${isEditable ? "border-jewel-200" : "border-gray-200"} 
        transition-all hover:shadow-md`}
        >
          <div className="text-center">
            <div
              className={`font-semibold text-lg ${
                isEditable ? "text-jewel-700" : "text-gray-700"
              } mb-1`}
            >
              {roleLabel} Signature
            </div>
            <div className="text-sm text-gray-500">Date: {currentDate}</div>
          </div>

          {signature ? (
            <div className="relative group">
              <img
                src={signature}
                alt={`${roleLabel} Signature`}
                className="w-full h-24 object-contain mx-auto border p-2 bg-white rounded-md"
              />
              {isEditable && (
                <button
                  onClick={() => setSignature(null)}
                  className="absolute top-2 right-2 bg-red-100 text-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove signature"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </div>
          ) : (
            <div
              className={`w-full h-24 mx-auto border border-dashed ${
                isEditable ? "border-jewel-300" : "border-gray-300"
              } 
            bg-white flex flex-col items-center justify-center rounded-md ${
              isEditable ? "text-jewel-400" : "text-gray-400"
            }`}
            >
              {isEditable ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-jewel-300 mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    />
                  </svg>
                  <span className="text-sm">Your Signature Required</span>
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-gray-300 mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <span className="text-sm">
                    Awaiting {roleLabel} Signature
                  </span>
                </>
              )}
            </div>
          )}

          {isEditable && !signature && (
            <div className="flex justify-center mt-4">
              <label className="cursor-pointer flex items-center justify-center px-4 py-2 bg-jewel-600 text-white rounded-md hover:bg-jewel-700 transition-colors text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Upload Signature
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, setSignature)}
                />
              </label>
            </div>
          )}

          {isEditable && signature && (
            <div className="text-center text-xs text-jewel-600 font-medium">
              Your signature has been added
            </div>
          )}
        </div>
      );
    };

    return (
      <div className="space-y-8 p-8">
        <div className="text-center mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Contract Signatures
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Both parties must sign to finalize this contract. You can only sign
            in your designated area.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Farmer Signature */}
          {renderSignatureBox("farmer", farmerSignature, setFarmerSignature)}

          {/* Buyer Signature */}
          {renderSignatureBox("buyer", buyerSignature, setBuyerSignature)}
        </div>

        <div className="mt-8 p-4 bg-gray-50 border border-gray-100 rounded-lg text-center text-sm text-gray-600">
          <div className="flex items-center justify-center mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-jewel-500 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-medium">Legal Agreement</span>
          </div>
          By uploading your signature, you confirm that you have read and agree
          to all terms and conditions outlined in this contract. This digital
          signature carries the same legal weight as a physical signature.
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderPartyInformation();
      case 2:
        return renderCropDetails();
      case 3:
        return renderDeliveryTerms();
      case 4:
        return renderPaymentTerms();
      case 5:
        return renderTermsAndConditions();
      case 6:
        return renderSignatures();
      case 7:
        return UploadContract();
      default:
        return null;
    }
  };

  const UploadContract = () => {
    return (
      <div>
        <div className="flex flex-col space-y-2">
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setContractFile(e.target.files[0])}
            className="w-full p-2 border rounded-lg"
          />
          <button
            onClick={handleContractUpload}
            disabled={!contractFile}
            className={`px-4 py-2 rounded text-white ${
              !contractFile
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-jewel-600 hover:bg-jewel-700"
            }`}
          >
            Upload Contract
          </button>
        </div>
      </div>
    );
  };

  const renderNavigationButtons = () => {
    return (
      <div className="flex justify-between pt-6">
        <div>
          {currentStep > 1 && (
            <button
              onClick={prevStep}
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300"
            >
              Back
            </button>
          )}
        </div>

        <div className="flex space-x-3">
          {currentStep === 1 && (
            <button
              onClick={handleSaveAndNext}
              className="bg-jewel-600 text-white px-4 py-2 rounded hover:bg-jewel-700"
            >
              Save and Next
            </button>
          )}

          {currentStep > 1 && currentStep < 6 && (
            <button
              onClick={handleSaveAndNext}
              className="bg-jewel-600 text-white px-4 py-2 rounded hover:bg-jewel-700"
            >
              Save and Next
            </button>
          )}

          {currentStep === 6 && (
            <div className="flex flex-col space-y-4">
              <button
                onClick={handleSubmit}
                disabled={loading || !farmerSignature || !buyerSignature}
                className={`bg-jewel-600 text-white px-4 py-2 rounded hover:bg-jewel-700 ${
                  loading || !farmerSignature || !buyerSignature
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {loading ? "Submitting..." : "Generate Contract"}
              </button>
              <button
                onClick={handleSaveAndNext}
                className="bg-jewel-600 text-white px-4 py-2 rounded hover:bg-jewel-700"
              >
                Save and Next
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {renderStepContent()}
        {renderNavigationButtons()}
      </div>
    </div>
  );
};


import React, { useEffect, useState } from "react";
import leafImg from "../../assets/leaf.png";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios"; // Import axios for API calls
import { getCurrentUser } from "../../../helper";
import { Upload, FileText, CheckCircle } from "lucide-react";

// export const CropContractAgreement = () => {
//   const [currentStep, setCurrentStep] = useState(1);
//   const [userType, setUserType] = useState("farmer"); // 'farmer' or 'buyer'
//   const [farmerSignature, setFarmerSignature] = useState(null); // Store as File object
//   const [farmerSignatureImage, setFarmerSignatureImage] = useState(null); // Store the farmer's signature image for preview

//   const [buyerSignature, setBuyerSignature] = useState(null); // Store as File object
//   const [loading, setLoading] = useState(false); // For API call feedback
//   const [error, setError] = useState(null); // For error handling
//   const [contractFile, setContractFile] = useState(null);
//   const [farmerAddress, setFarmerAddress] = useState(null);
//   const [buyerAddress, setBuyerAddress] = useState(null);
//   // const [user, setUser] = useState(null);
//   const [contractGenerated, setContractGenerated] = useState(false);
//   const navigate = useNavigate();
//   const { id: listingId } = useParams();
//   const fetchUser = async () => {
//     const user = await getCurrentUser();
//     // setUser(user);
//     setBuyerAddress(user.uniqueHexAddress);
//     return user;
//   };

//   useEffect(() => {
//     fetchUser();
//     fetchListingById();
//   }, []);

//   const [formData, setFormData] = useState({
//     farmerInfo: {
//       farmerName: "",
//       farmerAddress: "",
//       farmerContact: "",
//       // farmerSignature: "",
//     },
//     buyerInfo: {
//       buyerName: "",
//       buyerAddress: "",
//       buyerContact: "",
//       // buyerSignature: "",
//     },
//     cropDetails: {
//       type: "",
//       variety: "",
//       quantity: "",
//       pricePerUnit: "",
//       qualityStandards: [
//         "Minimum 90% of tomatoes must be free from blemishes",
//         "Size: Medium to large (6-8 cm diameter)",
//         "Color: Deep red, fully ripened",
//         "Pesticide-free certification required",
//       ],
//     },
//     deliveryTerms: {
//       date: "",
//       location: "",
//       transportation: "Farmer",
//       packaging: "",
//     },
//     paymentTerms: {
//       totalValue: "",
//       method: "Online Transfer",
//       advancePayment: "100%",
//       balanceDue: "On Delivery",
//     },
//     termsConditions: [
//       {
//         Id: 1,
//         title: "Quality Inspection",
//         content:
//           "Buyer has the right to inspect crops upon delivery and may reject if they do not meet the agreed quality standards.",
//       },
//       {
//         Id: 2,
//         title: "Force Majeure",
//         content:
//           "Neither party shall be liable for failure to perform due to natural disasters, extreme weather, or other circumstances beyond reasonable control.",
//       },
//       {
//         Id: 3,
//         title: "Dispute Resolution",
//         content:
//           "All disputes shall first be resolved through negotiation, then mediation, and finally through arbitration.",
//       },
//       {
//         Id: 4,
//         title: "Termination",
//         content:
//           "This contract may be terminated by mutual agreement with 30 days written notice.",
//       },
//       {
//         Id: 5,
//         title: "Amendments",
//         content:
//           "Any changes to this contract must be in writing and signed by both parties.",
//       },
//       {
//         Id: 6,
//         title: "Insurance",
//         content:
//           "The farmer must maintain appropriate crop insurance throughout the growing season.",
//       },
//       {
//         Id: 7,
//         title: "Governing Law",
//         content:
//           "This contract shall be governed by the laws of [State/Country].",
//       },
//     ],
//     additionalNotes: "",
//   });

//   const formDataToSave = new FormData();

//   const fetchListingById = async () => {
//     try {
//       const response = await axios.get(
//         `http://localhost:2527/listings/get/${listingId}`,
//         {
//           withCredentials: true,
//         }
//       );
//       console.log("Listing details:", response.data);

//       const farmer = await fetchFarmerDetails(response.data.contactOfFarmer);

//       const farmerDetails = {
//         farmerName: farmer.username,
//         farmerAddress: farmer.address,
//         farmerContact: farmer.phoneNumber,
//       };

//       const user = await getCurrentUser();
//       console.log(user);
//       const buyerDetails = {
//         buyerName: user.username,
//         buyerAddress: user.address,
//         buyerContact: user.phoneNumber,
//       };

//       const cropDetails = {
//         type: response.data.productType,
//         variety: response.data.qualityGrade,
//         pricePerUnit: `${response.data.finalPrice} ${response.data.unitOfQuantity}`,
//       };

//       console.log(farmerDetails);
//       console.log(cropDetails);

//       setFormData((prev) => ({
//         ...prev,
//         farmerInfo: farmerDetails,
//         buyerInfo: buyerDetails,
//         cropDetails: { ...prev.cropDetails, ...cropDetails },
//       }));

//       try {
//         // Fetch the image file from your assets
//         const response = leafImg;
//         const blob = await response.blob();

//         // Convert blob to base64 string
//         const reader = new FileReader();
//         reader.onloadend = () => {
//           setFarmerSignatureImage(reader.result); // Set the farmer's signature image preview
//           setFarmerSignature(reader.result); // Set the hashed value (if needed)
//         };
//         reader.readAsDataURL(blob);
//       } catch (error) {
//         console.error("Failed to convert farmer signature to base64:", error);
//       }

//       return response.data;
//     } catch (err) {
//       console.error("Failed to fetch listing details:", err);
//     }
//   };

//   const fetchFarmerDetails = async (farmerContact) => {
//     try {
//       const response = await axios.get(
//         `http://localhost:2525/users/${farmerContact}`,
//         {
//           withCredentials: true,
//         }
//       );
//       console.log("Farmer details:", response.data);
//       return response.data;
//     } catch (err) {
//       console.error("Failed to fetch farmer details:", err);
//     }
//   };

//   const prevStep = () => {
//     if (currentStep > 1) {
//       setCurrentStep(currentStep - 1);
//     }
//   };

//   const handleSaveAndNext = () => {
//     saveFormData();
//     if (currentStep < 7) {
//       setCurrentStep(currentStep + 1);
//     }
//   };

//   const saveFormData = () => {
//     // Append all form data
//     formDataToSave.append("farmerInfo", JSON.stringify(formData.farmerInfo));
//     formDataToSave.append("buyerInfo", JSON.stringify(formData.buyerInfo));
//     formDataToSave.append("cropDetails", JSON.stringify(formData.cropDetails));
//     formDataToSave.append(
//       "deliveryTerms",
//       JSON.stringify(formData.deliveryTerms)
//     );
//     formDataToSave.append(
//       "paymentTerms",
//       JSON.stringify(formData.paymentTerms)
//     );
//     formDataToSave.append("additionalNotes", formData.additionalNotes);

//     // Append signatures if they exist
//     if (farmerSignature) {
//       formDataToSave.append("farmerSignature", farmerSignature);
//     }
//     if (buyerSignature) {
//       formDataToSave.append("buyerSignature", buyerSignature);
//     }

//     console.log("Saving form data:", Object.fromEntries(formDataToSave));
//   };

//   const calculateTotalValue = () => {
//     const quantity = parseFloat(formData.cropDetails.quantity) || 0;
//     const pricePerUnit =
//       parseFloat(formData.cropDetails.pricePerUnit.replace("$", "")) || 0;
//     const total = (quantity * pricePerUnit).toFixed(2);
//     setFormData((prev) => ({
//       ...prev,
//       paymentTerms: { ...prev.paymentTerms, totalValue: `$${total}` },
//     }));
//     return `$${total}`;
//   };

//   const handleSubmit = async () => {
//     setLoading(true);
//     setError(null);

//     const submitData = new FormData();

//     // Prepare agreement details for saving
//     const agreementDetails = {
//       farmerInfo: formData.farmerInfo,
//       buyerInfo: formData.buyerInfo,
//       cropDetails: formData.cropDetails,
//       deliveryTerms: formData.deliveryTerms,
//       paymentTerms: formData.paymentTerms,
//       termsConditions: formData.termsConditions,
//       additionalNotes: formData.additionalNotes,
//     };

//     submitData.append(
//       "agreementDetails",
//       new Blob([JSON.stringify(agreementDetails)], { type: "application/json" })
//     );

//     if (farmerSignature) {
//       submitData.append("farmerSignature", farmerSignature);
//     }
//     if (buyerSignature) {
//       submitData.append("buyerSignature", buyerSignature);
//     }

//     try {
//       // Step 1: Save the contract
//       const saveResponse = await axios.post(
//         "http://localhost:2526/agreements/save",
//         submitData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//           withCredentials: true,
//         }
//       );

//       console.log("Contract saved successfully:", saveResponse.data);

//       // Step 2: Fetch the saved agreement details (assuming saveResponse.data includes the ID)
//       const agreementId = saveResponse.data.id; // Adjust based on actual response structure
//       if (!agreementId) {
//         throw new Error("Agreement ID not returned from save response");
//       }

//       const fetchResponse = await axios.get(
//         `http://localhost:2526/agreements/get/${agreementId}`,
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//           withCredentials: true,
//         }
//       );

//       const fetchedAgreementDetails = fetchResponse.data;
//       console.log("Fetched agreement details:", fetchedAgreementDetails);

//       // Step 3: Generate the PDF using fetched details
//       const contractRequest = {
//         farmerInfo: fetchedAgreementDetails.farmerInfo,
//         buyerInfo: fetchedAgreementDetails.buyerInfo,
//         cropDetails: fetchedAgreementDetails.cropDetails,
//         deliveryTerms: fetchedAgreementDetails.deliveryTerms,
//         paymentTerms: fetchedAgreementDetails.paymentTerms,
//         termsConditions: fetchedAgreementDetails.termsConditions,
//         additionalNotes: fetchedAgreementDetails.additionalNotes,
//       };

//       const response = await fetch("http://localhost:2529/contracts/generate", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Accept: "application/pdf",
//         },
//         body: JSON.stringify(contractRequest),
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(
//           `Failed to generate PDF: ${response.status} - ${errorText}`
//         );
//       }

//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.download = `AgriConnect_Contract_${contractRequest.farmerInfo.farmerName.replace(
//         /\s+/g,
//         "_"
//       )}_${contractRequest.buyerInfo.buyerName.replace(/\s+/g, "_")}.pdf`;
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(url);
//       console.log("Contract PDF generated successfully");

//       alert("Contract submitted and PDF generated successfully!");
//       setContractGenerated(true);
//       // navigate("/my-orders");
//     } catch (err) {
//       const errorMessage = err.response?.data || err.message;
//       setError(`Failed to submit contract or generate PDF: ${errorMessage}`);
//       console.error("Submission error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleContractUpload = async () => {
//     if (!contractFile) {
//       setError("Please select a PDF file to upload");
//       return;
//     }
//     // if (!farmerAddress || !buyerAddress) {
//     //   setError("Farmer address and buyer address are required");
//     //   return;
//     // }
//     console.log("farmer");

//     const lis = await fetchListingById();
//     const far = await fetchFarmerDetails(lis.contactOfFarmer);
//     const buy = await fetchUser();

//     console.log(far, " ", buy);

//     const uploadData = new FormData();
//     uploadData.append("file", contractFile);
//     uploadData.append("farmerAddress", far.uniqueHexAddress);
//     uploadData.append("buyerAddress", buy.uniqueHexAddress);

//     try {
//       const response = await axios.post(
//         "http://localhost:2526/api/agreements/upload",
//         uploadData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//           withCredentials: true,
//         }
//       );
//       alert(
//         `Contract uploaded successfully!\nPDF Hash: ${response.data.pdfHash}\nTransaction Hash: ${response.data.txHash}`
//       );
//       navigate("/my-orders");
//     } catch (err) {
//       setError(err.response?.data || "Failed to upload contract");
//       console.error("Upload error:", err);
//     }
//   };

//   const renderPartyInformation = () => (
//     <div className="space-y-6 max-w-2xl mx-auto bg-white p-6">
//       {/* Header with logo and title */}
//       <div className="flex flex-col items-center gap-y-2 pb-3">
//         <div className="flex items-center gap-x-2">
//           <img src={leafImg} width={30} alt="AgriConnect logo" />
//           <h1 className="text-2xl font-bold text-snowy-mint-900">
//             AgriConnect
//           </h1>
//         </div>
//         <div className="bg-jewel-50 w-full text-center mb-2 font-poppins py-2 rounded-md text-snowy-mint-900 font-semibold">
//           CROP CONTRACT AGREEMENT
//         </div>
//       </div>

//       {/* Section title with improved styling */}
//       <div className="border-b pb-2 mb-4">
//         <h2 className="text-lg font-semibold text-jewel-700 flex items-center gap-x-2">
//           <span className="bg-jewel-100 h-6 w-6 flex items-center justify-center rounded-full text-sm">
//             1
//           </span>
//           Parties Information
//         </h2>
//       </div>

//       {/* Two-column layout for farmer and buyer information */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
//         {/* Farmer Information Column */}
//         <div className="space-y-4">
//           <h3 className="font-medium text-jewel-600 text-sm uppercase tracking-wider">
//             Farmer/Supplier Details
//           </h3>

//           <div>
//             <label className="block font-medium text-sm mb-1 text-gray-700">
//               Full Name
//             </label>
//             <input
//               type="text"
//               className="w-full p-2 border rounded-lg focus:ring focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none transition-all duration-200"
//               value={formData.farmerInfo.farmerName}
//               disabled
//             />
//           </div>

//           <div>
//             <label className="block font-medium mb-1 text-sm text-gray-700">
//               Address
//             </label>
//             <input
//               type="text"
//               className="w-full p-2 border rounded-lg focus:ring focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none transition-all duration-200"
//               value={formData.farmerInfo.farmerAddress}
//               disabled
//             />
//           </div>

//           <div>
//             <label className="block font-medium mb-1 text-sm text-gray-700">
//               Contact Number
//             </label>
//             <input
//               type="text"
//               className="w-full p-2 border rounded-lg focus:ring focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none transition-all duration-200"
//               value={formData.farmerInfo.farmerContact}
//               disabled={true}
//             />
//           </div>
//         </div>

//         {/* Buyer Information Column */}
//         <div className="space-y-4">
//           <h3 className="font-medium text-jewel-600 text-sm uppercase tracking-wider">
//             Buyer Details
//           </h3>

//           <div>
//             <label className="block font-medium mb-1 text-sm text-gray-700">
//               Full Name
//             </label>
//             <input
//               type="text"
//               className="w-full p-2 border rounded-lg focus:ring focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none transition-all duration-200"
//               value={formData.buyerInfo.buyerName}
//               onChange={(e) =>
//                 setFormData({
//                   ...formData,
//                   buyerInfo: {
//                     ...formData.buyerInfo,
//                     buyerName: e.target.value,
//                   },
//                 })
//               }
//               placeholder="Enter buyer's name"
//             />
//           </div>

//           <div>
//             <label className="block font-medium mb-1 text-sm text-gray-700">
//               Address
//             </label>
//             <input
//               type="text"
//               className="w-full p-2 border rounded-lg focus:ring focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none transition-all duration-200"
//               value={formData.buyerInfo.buyerAddress}
//               onChange={(e) =>
//                 setFormData({
//                   ...formData,
//                   buyerInfo: {
//                     ...formData.buyerInfo,
//                     buyerAddress: e.target.value,
//                   },
//                 })
//               }
//               placeholder="Enter buyer's address"
//             />
//           </div>

//           <div>
//             <label className="block font-medium mb-1 text-sm text-gray-700">
//               Contact Number
//             </label>
//             <input
//               type="text"
//               className="w-full p-2 border rounded-lg focus:ring focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none transition-all duration-200"
//               value={formData.buyerInfo.buyerContact}
//               onChange={(e) =>
//                 setFormData({
//                   ...formData,
//                   buyerInfo: {
//                     ...formData.buyerInfo,
//                     buyerContact: e.target.value,
//                   },
//                 })
//               }
//               placeholder="Enter buyer's contact number"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const renderCropDetails = () => (
//     <div className="space-y-6 max-w-2xl mx-auto bg-white p-6">
//       {/* Section title with improved styling */}
//       <div className="border-b pb-2 mb-4">
//         <h2 className="text-lg font-semibold text-jewel-700 flex items-center gap-x-2">
//           <span className="bg-jewel-100 h-6 w-6 flex items-center justify-center rounded-full text-sm">
//             2
//           </span>
//           Crop Details
//         </h2>
//       </div>

//       <div className="space-y-5">
//         {/* Crop Type Selector with Icon */}
//         <div>
//           <label className="block font-medium text-sm mb-1 text-gray-700">
//             Crop Type
//           </label>
//           <div className="relative">
//             <input
//               className="w-full p-2 pl-3 border rounded-lg focus:ring focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none appearance-none transition-all duration-200 bg-white"
//               value={formData.cropDetails.type}
//               disabled
//             />
//             <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-jewel-500">
//               <svg
//                 className="w-4 h-4"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M19 9l-7 7-7-7"
//                 />
//               </svg>
//             </div>
//           </div>
//         </div>

//         {/* Two-column layout for crop information */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="block font-medium text-sm mb-1 text-gray-700">
//               Variety/Grade
//             </label>
//             <input
//               type="text"
//               className="w-full p-2 border rounded-lg focus:ring focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none transition-all duration-200"
//               value={formData.cropDetails.variety}
//               disabled
//             />
//           </div>

//           <div>
//             <label className="block font-medium text-sm mb-1 text-gray-700">
//               Quantity
//             </label>
//             <div className="relative">
//               <input
//                 type="text"
//                 className="w-full p-2 border rounded-lg focus:ring focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none transition-all duration-200"
//                 value={formData.cropDetails.quantity}
//                 onChange={(e) =>
//                   setFormData({
//                     ...formData,
//                     cropDetails: {
//                       ...formData.cropDetails,
//                       quantity: e.target.value,
//                     },
//                   })
//                 }
//                 placeholder="e.g., 500 kg, 2 tons"
//                 onBlur={calculateTotalValue}
//               />
//             </div>
//           </div>
//         </div>

//         {/* Price with currency icon */}
//         <div>
//           <label className="block font-medium text-sm mb-1 text-gray-700">
//             Price per Unit
//           </label>
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <span className="text-gray-500">$</span>
//             </div>
//             <input
//               type="text"
//               className="w-full p-2 pl-8 border rounded-lg focus:ring focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none transition-all duration-200"
//               value={formData.cropDetails.pricePerUnit}
//               disabled
//             />
//           </div>
//         </div>

//         {/* Total Price Calculation (New Feature) */}
//         <div className="bg-jewel-50 p-3 rounded-lg">
//           <div className="flex justify-between items-center">
//             <span className="text-sm font-medium text-gray-700">
//               Total Value:
//             </span>
//             <span className="font-semibold text-jewel-700">
//               {formData.paymentTerms.totalValue || "$0.00"}
//             </span>
//           </div>
//         </div>

//         {/* Improved Quality Standards Section */}
//         <div>
//           <label className="block font-medium text-sm mb-1 text-gray-700">
//             Quality Standards & Specifications
//           </label>
//           <div className="border rounded-lg p-3 max-h-36 overflow-y-auto bg-gray-50">
//             {formData.cropDetails.qualityStandards.length > 0 ? (
//               formData.cropDetails?.qualityStandards.map((standard, index) => (
//                 <div key={index} className="mb-2 flex items-start">
//                   <div className="h-5 w-5 text-jewel-500 mr-2">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       viewBox="0 0 20 20"
//                       fill="currentColor"
//                     >
//                       <path
//                         fillRule="evenodd"
//                         d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                   </div>
//                   <span className="text-gray-700">{standard}</span>
//                 </div>
//               ))
//             ) : (
//               <div className="text-gray-500 text-sm italic">
//                 No quality standards specified
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const renderDeliveryTerms = () => (
//     <div className="space-y-6 max-w-2xl mx-auto bg-white p-6 ">
//       {/* Section title with improved styling */}
//       <div className="border-b pb-2 mb-4">
//         <h2 className="text-lg font-semibold text-jewel-700 flex items-center gap-x-2">
//           <span className="bg-jewel-100 h-6 w-6 flex items-center justify-center rounded-full text-sm">
//             3
//           </span>
//           Delivery Terms
//         </h2>
//       </div>

//       <div className="space-y-5">
//         {/* Date and location in a two-column layout */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="block font-medium text-sm mb-1 text-gray-700">
//               Delivery Date
//             </label>
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <svg
//                   className="h-4 w-4 text-jewel-500"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
//                   />
//                 </svg>
//               </div>
//               <input
//                 type="date"
//                 className="w-full p-2 pl-10 border rounded-lg focus:ring focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none transition-all duration-200"
//                 value="2025-04-15"
//                 onChange={(e) =>
//                   setFormData({
//                     ...formData,
//                     deliveryTerms: {
//                       ...formData.deliveryTerms,
//                       date: e.target.value,
//                     },
//                   })
//                 }
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block font-medium text-sm mb-1 text-gray-700">
//               Delivery Location
//             </label>
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <svg
//                   className="h-4 w-4 text-jewel-500"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
//                   />
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
//                   />
//                 </svg>
//               </div>
//               <input
//                 type="text"
//                 className="w-full p-2 pl-10 border rounded-lg focus:ring focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none transition-all duration-200"
//                 value={formData.deliveryTerms.location}
//                 onChange={(e) =>
//                   setFormData({
//                     ...formData,
//                     deliveryTerms: {
//                       ...formData.deliveryTerms,
//                       location: e.target.value,
//                     },
//                   })
//                 }
//                 placeholder="Enter delivery address"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Transportation responsibility with radio buttons for better UX */}
//         <div>
//           <label className="block font-medium text-sm mb-2 text-gray-700">
//             Transportation Responsibility
//           </label>
//           <div className="grid grid-cols-3 gap-2">
//             {["Farmer", "Buyer", "Shared"].map((option) => (
//               <div
//                 key={option}
//                 className={`
//                 border rounded-lg p-3 text-center cursor-pointer transition-all duration-200
//                 ${
//                   formData.deliveryTerms.transportation === option
//                     ? "bg-jewel-50 border-jewel-300 text-jewel-700"
//                     : "bg-white hover:bg-gray-50"
//                 }
//               `}
//                 onClick={() => {
//                   setFormData({
//                     ...formData,
//                     deliveryTerms: {
//                       ...formData.deliveryTerms,
//                       transportation: option,
//                     },
//                   });
//                 }}
//               >
//                 <div className="flex items-center justify-center gap-2">
//                   <div
//                     className={`h-4 w-4 rounded-full border ${
//                       formData.deliveryTerms.transportation === option
//                         ? "border-jewel-500 bg-jewel-500"
//                         : "border-gray-400"
//                     }`}
//                   >
//                     {formData.deliveryTerms.transportation === option && (
//                       <div className="h-2 w-2 rounded-full bg-white m-auto mt-0.5"></div>
//                     )}
//                   </div>
//                   <span>{option}</span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Packaging requirements with textarea for more space */}
//         <div>
//           <label className="block font-medium text-sm mb-1 text-gray-700">
//             Packaging Requirements
//           </label>
//           <textarea
//             className="w-full p-3 border rounded-lg focus:ring focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none transition-all duration-200 min-h-24"
//             value={formData.deliveryTerms.packaging}
//             onChange={(e) =>
//               setFormData({
//                 ...formData,
//                 deliveryTerms: {
//                   ...formData.deliveryTerms,
//                   packaging: e.target.value,
//                 },
//               })
//             }
//             placeholder="Specify packaging type, materials, weight limits, etc."
//           />
//         </div>

//         {/* Additional delivery notes section */}
//         <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//           <div className="flex items-start gap-3">
//             <div className="text-jewel-500 mt-0.5">
//               <svg
//                 className="h-5 w-5"
//                 fill="currentColor"
//                 viewBox="0 0 20 20"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//             </div>
//             <div>
//               <h3 className="text-sm font-medium text-gray-800">
//                 Delivery Instructions
//               </h3>
//               <p className="text-xs text-gray-600 mt-1">
//                 All deliveries must be scheduled at least 24 hours in advance.
//                 Upon arrival, please contact the receiving department at the
//                 provided number.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const renderPaymentTerms = () => {
//     return (
//       <div className="bg-white p-6">
//         <div className="border-b border-gray-200 pb-4 mb-6">
//           <h2 className="text-xl font-semibold text-jewel-700 flex items-center">
//             <span className="bg-jewel-100 text-jewel-700 w-8 h-8 rounded-full flex items-center justify-center mr-3">
//               4
//             </span>
//             Payment Terms
//           </h2>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label className="block font-medium text-gray-700 mb-2">
//               Total Contract Value
//             </label>
//             <div className="relative">
//               <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
//                 $
//               </span>
//               <input
//                 type="text"
//                 className={`w-full pl-8 p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none transition-colors text-gray-700`}
//                 value={formData.paymentTerms.totalValue}
//                 disabled
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block font-medium text-gray-700 mb-2">
//               Payment Method
//             </label>
//             <input
//               className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none transition-colors
//                 bg-gray-100 text-gray-700`}
//               value={formData.paymentTerms.method}
//               disabled
//             />
//           </div>

//           <div>
//             <label className="block font-medium text-gray-700 mb-2">
//               Advance Payment (%)
//             </label>
//             <div className="relative">
//               <input
//                 type="text"
//                 className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none transition-colors bg-gray-100 text-gray-700`}
//                 value={formData.paymentTerms.advancePayment}
//                 disabled
//               />
//               <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">
//                 %
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const renderTermsAndConditions = () => (
//     <div className="space-y-8">
//       {/* Terms & Conditions Section */}
//       <div>
//         <div className="flex items-center mb-4">
//           <div className="bg-jewel-100 text-jewel-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 font-bold">
//             5
//           </div>
//           <h2 className="text-xl font-semibold text-gray-800">
//             Terms & Conditions
//           </h2>
//         </div>

//         <div className="bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
//           <div className="p-4 bg-gray-100 border-b border-gray-200 flex justify-between items-center">
//             <h3 className="font-medium text-gray-700">Contract Terms</h3>
//             <span className="text-xs bg-jewel-100 text-jewel-600 px-2 py-1 rounded-full">
//               Required
//             </span>
//           </div>

//           <div className="max-h-72 overflow-y-auto p-4">
//             {formData.termsConditions.map((term, index) => (
//               <div
//                 key={term.id}
//                 className={`mb-4 pb-4 ${
//                   index < formData.termsConditions.length - 1
//                     ? "border-b border-gray-100"
//                     : ""
//                 }`}
//               >
//                 <div className="font-semibold text-gray-800 mb-1 flex items-start">
//                   <span className="bg-jewel-50 text-jewel-600 rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2 flex-shrink-0">
//                     {term.id}
//                   </span>
//                   <span>{term.title}</span>
//                 </div>
//                 <div className="text-gray-600 pl-8">{term.content}</div>
//               </div>
//             ))}
//           </div>

//           <div className="p-3 bg-jewel-50 border-t border-gray-200 text-xs text-gray-500 italic">
//             By proceeding, you acknowledge that you have read and agree to these
//             terms.
//           </div>
//         </div>
//       </div>

//       {/* Additional Notes Section */}
//       <div>
//         <div className="flex items-center mb-4">
//           <div className="bg-jewel-100 text-jewel-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 font-bold">
//             6
//           </div>
//           <h2 className="text-xl font-semibold text-gray-800">
//             Additional Notes
//           </h2>
//         </div>

//         <div className="bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
//           <div className="p-4 bg-gray-100 border-b border-gray-200 flex justify-between items-center">
//             <h3 className="font-medium text-gray-700">
//               Special Instructions or Comments
//             </h3>
//             <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
//               Optional
//             </span>
//           </div>

//           <div className="p-4">
//             <textarea
//               className="w-full p-3 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none resize-none transition-all"
//               value={formData.additionalNotes}
//               onChange={(e) =>
//                 setFormData({ ...formData, additionalNotes: e.target.value })
//               }
//               placeholder={
//                 "Add any special instructions, requirements or information that might be relevant..."
//               }
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const renderSignatures = () => {
//     const currentDate = new Date().toLocaleDateString();
//     const userRole = "buyer";

//     const handleImageUpload = (event, setSignature) => {
//       const file = event.target.files[0];
//       if (file) {
//         const reader = new FileReader();
//         reader.onloadend = () => {
//           const signatureData = reader.result;

//           // Update the signature state for displaying the image
//           if (setSignature === setFarmerSignature) {
//             setFarmerSignatureImage(signatureData); // Set the farmer's signature image preview
//           }
//           setSignature(signatureData); // Set the hashed value
//         };
//         reader.readAsDataURL(file);
//       }
//     };

//     // Function to check if signature can be edited based on user role
//     const canEditSignature = (role) => {
//       return userRole === role;
//     };

//     // Function to render signature box with appropriate states
//     const renderSignatureBox = (role, signature, setSignature) => {
//       const isEditable = canEditSignature(role);
//       const roleLabel = role === "farmer" ? "farmer" : "buyer";
//       const signatureImage =
//         role === "farmer" ? farmerSignatureImage : signature;

//       return (
//         <div
//           className={`space-y-4 p-6 rounded-lg border ${
//             isEditable ? "bg-white" : "bg-gray-50"
//           } 
//     ${isEditable ? "border-jewel-200" : "border-gray-200"} 
//     transition-all hover:shadow-md`}
//         >
//           <div className="text-center">
//             <div
//               className={`font-semibold text-lg ${
//                 isEditable ? "text-jewel-700" : "text-gray-700"
//               } mb-1`}
//             >
//               {roleLabel} Signature
//             </div>
//             <div className="text-sm text-gray-500">Date: {currentDate}</div>
//           </div>

//           {signatureImage ? (
//             <div className="relative group">
//               <img
//                 src={signatureImage}
//                 alt={`${roleLabel} Signature`}
//                 className="w-full h-24 object-contain mx-auto border p-2 bg-white rounded-md"
//               />
//               {isEditable && (
//                 <button
//                   onClick={() => {
//                     setSignature(null);
//                     if (role === "farmer") {
//                       setFarmerSignatureImage(null);
//                     }
//                   }}
//                   className="absolute top-2 right-2 bg-red-100 text-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
//                   aria-label="Remove signature"
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-4 w-4"
//                     viewBox="0 0 20 20"
//                     fill="currentColor"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                 </button>
//               )}
//             </div>
//           ) : (
//             <div
//               className={`w-full h-24 mx-auto border border-dashed ${
//                 isEditable ? "border-jewel-300" : "border-gray-300"
//               } 
//         bg-white flex flex-col items-center justify-center rounded-md ${
//           isEditable ? "text-jewel-400" : "text-gray-400"
//         }`}
//             >
//               {isEditable ? (
//                 <>
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-8 w-8 text-jewel-300 mb-2"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={1.5}
//                       d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
//                     />
//                   </svg>
//                   <span className="text-sm">Your Signature Required</span>
//                 </>
//               ) : (
//                 <>
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-8 w-8 text-gray-300 mb-2"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={1.5}
//                       d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
//                     />
//                   </svg>
//                   <span className="text-sm">
//                     Awaiting {roleLabel} Signature
//                   </span>
//                 </>
//               )}
//             </div>
//           )}

//           {isEditable && !signatureImage && (
//             <div className="flex justify-center mt-4">
//               <label className="cursor-pointer flex items-center justify-center px-4 py-2 bg-jewel-600 text-white rounded-md hover:bg-jewel-700 transition-colors text-sm">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-4 w-4 mr-2"
//                   viewBox="0 0 20 20"
//                   fill="currentColor"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//                 Upload Signature
//                 <input
//                   type="file"
//                   accept="image/*"
//                   className="hidden"
//                   onChange={(e) => handleImageUpload(e, setSignature)}
//                 />
//               </label>
//             </div>
//           )}

//           {isEditable && signatureImage && (
//             <div className="text-center text-xs text-jewel-600 font-medium">
//               Your signature has been added
//             </div>
//           )}
//         </div>
//       );
//     };

//     return (
//       <div className="space-y-8 p-8">
//         <div className="text-center mb-8">
//           <h3 className="text-xl font-semibold text-gray-800 mb-2">
//             Contract Signatures
//           </h3>
//           <p className="text-gray-500 max-w-md mx-auto">
//             Both parties must sign to finalize this contract. You can only sign
//             in your designated area.
//           </p>
//         </div>

//         <div className="grid md:grid-cols-2 gap-8">
//           {renderSignatureBox("farmer", farmerSignature, setFarmerSignature)}
//           {renderSignatureBox("buyer", buyerSignature, setBuyerSignature)}
//         </div>

//         <div className="mt-8 p-4 bg-gray-50 border border-gray-100 rounded-lg text-center text-sm text-gray-600">
//           <div className="flex items-center justify-center mb-2">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-5 w-5 text-jewel-500 mr-2"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//               />
//             </svg>
//             <span className="font-medium">Legal Agreement</span>
//           </div>
//           By uploading your signature, you confirm that you have read and agree
//           to all terms and conditions outlined in this contract. This digital
//           signature carries the same legal weight as a physical signature.
//         </div>
//       </div>
//     );
//   };

//   const renderStepContent = () => {
//     switch (currentStep) {
//       case 1:
//         return renderPartyInformation();
//       case 2:
//         return renderCropDetails();
//       case 3:
//         return renderDeliveryTerms();
//       case 4:
//         return renderPaymentTerms();
//       case 5:
//         return renderTermsAndConditions();
//       case 6:
//         return renderSignatures();
//       case 7:
//         return UploadContract();
//       default:
//         return null;
//     }
//   };

//   const UploadContract = () => {
//     return (
//       <div>
//         <div className="flex flex-col space-y-2">
//           <input
//             type="file"
//             accept="application/pdf"
//             onChange={(e) => setContractFile(e.target.files[0])}
//             className="w-full p-2 border rounded-lg"
//           />
//           <button
//             onClick={handleContractUpload}
//             disabled={!contractFile}
//             className={`px-4 py-2 rounded text-white ${
//               !contractFile
//                 ? "bg-gray-400 cursor-not-allowed"
//                 : "bg-jewel-600 hover:bg-jewel-700"
//             }`}
//           >
//             Upload Contract
//           </button>
//         </div>
//       </div>
//     );
//   };

//   const renderNavigationButtons = () => {
//     return (
//       <div className="flex justify-between pt-6">
//         <div>
//           {currentStep > 1 && (
//             <button
//               onClick={prevStep}
//               className="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300"
//             >
//               Back
//             </button>
//           )}
//         </div>

//         <div className="flex space-x-3">
//           {currentStep === 1 && (
//             <button
//               onClick={handleSaveAndNext}
//               className="bg-jewel-600 text-white px-4 py-2 rounded hover:bg-jewel-700"
//             >
//               Save and Next
//             </button>
//           )}

//           {currentStep > 1 && currentStep < 6 && (
//             <button
//               onClick={handleSaveAndNext}
//               className="bg-jewel-600 text-white px-4 py-2 rounded hover:bg-jewel-700"
//             >
//               Save and Next
//             </button>
//           )}

//           {currentStep === 6 && (
//             <div className="flex flex-col space-y-4">
//               <button
//                 onClick={handleSubmit}
//                 disabled={loading || !farmerSignature || !buyerSignature}
//                 className={`bg-jewel-600 text-white px-4 py-2 rounded hover:bg-jewel-700 ${
//                   loading || !farmerSignature || !buyerSignature
//                     ? "bg-gray-400 cursor-not-allowed"
//                     : "bg-green-600 hover:bg-green-700"
//                 }`}
//               >
//                 {loading ? "Submitting..." : "Generate Contract"}
//               </button>
//               <button
//                 onClick={handleSaveAndNext}
//                 className="bg-jewel-600 text-white px-4 py-2 rounded hover:bg-jewel-700"
//               >
//                 Save and Next
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
//         {error && (
//           <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
//             {error}
//           </div>
//         )}

//         {renderStepContent()}
//         {renderNavigationButtons()}
//       </div>
//     </div>
//   );
// };

