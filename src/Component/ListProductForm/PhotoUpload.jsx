import React, { useState } from "react";

const PhotoUpload = ({
  productPhotos,
  handlePhotoUpload,
  removePhoto,
  maxPhotos = 5,
}) => {
  const [error, setError] = useState(null);

  const validateAndHandleUpload = (e) => {
    const files = Array.from(e.target.files);
    setError(null);

    if (productPhotos.length + files.length > maxPhotos) {
      setError(`You can only upload a maximum of ${maxPhotos} photos.`);
      return;
    }

    const validTypes = ["image/png", "image/jpeg", "image/gif"];
    const maxSizeInBytes = 10 * 1024 * 1024; // 10MB

    const invalidFiles = [];
    const validFiles = [];

    files.forEach((file) => {
      if (!validTypes.includes(file.type)) {
        invalidFiles.push(
          `${file.name}: Invalid type (only PNG, JPG, GIF allowed)`
        );
        return;
      }
      if (file.size > maxSizeInBytes) {
        invalidFiles.push(`${file.name}: File too large (max 10MB)`);
        return;
      }
      validFiles.push(file);
    });

    if (invalidFiles.length > 0) {
      setError(invalidFiles.join("; "));
      return;
    }

    if (validFiles.length > 0) {
      handlePhotoUpload({ target: { files: validFiles } });
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">
        Product Photos ({productPhotos.length}/{maxPhotos})
      </label>
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
        {productPhotos.length === 0 ? (
          // Show upload placeholder when no photos are uploaded
          <div className="space-y-1 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4 0h-4v4m-12 4h12" />
            </svg>
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
              >
                <span>Upload Photos</span>
                <input
                  id="file-upload"
                  name="productPhotos"
                  type="file"
                  className="sr-only"
                  onChange={validateAndHandleUpload}
                  multiple
                  accept="image/png,image/jpeg,image/gif"
                />
              </label>
            </div>
            <p className="text-xs text-gray-500">
              PNG, JPG, GIF up to 10MB (Max {maxPhotos} photos)
            </p>
          </div>
        ) : (
          // Show photo previews and upload button when photos are present
          <div className="w-full space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {productPhotos.map((photo, index) => (
                <div key={index} className="relative group">
                  <img
                    src={photo.preview}
                    alt={`Preview ${index}`}
                    className="h-20 w-full object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      removePhoto(index);
                      setError(null);
                    }}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            {productPhotos.length < maxPhotos && (
              <div className="flex justify-center text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                >
                  <span>Add More Photos</span>
                  <input
                    id="file-upload"
                    name="productPhotos"
                    type="file"
                    className="sr-only"
                    onChange={validateAndHandleUpload}
                    multiple
                    accept="image/png,image/jpeg,image/gif"
                  />
                </label>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default PhotoUpload;
