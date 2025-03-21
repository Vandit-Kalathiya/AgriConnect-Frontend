// import React, { useState } from "react";
// import { Input } from "./ui/Input";
// import { Label } from "./ui/Label";
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "./ui/Select";
// import { MapPinIcon, MapIcon, Globe, Search } from "lucide-react";
// import { Card, CardContent } from "./ui/Card";
// import { Separator } from "./ui/Separator";
// import { Button } from "./ui/Button";

// Comprehensive list of Indian states and districts


import React, { useState, useEffect } from "react";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/Select";
import { MapPinIcon, MapIcon, Globe, Search, CheckCircle } from "lucide-react";
import { Card, CardContent } from "./ui/Card";
import { Separator } from "./ui/Separator";
import { Button } from "./ui/Button";
import { motion } from "framer-motion"; // Assuming framer-motion is available

const indianStates = [
  {
    name: "Andhra Pradesh",
    districts: [
      "Anantapur",
      "Chittoor",
      "East Godavari",
      "Guntur",
      "Kadapa",
      "Krishna",
      "Kurnool",
      "Nellore",
      "Prakasam",
      "Srikakulam",
      "Visakhapatnam",
      "Vizianagaram",
      "West Godavari",
    ],
  },
  {
    name: "Arunachal Pradesh",
    districts: [
      "Anjaw",
      "Changlang",
      "Dibang Valley",
      "East Kameng",
      "East Siang",
      "Kamle",
      "Kra Daadi",
      "Kurung Kumey",
      "Lepa Rada",
      "Lohit",
      "Longding",
      "Lower Dibang Valley",
      "Lower Siang",
      "Lower Subansiri",
      "Namsai",
      "Pakke Kessang",
      "Papum Pare",
      "Shi Yomi",
      "Siang",
      "Tawang",
      "Tirap",
      "Upper Siang",
      "Upper Subansiri",
      "West Kameng",
      "West Siang",
    ],
  },
  {
    name: "Assam",
    districts: [
      "Baksa",
      "Barpeta",
      "Biswanath",
      "Bongaigaon",
      "Cachar",
      "Charaideo",
      "Chirang",
      "Darrang",
      "Dhemaji",
      "Dhubri",
      "Dibrugarh",
      "Dima Hasao",
      "Goalpara",
      "Golaghat",
      "Hailakandi",
      "Hojai",
      "Jorhat",
      "Kamrup",
      "Kamrup Metropolitan",
      "Karbi Anglong",
      "Karimganj",
      "Kokrajhar",
      "Lakhimpur",
      "Majuli",
      "Morigaon",
      "Nagaon",
      "Nalbari",
      "Sivasagar",
      "Sonitpur",
      "South Salmara-Mankachar",
      "Tinsukia",
      "Udalguri",
      "West Karbi Anglong",
    ],
  },
  {
    name: "Bihar",
    districts: [
      "Araria",
      "Arwal",
      "Aurangabad",
      "Banka",
      "Begusarai",
      "Bhagalpur",
      "Bhojpur",
      "Buxar",
      "Darbhanga",
      "East Champaran",
      "Gaya",
      "Gopalganj",
      "Jamui",
      "Jehanabad",
      "Kaimur",
      "Katihar",
      "Khagaria",
      "Kishanganj",
      "Lakhisarai",
      "Madhepura",
      "Madhubani",
      "Munger",
      "Muzaffarpur",
      "Nalanda",
      "Nawada",
      "Patna",
      "Purnia",
      "Rohtas",
      "Saharsa",
      "Samastipur",
      "Saran",
      "Sheikhpura",
      "Sheohar",
      "Sitamarhi",
      "Siwan",
      "Supaul",
      "Vaishali",
      "West Champaran",
    ],
  },
  {
    name: "Chhattisgarh",
    districts: [
      "Balod",
      "Baloda Bazar",
      "Balrampur",
      "Bastar",
      "Bemetara",
      "Bijapur",
      "Bilaspur",
      "Dantewada",
      "Dhamtari",
      "Durg",
      "Gariaband",
      "Janjgir-Champa",
      "Jashpur",
      "Kabirdham",
      "Kanker",
      "Kondagaon",
      "Korba",
      "Koriya",
      "Mahasamund",
      "Mungeli",
      "Narayanpur",
      "Raigarh",
      "Raipur",
      "Rajnandgaon",
      "Sukma",
      "Surajpur",
      "Surguja",
    ],
  },
  {
    name: "Goa",
    districts: ["North Goa", "South Goa"],
  },
  {
    name: "Gujarat",
    districts: [
      "Ahmedabad",
      "Amreli",
      "Anand",
      "Aravalli",
      "Banaskantha",
      "Bharuch",
      "Bhavnagar",
      "Botad",
      "Chhota Udaipur",
      "Dahod",
      "Dang",
      "Devbhoomi Dwarka",
      "Gandhinagar",
      "Gir Somnath",
      "Jamnagar",
      "Junagadh",
      "Kheda",
      "Kutch",
      "Mahisagar",
      "Mehsana",
      "Morbi",
      "Narmada",
      "Navsari",
      "Panchmahal",
      "Patan",
      "Porbandar",
      "Rajkot",
      "Sabarkantha",
      "Surat",
      "Surendranagar",
      "Tapi",
      "Vadodara",
      "Valsad",
    ],
  },
  {
    name: "Haryana",
    districts: [
      "Ambala",
      "Bhiwani",
      "Charkhi Dadri",
      "Faridabad",
      "Fatehabad",
      "Gurugram",
      "Hisar",
      "Jhajjar",
      "Jind",
      "Kaithal",
      "Karnal",
      "Kurukshetra",
      "Mahendragarh",
      "Nuh",
      "Palwal",
      "Panchkula",
      "Panipat",
      "Rewari",
      "Rohtak",
      "Sirsa",
      "Sonipat",
      "Yamunanagar",
    ],
  },
  {
    name: "Himachal Pradesh",
    districts: [
      "Bilaspur",
      "Chamba",
      "Hamirpur",
      "Kangra",
      "Kinnaur",
      "Kullu",
      "Lahaul and Spiti",
      "Mandi",
      "Shimla",
      "Sirmaur",
      "Solan",
      "Una",
    ],
  },
  {
    name: "Jharkhand",
    districts: [
      "Bokaro",
      "Chatra",
      "Deoghar",
      "Dhanbad",
      "Dumka",
      "East Singhbhum",
      "Garhwa",
      "Giridih",
      "Godda",
      "Gumla",
      "Hazaribagh",
      "Jamtara",
      "Khunti",
      "Koderma",
      "Latehar",
      "Lohardaga",
      "Pakur",
      "Palamu",
      "Ramgarh",
      "Ranchi",
      "Sahibganj",
      "Seraikela-Kharsawan",
      "Simdega",
      "West Singhbhum",
    ],
  },
  {
    name: "Karnataka",
    districts: [
      "Bagalkot",
      "Ballari",
      "Belagavi",
      "Bengaluru Rural",
      "Bengaluru Urban",
      "Bidar",
      "Chamarajanagar",
      "Chikballapur",
      "Chikkamagaluru",
      "Chitradurga",
      "Dakshina Kannada",
      "Davangere",
      "Dharwad",
      "Gadag",
      "Hassan",
      "Haveri",
      "Kalaburagi",
      "Kodagu",
      "Kolar",
      "Koppal",
      "Mandya",
      "Mysuru",
      "Raichur",
      "Ramanagara",
      "Shivamogga",
      "Tumakuru",
      "Udupi",
      "Uttara Kannada",
      "Vijayapura",
      "Yadgir",
    ],
  },
  {
    name: "Kerala",
    districts: [
      "Alappuzha",
      "Ernakulam",
      "Idukki",
      "Kannur",
      "Kasaragod",
      "Kollam",
      "Kottayam",
      "Kozhikode",
      "Malappuram",
      "Palakkad",
      "Pathanamthitta",
      "Thiruvananthapuram",
      "Thrissur",
      "Wayanad",
    ],
  },
  {
    name: "Madhya Pradesh",
    districts: [
      "Agar Malwa",
      "Alirajpur",
      "Anuppur",
      "Ashoknagar",
      "Balaghat",
      "Barwani",
      "Betul",
      "Bhind",
      "Bhopal",
      "Burhanpur",
      "Chhatarpur",
      "Chhindwara",
      "Damoh",
      "Datia",
      "Dewas",
      "Dhar",
      "Dindori",
      "Guna",
      "Gwalior",
      "Harda",
      "Hoshangabad",
      "Indore",
      "Jabalpur",
      "Jhabua",
      "Katni",
      "Khandwa",
      "Khargone",
      "Mandla",
      "Mandsaur",
      "Morena",
      "Narsinghpur",
      "Neemuch",
      "Panna",
      "Raisen",
      "Rajgarh",
      "Ratlam",
      "Rewa",
      "Sagar",
      "Satna",
      "Sehore",
      "Seoni",
      "Shahdol",
      "Shajapur",
      "Sheopur",
      "Shivpuri",
      "Sidhi",
      "Singrauli",
      "Tikamgarh",
      "Ujjain",
      "Umaria",
      "Vidisha",
    ],
  },
  {
    name: "Maharashtra",
    districts: [
      "Ahmednagar",
      "Akola",
      "Amravati",
      "Aurangabad",
      "Beed",
      "Bhandara",
      "Buldhana",
      "Chandrapur",
      "Dhule",
      "Gadchiroli",
      "Gondia",
      "Hingoli",
      "Jalgaon",
      "Jalna",
      "Kolhapur",
      "Latur",
      "Mumbai City",
      "Mumbai Suburban",
      "Nagpur",
      "Nanded",
      "Nandurbar",
      "Nashik",
      "Osmanabad",
      "Palghar",
      "Parbhani",
      "Pune",
      "Raigad",
      "Ratnagiri",
      "Sangli",
      "Satara",
      "Sindhudurg",
      "Solapur",
      "Thane",
      "Wardha",
      "Washim",
      "Yavatmal",
    ],
  },
  {
    name: "Manipur",
    districts: [
      "Bishnupur",
      "Chandel",
      "Churachandpur",
      "Imphal East",
      "Imphal West",
      "Jiribam",
      "Kakching",
      "Kamjong",
      "Kangpokpi",
      "Noney",
      "Pherzawl",
      "Senapati",
      "Tamenglong",
      "Tengnoupal",
      "Thoubal",
      "Ukhrul",
    ],
  },
  {
    name: "Meghalaya",
    districts: [
      "East Garo Hills",
      "East Jaintia Hills",
      "East Khasi Hills",
      "North Garo Hills",
      "Ri Bhoi",
      "South Garo Hills",
      "South West Garo Hills",
      "South West Khasi Hills",
      "West Garo Hills",
      "West Jaintia Hills",
      "West Khasi Hills",
    ],
  },
  {
    name: "Mizoram",
    districts: [
      "Aizawl",
      "Champhai",
      "Kolasib",
      "Lawngtlai",
      "Lunglei",
      "Mamit",
      "Saiha",
      "Serchhip",
    ],
  },
  {
    name: "Nagaland",
    districts: [
      "Dimapur",
      "Kiphire",
      "Kohima",
      "Longleng",
      "Mokokchung",
      "Mon",
      "Peren",
      "Phek",
      "Tuensang",
      "Wokha",
      "Zunheboto",
    ],
  },
  {
    name: "Odisha",
    districts: [
      "Angul",
      "Balangir",
      "Balasore",
      "Bargarh",
      "Bhadrak",
      "Boudh",
      "Cuttack",
      "Deogarh",
      "Dhenkanal",
      "Gajapati",
      "Ganjam",
      "Jagatsinghpur",
      "Jajpur",
      "Jharsuguda",
      "Kalahandi",
      "Kandhamal",
      "Kendrapara",
      "Kendujhar",
      "Khordha",
      "Koraput",
      "Malkangiri",
      "Mayurbhanj",
      "Nabarangpur",
      "Nayagarh",
      "Nuapada",
      "Puri",
      "Rayagada",
      "Sambalpur",
      "Subarnapur",
      "Sundargarh",
    ],
  },
  {
    name: "Punjab",
    districts: [
      "Amritsar",
      "Barnala",
      "Bathinda",
      "Faridkot",
      "Fatehgarh Sahib",
      "Fazilka",
      "Ferozepur",
      "Gurdaspur",
      "Hoshiarpur",
      "Jalandhar",
      "Kapurthala",
      "Ludhiana",
      "Mansa",
      "Moga",
      "Muktsar",
      "Nawanshahr",
      "Pathankot",
      "Patiala",
      "Rupnagar",
      "Sangrur",
      "SAS Nagar",
      "Tarn Taran",
    ],
  },
  {
    name: "Rajasthan",
    districts: [
      "Ajmer",
      "Alwar",
      "Banswara",
      "Baran",
      "Barmer",
      "Bharatpur",
      "Bhilwara",
      "Bikaner",
      "Bundi",
      "Chittorgarh",
      "Churu",
      "Dausa",
      "Dholpur",
      "Dungarpur",
      "Hanumangarh",
      "Jaipur",
      "Jaisalmer",
      "Jalore",
      "Jhalawar",
      "Jhunjhunu",
      "Jodhpur",
      "Karauli",
      "Kota",
      "Nagaur",
      "Pali",
      "Pratapgarh",
      "Rajsamand",
      "Sawai Madhopur",
      "Sikar",
      "Sirohi",
      "Sri Ganganagar",
      "Tonk",
      "Udaipur",
    ],
  },
  {
    name: "Sikkim",
    districts: ["East Sikkim", "North Sikkim", "South Sikkim", "West Sikkim"],
  },
  {
    name: "Tamil Nadu",
    districts: [
      "Ariyalur",
      "Chengalpattu",
      "Chennai",
      "Coimbatore",
      "Cuddalore",
      "Dharmapuri",
      "Dindigul",
      "Erode",
      "Kallakurichi",
      "Kanchipuram",
      "Kanyakumari",
      "Karur",
      "Krishnagiri",
      "Madurai",
      "Mayiladuthurai",
      "Nagapattinam",
      "Namakkal",
      "Nilgiris",
      "Perambalur",
      "Pudukkottai",
      "Ramanathapuram",
      "Ranipet",
      "Salem",
      "Sivaganga",
      "Tenkasi",
      "Thanjavur",
      "Theni",
      "Thoothukudi",
      "Tiruchirappalli",
      "Tirunelveli",
      "Tirupathur",
      "Tiruppur",
      "Tiruvallur",
      "Tiruvannamalai",
      "Tiruvarur",
      "Vellore",
      "Viluppuram",
      "Virudhunagar",
    ],
  },
  {
    name: "Telangana",
    districts: [
      "Adilabad",
      "Bhadradri Kothagudem",
      "Hyderabad",
      "Jagtial",
      "Jangaon",
      "Jayashankar Bhupalpally",
      "Jogulamba Gadwal",
      "Kamareddy",
      "Karimnagar",
      "Khammam",
      "Komaram Bheem Asifabad",
      "Mahabubabad",
      "Mahabubnagar",
      "Mancherial",
      "Medak",
      "Medchal–Malkajgiri",
      "Mulugu",
      "Nagarkurnool",
      "Nalgonda",
      "Narayanpet",
      "Nirmal",
      "Nizamabad",
      "Peddapalli",
      "Rajanna Sircilla",
      "Rangareddy",
      "Sangareddy",
      "Siddipet",
      "Suryapet",
      "Vikarabad",
      "Wanaparthy",
      "Warangal Rural",
      "Warangal Urban",
      "Yadadri Bhuvanagiri",
    ],
  },
  {
    name: "Tripura",
    districts: [
      "Dhalai",
      "Gomati",
      "Khowai",
      "North Tripura",
      "Sepahijala",
      "South Tripura",
      "Unakoti",
      "West Tripura",
    ],
  },
  {
    name: "Uttar Pradesh",
    districts: [
      "Agra",
      "Aligarh",
      "Allahabad",
      "Ambedkar Nagar",
      "Amethi",
      "Amroha",
      "Auraiya",
      "Azamgarh",
      "Baghpat",
      "Bahraich",
      "Ballia",
      "Balrampur",
      "Banda",
      "Barabanki",
      "Bareilly",
      "Basti",
      "Bhadohi",
      "Bijnor",
      "Budaun",
      "Bulandshahr",
      "Chandauli",
      "Chitrakoot",
      "Deoria",
      "Etah",
      "Etawah",
      "Faizabad",
      "Farrukhabad",
      "Fatehpur",
      "Firozabad",
      "Gautam Buddha Nagar",
      "Ghaziabad",
      "Ghazipur",
      "Gonda",
      "Gorakhpur",
      "Hamirpur",
      "Hapur",
      "Hardoi",
      "Hathras",
      "Jalaun",
      "Jaunpur",
      "Jhansi",
      "Kannauj",
      "Kanpur Dehat",
      "Kanpur Nagar",
      "Kasganj",
      "Kaushambi",
      "Kheri",
      "Kushinagar",
      "Lalitpur",
      "Lucknow",
      "Maharajganj",
      "Mahoba",
      "Mainpuri",
      "Mathura",
      "Mau",
      "Meerut",
      "Mirzapur",
      "Moradabad",
      "Muzaffarnagar",
      "Pilibhit",
      "Pratapgarh",
      "Raebareli",
      "Rampur",
      "Saharanpur",
      "Sambhal",
      "Sant Kabir Nagar",
      "Shahjahanpur",
      "Shamli",
      "Shravasti",
      "Siddharthnagar",
      "Sitapur",
      "Sonbhadra",
      "Sultanpur",
      "Unnao",
      "Varanasi",
    ],
  },
  {
    name: "Uttarakhand",
    districts: [
      "Almora",
      "Bageshwar",
      "Chamoli",
      "Champawat",
      "Dehradun",
      "Haridwar",
      "Nainital",
      "Pauri Garhwal",
      "Pithoragarh",
      "Rudraprayag",
      "Tehri Garhwal",
      "Udham Singh Nagar",
      "Uttarkashi",
    ],
  },
  {
    name: "West Bengal",
    districts: [
      "Alipurduar",
      "Bankura",
      "Birbhum",
      "Cooch Behar",
      "Dakshin Dinajpur",
      "Darjeeling",
      "Hooghly",
      "Howrah",
      "Jalpaiguri",
      "Jhargram",
      "Kalimpong",
      "Kolkata",
      "Malda",
      "Murshidabad",
      "Nadia",
      "North 24 Parganas",
      "Paschim Bardhaman",
      "Paschim Medinipur",
      "Purba Bardhaman",
      "Purba Medinipur",
      "Purulia",
      "South 24 Parganas",
      "Uttar Dinajpur",
    ],
  },
];

