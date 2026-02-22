import React from 'react';

const CategoryButtons = ({ categories, onCategorySelect }) => {
  return (
    React.createElement('div', { className: "grid grid-cols-4 gap-4 max-w-3xl mx-auto my-6" },
      categories.map((category) => (
        React.createElement('button', {
          key: category.id,
          className: "category-button bg-white hover:bg-kisan-secondary",
          onClick: () => onCategorySelect(category.id)
        },
          React.createElement('div', { className: "w-12 h-12 rounded-full bg-kisan-light flex items-center justify-center mb-2" },
            React.createElement('span', { className: "text-2xl" }, category.icon)
          ),
          React.createElement('span', { className: "text-sm font-medium text-gray-700" }, category.label)
        )
      ))
    )
  );
};

export default CategoryButtons;