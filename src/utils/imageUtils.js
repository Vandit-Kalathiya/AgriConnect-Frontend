/**
 * Image utility functions for converting byte arrays to displayable images
 */

/**
 * Convert byte array OR base64 string to image URL
 * @param {number[]|string} data - Array of bytes or base64 string from backend
 * @param {string} mimeType - MIME type of the image (default: 'image/jpeg')
 * @returns {string} Object URL or data URL that can be used in img src
 */
export const convertByteArrayToImageUrl = (data, mimeType = 'image/jpeg') => {
  if (!data) {
    console.warn('No data provided to convertByteArrayToImageUrl');
    return null;
  }

  try {
    // Check if data is a base64 string
    if (typeof data === 'string') {
      // If it already has data URL prefix, return as is
      if (data.startsWith('data:')) {
        return data;
      }
      // Otherwise, add the data URL prefix
      return `data:${mimeType};base64,${data}`;
    }

    // Handle byte array (legacy support)
    if (Array.isArray(data) && data.length > 0) {
      const uint8Array = new Uint8Array(data);
      const blob = new Blob([uint8Array], { type: mimeType });
      return URL.createObjectURL(blob);
    }

    console.warn('Invalid data format provided to convertByteArrayToImageUrl');
    return null;
  } catch (error) {
    console.error('Error converting data to image URL:', error);
    return null;
  }
};

/**
 * Convert ImageInfo object from backend to displayable URL
 * @param {Object} imageInfo - Image object from backend with data, fileType, etc.
 * @returns {string|null} Object URL or null if conversion fails
 */
export const convertImageInfoToUrl = (imageInfo) => {
  if (!imageInfo || !imageInfo.data) {
    console.warn('Invalid imageInfo provided to convertImageInfoToUrl');
    return null;
  }

  return convertByteArrayToImageUrl(imageInfo.data, imageInfo.fileType || 'image/jpeg');
};

/**
 * Revoke object URL to free memory
 * @param {string} url - Object URL to revoke
 */
export const revokeImageUrl = (url) => {
  if (url && typeof url === 'string' && url.startsWith('blob:')) {
    try {
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error revoking image URL:', error);
    }
  }
};

/**
 * Convert multiple ImageInfo objects to URLs
 * @param {Array} images - Array of ImageInfo objects from backend
 * @returns {Array} Array of object URLs
 */
export const convertImagesToUrls = (images) => {
  if (!images || !Array.isArray(images)) {
    return [];
  }

  return images
    .map(img => convertImageInfoToUrl(img))
    .filter(url => url !== null);
};

/**
 * Alternative: Convert byte array to base64 data URL (legacy support)
 * @param {number[]|string} data - Array of bytes or base64 string from backend
 * @param {string} mimeType - MIME type of the image (default: 'image/jpeg')
 * @returns {string} Base64 data URL
 */
export const convertByteArrayToBase64 = (data, mimeType = 'image/jpeg') => {
  if (!data) {
    console.warn('No data provided to convertByteArrayToBase64');
    return null;
  }

  try {
    // If already a string, just add prefix if needed
    if (typeof data === 'string') {
      if (data.startsWith('data:')) {
        return data;
      }
      return `data:${mimeType};base64,${data}`;
    }

    // Handle byte array
    if (Array.isArray(data) && data.length > 0) {
      const binaryString = String.fromCharCode(...data);
      const base64 = btoa(binaryString);
      return `data:${mimeType};base64,${base64}`;
    }

    return null;
  } catch (error) {
    console.error('Error converting data to base64:', error);
    return null;
  }
};

/**
 * Check if images array is valid and not empty
 * @param {Array} images - Array to check
 * @returns {boolean} True if valid and has items
 */
export const hasValidImages = (images) => {
  return images && Array.isArray(images) && images.length > 0;
};