const LocationSelector = ({ onLocationSelect }) => {
  const [searchMode, setSearchMode] = useState("dropdown");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);

  const availableDistricts = selectedState
    ? indianStates.find((state) => state.name === selectedState)?.districts ||
      []
    : [];

  const handleStateChange = (value) => {
    setSelectedState(value);
    setSelectedDistrict("");
    setIsSelecting(true);
    setTimeout(() => setIsSelecting(false), 300);
  };

  const handleDistrictChange = (value) => {
    setSelectedDistrict(value);
    setIsSelecting(true);
    setTimeout(() => setIsSelecting(false), 300);
  };

  const handleSearch = () => {
    if (searchInput.length < 2) {
      setSearchResults([]);
      return;
    }

    const results = [];
    const searchTerm = searchInput.toLowerCase();

    indianStates.forEach((state) => {
      // Search in state names
      if (state.name.toLowerCase().includes(searchTerm)) {
        state.districts.slice(0, 3).forEach((district) => {
          results.push({ state: state.name, district });
        });
      }

      // Search in district names
      state.districts.forEach((district) => {
        if (district.toLowerCase().includes(searchTerm)) {
          results.push({ state: state.name, district });
        }
      });
    });

    setSearchResults(results.slice(0, 6)); // Limit to top 6 results
  };

  const handleLocationSubmit = () => {
    if (selectedState && selectedDistrict) {
      onLocationSelect({ state: selectedState, district: selectedDistrict });
    }
  };

  const handleSearchResultSelect = (result) => {
    setSelectedState(result.state);
    setSelectedDistrict(result.district);
    onLocationSelect(result);
  };

  // Use proper useEffect with dependency array
  useEffect(() => {
    if (searchInput.length >= 2) {
      const debounceTimer = setTimeout(() => {
        handleSearch();
      }, 300);
      return () => clearTimeout(debounceTimer);
    } else {
      setSearchResults([]);
    }
  }, [searchInput]);

  return (
    <Card className="overflow-hidden border-0 shadow-xl bg-white/95 backdrop-blur-xl rounded-x">
      <CardContent className="p-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="h-6 w-6 text-white" />
              <h3 className="text-xl font-semibold">Select Your Location</h3>
            </div>

            <div className="flex items-center space-x-2 bg-white/20 rounded-full p-1">
              <Button
                variant={searchMode === "dropdown" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSearchMode("dropdown")}
                className={`rounded-full px-4 py-1 text-sm font-medium transition-all duration-200 ${
                  searchMode === "dropdown"
                    ? "bg-white text-emerald-600 shadow-md"
                    : "bg-transparent text-white hover:bg-white/20"
                }`}
              >
                <MapIcon className="h-4 w-4 mr-2" />
                Browse
              </Button>
              <Button
                variant={searchMode === "search" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSearchMode("search")}
                className={`rounded-full px-4 py-1 text-sm font-medium transition-all duration-200 ${
                  searchMode === "search"
                    ? "bg-white text-emerald-600 shadow-md"
                    : "bg-transparent text-white hover:bg-white/20"
                }`}
              >
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {searchMode === "dropdown" ? (
            <div className="space-y-5">
              <div className="space-y-2">
                <Label
                  htmlFor="state-select"
                  className="text-gray-800 font-medium flex items-center gap-2"
                >
                  <MapIcon className="h-4 w-4 text-emerald-500" />
                  State
                </Label>
                <Select value={selectedState} onValueChange={handleStateChange}>
                  <SelectTrigger
                    id="state-select"
                    className="w-full bg-white border-gray-200 hover:border-emerald-300 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200"
                  >
                    <SelectValue placeholder="Select a state" />
                  </SelectTrigger>
                  <SelectContent className="max-h-80 bg-white shadow-xl rounded-lg border-gray-200">
                    <div className="p-2">
                      <Input
                        placeholder="Filter states..."
                        className="mb-2 border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {indianStates.map((state) => (
                        <SelectItem
                          key={state.name}
                          value={state.name}
                          className="hover:bg-emerald-50 focus:bg-emerald-50 dark:hover:bg-emerald-900/20"
                        >
                          {state.name}
                        </SelectItem>
                      ))}
                    </div>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="district-select"
                  className={`text-gray-800 font-medium flex items-center gap-2 ${
                    !selectedState ? "text-gray-400 dark:text-gray-500" : ""
                  }`}
                >
                  <MapPinIcon
                    className={`h-4 w-4 ${
                      selectedState ? "text-emerald-500" : "text-gray-400"
                    }`}
                  />
                  District
                </Label>
                <Select
                  value={selectedDistrict}
                  onValueChange={handleDistrictChange}
                  disabled={!selectedState}
                >
                  <SelectTrigger
                    id="district-select"
                    className={`w-full transition-all duration-200 ${
                      !selectedState
                        ? "bg-gray-100 border-gray-200 cursor-not-allowed"
                        : "bg-white border-gray-200 hover:border-emerald-300 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    }`}
                  >
                    <SelectValue placeholder="Select a district" />
                  </SelectTrigger>
                  <SelectContent className="max-h-80 bg-white shadow-xl rounded-lg border-gray-200">
                    <div className="p-2">
                      <Input
                        placeholder="Filter districts..."
                        className="mb-2 border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {availableDistricts.map((district) => (
                        <SelectItem
                          key={district}
                          value={district}
                          className="hover:bg-emerald-50 focus:bg-emerald-50"
                        >
                          {district}
                        </SelectItem>
                      ))}
                    </div>
                  </SelectContent>
                </Select>
              </div>

              {selectedState && selectedDistrict && (
                <div className="py-2 px-4 bg-emerald-50 rounded-lg border border-emerald-100 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                  <p className="text-sm text-emerald-800 dark:text-emerald-200">
                    Location selected:{" "}
                    <span className="font-medium">
                      {selectedDistrict}, {selectedState}
                    </span>
                  </p>
                </div>
              )}

              <Button
                className={`w-full py-3 group transition-all duration-300 ${
                  selectedState && selectedDistrict
                    ? "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-600/30"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500"
                }`}
                onClick={handleLocationSubmit}
                disabled={!(selectedState && selectedDistrict)}
              >
                <MapPinIcon className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Get Crop Recommendations
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="location-search"
                  className="text-gray-700 font-medium flex items-center gap-2 dark:text-gray-300"
                >
                  <Search className="h-4 w-4 text-emerald-500" />
                  Search for a location
                </Label>
                <div className="relative">
                  <Input
                    id="location-search"
                    placeholder="Type state or district name..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full pl-10 bg-white/70 border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  {searchInput && (
                    <button
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 h-6 w-6 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center hover:bg-gray-300 transition-colors duration-200"
                      onClick={() => setSearchInput("")}
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              {searchInput && searchInput.length < 2 && (
                <div className="text-center py-3 px-4 bg-blue-50 rounded-lg border border-blue-100 flex items-center gap-2 dark:bg-blue-900/20 dark:border-blue-900/30">
                  <p className="text-sm text-blue-700 dark:text-blue-200">
                    Type at least 2 characters to search
                  </p>
                </div>
              )}

              {searchResults.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Found {searchResults.length} results:
                  </p>
                  <div className="space-y-2">
                    {searchResults.map((result, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full justify-start bg-white hover:bg-emerald-50 border-gray-200 text-gray-800 transition-all duration-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-emerald-900/20"
                        onClick={() => handleSearchResultSelect(result)}
                      >
                        <MapPinIcon className="mr-2 h-4 w-4 text-emerald-500" />
                        <span>
                          <span className="font-medium">{result.district}</span>
                          ,{" "}
                          <span className="text-gray-500 dark:text-gray-400">
                            {result.state}
                          </span>
                        </span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {searchInput &&
                searchInput.length >= 2 &&
                searchResults.length === 0 && (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4 dark:bg-gray-700">
                      <Search className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">
                      No locations found matching "
                      <span className="font-medium">{searchInput}</span>"
                    </p>
                    <p className="text-sm text-gray-400 mt-1 dark:text-gray-500">
                      Try a different search term or browse by state
                    </p>
                  </div>
                )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationSelector;