import React from 'react';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../Components/Ui/DropdownMenu';
import { LANGUAGES } from '../Services/LanguageService';

const LanguageSelector = ({ 
  selectedLanguage, 
  onLanguageChange 
}) => {
  const selectedLanguageOption = LANGUAGES.find(lang => lang.value === selectedLanguage);

  return (
    React.createElement(DropdownMenu, null,
      React.createElement(DropdownMenuTrigger, { asChild: true },
        React.createElement('button', { 
          className: "flex items-center bg-white border rounded-full px-4 py-1.5 gap-2 text-sm hover:bg-gray-50 transition-colors" 
        },
          React.createElement(Globe, { size: 16, className: "text-green-600" }),
          React.createElement('span', null, selectedLanguageOption?.label || 'English'),
          React.createElement(ChevronDown, { size: 14, className: "text-gray-500" })
        )
      ),
      React.createElement(DropdownMenuContent, { align: "end", className: "w-[180px]" },
        LANGUAGES.map((language) => (
          React.createElement(DropdownMenuItem, {
            key: language.value,
            className: "flex items-center justify-between cursor-pointer",
            onClick: () => onLanguageChange(language.value)
          },
            React.createElement('div', { className: "flex items-center gap-2" },
              React.createElement('span', null, language.label),
              React.createElement('span', { className: "text-xs text-gray-500" }, `(${language.nativeLabel})`)
            ),
            selectedLanguage === language.value && (
              React.createElement(Check, { size: 16, className: "text-green-600" })
            )
          )
        ))
      )
    )
  );
};

export default LanguageSelector;