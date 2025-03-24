// Store API configuration parameters
const ApiConfig = {
    // Replace with your actual Gemini API key
    GEMINI_API_KEY: 'YOUR_GEMINI_API_KEY',

    // API endpoint configurations
    CHART_COLORS: {
        primary: '#10B981', // green-500
        secondary: '#3B82F6', // blue-500
        danger: '#EF4444', // red-500
        warning: '#F59E0B', // amber-500
        info: '#6366F1', // indigo-500
        success: '#22C55E', // green-600
        background: '#F3F4F6', // gray-100
        text: '#1F2937', // gray-800
        lighter: '#D1FAE5', // green-100
    },

    // Time intervals for data refresh (in milliseconds)
    REFRESH_INTERVALS: {
        marketData: 3600000, // 1 hour
        recommendations: 86400000, // 24 hours
    },

    // Default regions for crop recommendations
    DEFAULT_REGIONS: [
        'North India',
        'South India',
        'East India',
        'West India',
        'Central India',
        'North East India'
    ],

    // Categories for filtering
    CROP_CATEGORIES: [
        'All',
        'Cereals',
        'Pulses',
        'Vegetables',
        'Fruits',
        'Oil Seeds',
        'Spices',
        'Commercial Crops'
    ],

    // Mapping of crops to their categories for filtering
    CROP_CATEGORY_MAPPING: {
        'Rice': 'Cereals',
        'Wheat': 'Cereals',
        'Maize': 'Cereals',
        'Barley': 'Cereals',
        'Sorghum': 'Cereals',
        'Gram': 'Pulses',
        'Pigeon Pea': 'Pulses',
        'Moong Bean': 'Pulses',
        'Urad Bean': 'Pulses',
        'Potato': 'Vegetables',
        'Onion': 'Vegetables',
        'Tomato': 'Vegetables',
        'Brinjal': 'Vegetables',
        'Cauliflower': 'Vegetables',
        'Cabbage': 'Vegetables',
        'Mango': 'Fruits',
        'Banana': 'Fruits',
        'Apple': 'Fruits',
        'Orange': 'Fruits',
        'Grape': 'Fruits',
        'Groundnut': 'Oil Seeds',
        'Mustard': 'Oil Seeds',
        'Soybean': 'Oil Seeds',
        'Sunflower': 'Oil Seeds',
        'Sesame': 'Oil Seeds',
        'Chilli': 'Spices',
        'Turmeric': 'Spices',
        'Ginger': 'Spices',
        'Cardamom': 'Spices',
        'Black Pepper': 'Spices',
        'Cotton': 'Commercial Crops',
        'Sugarcane': 'Commercial Crops',
        'Jute': 'Commercial Crops',
        'Coffee': 'Commercial Crops',
        'Tea': 'Commercial Crops',
    }
};

export default ApiConfig;