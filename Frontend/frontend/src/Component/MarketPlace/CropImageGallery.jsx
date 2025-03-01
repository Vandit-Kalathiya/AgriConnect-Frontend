import React, { useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CropImageGallery = ({ images, type, variety }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  const nextImage = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleThumbnailClick = (index) => {
    setSelectedImageIndex(index);
  };

  const openLightbox = () => {
    setShowLightbox(true);
  };

  const closeLightbox = () => {
    setShowLightbox(false);
  };

  // No images fallback
  if (!images.length) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="relative w-full h-96 overflow-hidden rounded-lg shadow-md group">
        <motion.img
          key={selectedImageIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          src={images[selectedImageIndex]}
          alt={`${type} - ${variety}`}
          className="w-full h-full object-cover cursor-zoom-in"
          onClick={openLightbox}
        />

        <button
          onClick={prevImage}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 text-gray-800 p-2 rounded-full shadow hover:bg-opacity-100 transition-all opacity-0 group-hover:opacity-100 focus:outline-none"
          aria-label="Previous image"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          onClick={nextImage}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 text-gray-800 p-2 rounded-full shadow hover:bg-opacity-100 transition-all opacity-0 group-hover:opacity-100 focus:outline-none"
          aria-label="Next image"
        >
          <ChevronRight size={20} />
        </button>

        <button
          onClick={openLightbox}
          className="absolute right-2 top-2 bg-white bg-opacity-75 text-gray-800 p-2 rounded-full shadow hover:bg-opacity-100 transition-all opacity-0 group-hover:opacity-100 focus:outline-none"
          aria-label="Zoom image"
        >
          <ZoomIn size={16} />
        </button>

        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-40 px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-white text-xs">
            {selectedImageIndex + 1} / {images.length}
          </span>
        </div>
      </div>

      <div className="flex gap-2 mt-4 justify-center overflow-x-auto pb-2">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => handleThumbnailClick(idx)}
            className={`focus:outline-none transition-all ${
              selectedImageIndex === idx
                ? "opacity-100 ring-2 ring-green-500"
                : "opacity-70 hover:opacity-100"
            }`}
          >
            <img
              src={img}
              alt={`Thumbnail ${idx + 1}`}
              className="w-16 h-16 object-cover rounded-md"
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {showLightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
            onClick={closeLightbox}
          >
            <button
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-70 transition-colors"
              onClick={closeLightbox}
            >
              <X size={24} />
            </button>

            <div
              className="relative w-full max-w-4xl h-full max-h-screen flex items-center justify-center px-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute left-4 text-white bg-black bg-opacity-50 p-3 rounded-full hover:bg-opacity-70 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
              >
                <ChevronLeft size={24} />
              </button>

              <motion.img
                key={`lightbox-${selectedImageIndex}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                src={images[selectedImageIndex]}
                alt={`${type} - ${variety}`}
                className="max-h-screen max-w-full object-contain"
              />

              <button
                className="absolute right-4 text-white bg-black bg-opacity-50 p-3 rounded-full hover:bg-opacity-70 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
              >
                <ChevronRight size={24} />
              </button>

              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 px-3 py-1 rounded-full">
                <span className="text-white">
                  {selectedImageIndex + 1} / {images.length}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CropImageGallery;
