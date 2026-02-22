import React from "react";
import { Check, ChevronDown, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../Components/Ui/DropdownMenu"; // Adjust path as per your project
import { LANGUAGES } from "../Services/LanguageService";

const LanguageSelector = ({ selectedLanguage, onLanguageChange }) => {
  const selectedLanguageOption = LANGUAGES.find(
    (lang) => lang.value === selectedLanguage
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center bg-white border border-gray-200 rounded-full px-4 py-1.5 gap-2 text-sm text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 ease-in-out"
          aria-label="Select Language"
        >
          <Globe size={16} className="text-green-600" />
          <span>{selectedLanguageOption?.label || "English"}</span>
          <ChevronDown
            size={14}
            className="text-gray-500 transition-transform duration-200 ease-in-out data-[state=open]:-rotate-180"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[180px] bg-white border border-gray-200 rounded-md shadow-lg p-1 mt-1 transition-opacity duration-200 ease-in-out data-[state=open]:opacity-100 data-[state=closed]:opacity-0"
      >
        {LANGUAGES.map((language) => (
          <DropdownMenuItem
            key={language.value}
            className="flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100 cursor-pointer transition-colors duration-150 ease-in-out"
            onSelect={() => onLanguageChange(language.value)}
          >
            <div className="flex items-center gap-2">
              <span>{language.label}</span>
              <span className="text-xs text-gray-500">
                ({language.nativeLabel})
              </span>
            </div>
            {selectedLanguage === language.value && (
              <Check size={16} className="text-green-600" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
