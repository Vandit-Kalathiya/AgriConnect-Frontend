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
import { Button } from "./ui/Button";
import { indianStates } from "./indianStates";

const LocationSelector = ({ onLocationSelect }) => {
  const [searchMode, setSearchMode] = useState("dropdown");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 

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
      if (state.name.toLowerCase().includes(searchTerm)) {
        state.districts.slice(0, 3).forEach((district) => {
          results.push({ state: state.name, district });
        });
      }
      state.districts.forEach((district) => {
        if (district.toLowerCase().includes(searchTerm)) {
          results.push({ state: state.name, district });
        }
      });
    });

    setSearchResults(results.slice(0, 6));
  };

  const handleLocationSubmit = () => {
    if (selectedState && selectedDistrict) {
      setIsLoading(true);
      setTimeout(() => {
        onLocationSelect({ state: selectedState, district: selectedDistrict });
        setIsLoading(false);
      }, 2000); 
    }
  };

  const handleSearchResultSelect = (result) => {
    setSelectedState(result.state);
    setSelectedDistrict(result.district);
    onLocationSelect(result);
  };

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
    <Card className="overflow-hidden border-0 shadow-xl bg-white/95 backdrop-blur-xl rounded-xl">
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
                className={`w-full py-3 group transition-all duration-300 relative ${
                  selectedState && selectedDistrict
                    ? "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-600/30"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500"
                }`}
                onClick={handleLocationSubmit}
                disabled={!(selectedState && selectedDistrict) || isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                      />
                    </svg>
                    <span>Generating...</span>
                  </div>
                ) : (
                  <>
                    <MapPinIcon className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                    Get Crop Recommendations
                  </>
                )}
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
