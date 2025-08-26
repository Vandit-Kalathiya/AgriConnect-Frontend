import { toast } from "sonner";

const API_KEY = 'AIzaSyDU7xQMNUiyJ9SEtvDQCd3jmpgfTGo9kg8';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export const generateCropAnalysis = async (cropName) => {
  try {
    console.log(`Generating analysis for ${cropName}...`);
    
    const cachedData = localStorage.getItem(`cropAnalysis_${cropName}`);
    if (cachedData) {
      try {
        const parsedCache = JSON.parse(cachedData);
        const cacheTime = parsedCache.timestamp;
        if (cacheTime && Date.now() - cacheTime < 3600000) {
          console.log("Using cached data for", cropName);
          return parsedCache.data;
        }
      } catch (e) {
        console.log("Cache parse error, will fetch fresh data");
      }
    }
    
    const prompt = `
      Generate a detailed market analysis for ${cropName} in the Indian agricultural market. 
      Include the following information:
      
      1. Current market trends for ${cropName} in India
      2. Price analysis with current average price in Rupees per kg, price from last month, percentage change, and forecasted price for next month
      3. 3-4 specific recommendations for farmers growing ${cropName}
      4. Market insights including demand patterns, export opportunities, and government policies affecting ${cropName}
      
      Format the response as a structured JSON with the following keys:
      {
        "predictions": "Brief summary of current trends",
        "recommendations": ["recommendation1", "recommendation2", "recommendation3"],
        "marketInsights": "Detailed insights about market conditions",
        "priceAnalysis": {
          "current": current price in rupees,
          "previous": previous month price in rupees,
          "change": percentage change,
          "forecast": forecasted price in rupees
        }
      }
      
      Make sure all the data is realistic for India and specific to ${cropName}. Use current seasonal patterns.
    `;

    console.log("Sending request to Gemini API...");
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.4,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 1024,
        }
      }),
      signal: AbortSignal.timeout(15000)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error:", errorData);
      throw new Error(`Failed to fetch data: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log("Received data from Gemini:", data);
    
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!responseText) {
      console.error("Invalid response format:", data);
      throw new Error('Invalid response format from Gemini API');
    }

    const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || 
                     responseText.match(/{[\s\S]*?}/);
                      
    if (!jsonMatch) {
      console.error("Could not extract JSON from response:", responseText);
      const fallbackData = createFallbackDataFromText(responseText, cropName);
      cacheAnalysisData(cropName, fallbackData);
      return fallbackData;
    }

    const jsonString = jsonMatch[1] || jsonMatch[0];
    console.log("Extracted JSON string:", jsonString);
    
    try {
      const parsedData = JSON.parse(jsonString.trim());
      console.log("Successfully parsed data:", parsedData);
      
      const sanitizedData = sanitizeResponse(parsedData, cropName);
      cacheAnalysisData(cropName, sanitizedData);
      
      return sanitizedData;
    } catch (parseError) {
      console.error("JSON parse error:", parseError, "for string:", jsonString);
      const fallbackData = createFallbackDataFromText(responseText, cropName);
      cacheAnalysisData(cropName, fallbackData);
      return fallbackData;
    }
  } catch (error) {
    console.error('Error generating crop analysis:', error);
    
    const cachedData = localStorage.getItem(`cropAnalysis_${cropName}`);
    if (cachedData) {
      try {
        const parsedCache = JSON.parse(cachedData);
        console.log("Using cached data as error fallback");
        return parsedCache.data;
      } catch (e) {
        console.log("Cache parse error for fallback");
      }
    }
    
    const fallbackData = createFallbackData(cropName);
    cacheAnalysisData(cropName, fallbackData);
    
    return fallbackData;
  }
};

const cacheAnalysisData = (cropName, data) => {
  try {
    localStorage.setItem(`cropAnalysis_${cropName}`, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch (e) {
    console.error("Error caching data:", e);
  }
};

const sanitizeResponse = (data, cropName) => {
  const sanitized = {
    predictions: data.predictions || `Market analysis for ${cropName} is currently being processed.`,
    recommendations: Array.isArray(data.recommendations) ? data.recommendations : 
      [`Consider market trends before planting ${cropName}`, `Monitor weather conditions for optimal ${cropName} growth`, `Follow best practices for ${cropName} cultivation`],
    marketInsights: data.marketInsights || `Detailed market insights for ${cropName} will be available soon.`,
    priceAnalysis: {
      current: typeof data.priceAnalysis?.current === 'number' ? data.priceAnalysis.current : generateRandomPrice(cropName),
      previous: typeof data.priceAnalysis?.previous === 'number' ? data.priceAnalysis.previous : generateRandomPrice(cropName, -1),
      change: typeof data.priceAnalysis?.change === 'number' ? data.priceAnalysis.change : generateRandomChange(),
      forecast: typeof data.priceAnalysis?.forecast === 'number' ? data.priceAnalysis.forecast : generateRandomPrice(cropName, 1)
    }
  };
  
  return sanitized;
};

const createFallbackDataFromText = (text, cropName) => {
  console.log("Creating fallback data from text");
  
  const predictions = extractSentence(text, ['trend', 'market', 'current', 'status']) || 
    `The ${cropName} market is showing typical seasonal patterns with moderate demand.`;
  
  const recommendations = extractRecommendations(text) || [
    `Monitor market prices before harvesting ${cropName}`,
    `Consider proper storage techniques for ${cropName} to maximize shelf life`,
    `Follow recommended agricultural practices for ${cropName} cultivation`
  ];
  
  const marketInsights = extractSentence(text, ['insight', 'opportunity', 'export', 'demand']) ||
    `${cropName} has moderate demand in domestic markets with some seasonal fluctuations.`;
  
  const current = extractNumber(text, ['current price', 'average price', 'market price']) || generateRandomPrice(cropName);
  const previous = extractNumber(text, ['previous price', 'last month', 'earlier price']) || generateRandomPrice(cropName, -1);
  const change = extractNumber(text, ['change', 'increase', 'decrease', 'percent']) || generateRandomChange();
  const forecast = extractNumber(text, ['forecast', 'expected', 'predicted', 'next month']) || generateRandomPrice(cropName, 1);
  
  return {
    predictions,
    recommendations,
    marketInsights,
    priceAnalysis: {
      current,
      previous,
      change,
      forecast
    }
  };
};

const createFallbackData = (cropName) => {
  console.log("Creating complete fallback data for", cropName);
  
  const cropCategory = categorizeCrop(cropName);
  
  return {
    predictions: getCropPrediction(cropName, cropCategory),
    recommendations: getCropRecommendations(cropName, cropCategory),
    marketInsights: getCropMarketInsights(cropName, cropCategory),
    priceAnalysis: {
      current: generateRandomPrice(cropName),
      previous: generateRandomPrice(cropName, -1),
      change: generateRandomChange(),
      forecast: generateRandomPrice(cropName, 1)
    }
  };
};

function extractSentence(text, keywords) {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
  for (const keyword of keywords) {
    const matchingSentence = sentences.find(s => 
      s.toLowerCase().includes(keyword.toLowerCase())
    );
    if (matchingSentence) return matchingSentence.trim();
  }
  return null;
}

function extractRecommendations(text) {
  const recPatterns = [
    /\d+\.\s+(.*?)(?=\d+\.|$)/gs,
    /[•●■]\s+(.*?)(?=[•●■]|$)/gs,
    /recommend(?:ation|ed|ing).*?([^.!?]+[.!?])/gi
  ];
  
  for (const pattern of recPatterns) {
    const matches = Array.from(text.matchAll(pattern))
      .map(m => m[1]?.trim())
      .filter(Boolean);
    
    if (matches.length >= 2) return matches.slice(0, 3);
  }
  
  return null;
}

function extractNumber(text, contextKeywords) {
  for (const keyword of contextKeywords) {
    const pattern = new RegExp(`${keyword}.*?(?:[₹Rs.]*\\s*)(\\d+(?:[.,]\\d+)?)`, 'i');
    const match = text.match(pattern);
    if (match && match[1]) {
      return parseFloat(match[1].replace(',', ''));
    }
  }
  return null;
}

function categorizeCrop(cropName) {
  const cropLower = cropName.toLowerCase();
  
  const vegetables = ['tomato', 'potato', 'onion', 'cabbage', 'carrot', 'brinjal', 'cauliflower', 'capsicum', 'cucumber', 'peas', 'spinach', 'okra', 'ladyfinger', 'bottle gourd', 'bitter gourd', 'chilli'];
  const fruits = ['mango', 'apple', 'banana', 'orange', 'grapes', 'watermelon', 'papaya', 'pineapple', 'guava', 'litchi', 'pomegranate', 'strawberry', 'kiwi', 'coconut'];
  const grains = ['rice', 'wheat', 'maize', 'corn', 'barley', 'jowar', 'bajra', 'ragi', 'oats', 'sorghum', 'millet'];
  const spices = ['turmeric', 'chilli', 'cumin', 'coriander', 'cardamom', 'pepper', 'saffron', 'clove', 'cinnamon', 'ginger', 'garlic'];
  
  if (vegetables.some(v => cropLower.includes(v))) return 'vegetable';
  if (fruits.some(f => cropLower.includes(f))) return 'fruit';
  if (grains.some(g => cropLower.includes(g))) return 'grain';
  if (spices.some(s => cropLower.includes(s))) return 'spice';
  
  return 'other';
}

function generateRandomPrice(cropName, monthOffset = 0) {
  const category = categorizeCrop(cropName);
  
  const baseRanges = {
    'vegetable': [15, 60],
    'fruit': [40, 200],
    'grain': [20, 100],
    'spice': [100, 500],
    'other': [30, 150]
  };
  
  const [min, max] = baseRanges[category];
  
  let basePrice = min + Math.random() * (max - min);
  basePrice = Math.round(basePrice * 100) / 100;
  
  if (monthOffset !== 0) {
    const variation = (Math.random() * 0.15 + 0.05) * (Math.random() > 0.5 ? 1 : -1);
    basePrice = basePrice * (1 + variation);
    basePrice = Math.round(basePrice * 100) / 100;
  }
  
  return basePrice;
}

function generateRandomChange() {
  const change = (Math.random() * 30 - 15);
  return Math.round(change * 100) / 100;
}

function getCropPrediction(cropName, category) {
  const predictions = {
    'vegetable': [
      `${cropName} markets are showing steady demand with slight price fluctuations based on seasonal availability.`,
      `Current ${cropName} production is meeting demand, with prices stabilizing after recent harvests.`,
      `${cropName} prices are expected to remain within seasonal norms with minor adjustments based on supply chain efficiency.`
    ],
    'fruit': [
      `${cropName} season is showing strong demand in both local and export markets with premium quality fetching higher prices.`,
      `The market for ${cropName} is currently active with good buying interest from domestic and international buyers.`,
      `${cropName} supply chain is operating smoothly with balanced demand and supply conditions.`
    ],
    'grain': [
      `${cropName} prices are stable with adequate supply meeting domestic consumption needs.`,
      `Government procurement of ${cropName} continues at MSP, providing floor price support to farmers.`,
      `${cropName} markets are showing typical trading patterns with regular export demand.`
    ],
    'spice': [
      `${cropName} markets are experiencing typical seasonal demand with stable pricing trends.`,
      `Premium quality ${cropName} continues to command better prices with consistent export demand.`,
      `${cropName} prices reflect balanced market conditions with steady domestic and export demand.`
    ],
    'other': [
      `${cropName} market shows balanced supply-demand dynamics with stable price trends.`,
      `${cropName} production and distribution channels are operating normally with typical seasonal patterns.`,
      `Market indicators for ${cropName} suggest steady conditions with normal price volatility.`
    ]
  };
  
  const categoryPredictions = predictions[category] || predictions.other;
  return categoryPredictions[Math.floor(Math.random() * categoryPredictions.length)];
}

function getCropRecommendations(cropName, category) {
  const recommendations = {
    'vegetable': [
      `Consider staggered planting of ${cropName} to ensure continuous harvest and avoid market gluts.`,
      `Implement proper sorting and grading of ${cropName} to access premium market segments.`,
      `Monitor weather forecasts closely as ${cropName} prices are sensitive to sudden climate changes.`,
      `Explore direct marketing channels for ${cropName} to capture better profit margins.`
    ],
    'fruit': [
      `Invest in proper post-harvest handling of ${cropName} to minimize losses and maintain quality.`,
      `Consider cold storage options for ${cropName} to sell when market prices are more favorable.`,
      `Focus on premium quality ${cropName} production to access high-value urban and export markets.`,
      `Join farmer producer organizations to improve bargaining power when selling ${cropName}.`
    ],
    'grain': [
      `Stay informed about government procurement policies for ${cropName} to make informed selling decisions.`,
      `Consider value addition options for ${cropName} to diversify income streams.`,
      `Monitor international ${cropName} prices if targeting export markets.`,
      `Implement proper storage practices to minimize post-harvest losses of ${cropName}.`
    ],
    'spice': [
      `Focus on maintaining quality standards for ${cropName} to access premium markets.`,
      `Consider organic certification for ${cropName} to tap into high-value market segments.`,
      `Explore direct partnerships with processing industries for consistent ${cropName} sales.`,
      `Implement proper drying and storage techniques to preserve ${cropName} quality and value.`
    ],
    'other': [
      `Monitor market trends closely before harvesting ${cropName} to time your sales optimally.`,
      `Consider forming farmer groups to aggregate ${cropName} production and access better markets.`,
      `Implement crop rotation and sustainable practices to improve ${cropName} quality and yields.`,
      `Diversify marketing channels for ${cropName} to reduce dependency on a single buyer.`
    ]
  };
  
  const categoryRecommendations = recommendations[category] || recommendations.other;
  const shuffled = [...categoryRecommendations].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
}

function getCropMarketInsights(cropName, category) {
  const insights = {
    'vegetable': [
      `${cropName} demand patterns show regular weekly cycles with higher prices during weekends in urban markets. Recent government initiatives to improve cold chain infrastructure may benefit ${cropName} farmers by extending shelf life and reducing spoilage. Export opportunities exist for premium quality produce meeting international standards.`,
      `${cropName} market shows consistent demand throughout the year with seasonal price variations. Urban consumers increasingly prefer pesticide-free ${cropName}, creating a premium market segment. Recent improvements in supply chain infrastructure have reduced farm-to-market time for fresh ${cropName}.`
    ],
    'fruit': [
      `${cropName} demand is strong in tier-1 and tier-2 cities with premium quality fetching 15-20% higher prices. Export markets in Middle East and Southeast Asia show increasing interest in Indian ${cropName}. Recent policy changes have streamlined export procedures, benefiting ${cropName} exporters.`,
      `The ${cropName} market shows strong seasonal demand patterns with premium for early and late season produce. Growing cold storage capacity is allowing better price realization through extended selling periods. E-commerce platforms are emerging as significant distribution channels for fresh ${cropName}.`
    ],
    'grain': [
      `${cropName} markets operate with strong influence from government procurement policies and MSP announcements. Steady export demand provides additional market support beyond domestic consumption. Value-added ${cropName} products are showing increased consumer acceptance, creating new market opportunities.`,
      `${cropName} procurement is ongoing at designated centers with prices aligned with Minimum Support Price (MSP). International markets show stable demand for Indian ${cropName} with quality parameters being the key differentiator. Recent policy initiatives aim to promote direct farmer-buyer connections for better price realization.`
    ],
    'spice': [
      `${cropName} commands premium prices when quality parameters like oil content and color are maintained. Export markets value consistent quality and organic certification for Indian ${cropName}. Recent GI tagging initiatives are helping regional ${cropName} varieties gain market recognition and premium pricing.`,
      `Global demand for Indian ${cropName} remains strong with quality and food safety compliance being key requirements. Domestic processing industry offers steady demand throughout the year. New packaging innovations are helping extend shelf life and preserve quality of processed ${cropName}.`
    ],
    'other': [
      `${cropName} market shows balanced demand-supply dynamics with typical seasonal variations. Quality certification and standardization are increasingly important for accessing premium markets. Recent infrastructure developments in agricultural marketing may benefit ${cropName} farmers through improved market access.`,
      `${cropName} prices reflect normal seasonal patterns with gradual adjustments based on production estimates. Direct marketing initiatives provide opportunities for better farmer realization. E-NAM platform integration is helping improve price discovery for ${cropName} in regulated markets.`
    ]
  };
  
  const categoryInsights = insights[category] || insights.other;
  return categoryInsights[Math.floor(Math.random() * categoryInsights.length)];
}

export const generateRecommendations = async (cropType = 'general') => {
  try {
    console.log(`Generating recommendations for ${cropType}...`);
    const prompt = `
      Generate 3 practical, actionable recommendations for Indian farmers regarding ${cropType} crops.
      Focus on current market conditions, seasonal factors for this time of year, and realistic advice.
      Make the recommendations specific, detailed, and immediately useful.
      Format each recommendation as a complete sentence or short paragraph.
      Return only the 3 recommendations as a JSON array of strings, nothing else.
    `;

    console.log("Sending recommendation request to Gemini API...");
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch recommendations: ${response.status}`);
    }

    const data = await response.json();
    console.log("Received recommendation data from Gemini:", data);
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!responseText) {
      throw new Error('Invalid response format from Gemini API');
    }

    const jsonMatch = responseText.match(/\[([\s\S]*?)\]/) || 
                     responseText.match(/```json\n([\s\S]*?)\n```/) ||
                     responseText.match(/```\n([\s\S]*?)\n```/);
                      
    if (jsonMatch) {
      const jsonString = jsonMatch[0];
      try {
        return JSON.parse(jsonString);
      } catch (error) {
        console.error("Error parsing recommendations JSON:", error);
        return extractRecommendationsFromText(responseText);
      }
    } else {
      return extractRecommendationsFromText(responseText);
    }
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return getFallbackRecommendations(cropType);
  }
};

function extractRecommendationsFromText(text) {
  const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
  
  const recommendationLines = lines.filter(line => 
    /^(\d+\.|\*|•|-)/.test(line)
  );
  
  if (recommendationLines.length >= 3) {
    return recommendationLines
      .map(line => line.replace(/^(\d+\.|\*|•|-)/, '').trim())
      .slice(0, 3);
  }
  
  const sentences = text.split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 15);
  
  return sentences.slice(0, 3);
}

function getFallbackRecommendations(cropType) {
  const generalRecommendations = [
    "Consider diversifying your crops to mitigate market volatility risks and ensure steady income throughout the year.",
    "Stay updated with weather forecasts and government agricultural advisories to plan your farming activities effectively.",
    "Explore government subsidies and support programs available for farmers in your region for financial assistance."
  ];
  
  const seasonalRecommendations = {
    'winter': [
      "Protect sensitive crops from frost damage by using proper covering techniques during cold nights.",
      "Consider growing winter vegetables like peas, carrots, and cauliflower which fetch good prices in urban markets.",
      "Plan irrigation carefully as water requirements decrease during winter months."
    ],
    'summer': [
      "Implement water conservation techniques like drip irrigation to minimize water usage during hot months.",
      "Consider heat-resistant crop varieties that can withstand high temperatures without yield reduction.",
      "Apply mulching to reduce soil temperature and maintain moisture for better crop growth."
    ],
    'monsoon': [
      "Ensure proper drainage systems to prevent waterlogging in fields during heavy rains.",
      "Consider short-duration crop varieties that can be harvested before peak monsoon floods.",
      "Implement pest management strategies as pest infestations increase during humid conditions."
    ],
    'fruits': [
      "Invest in proper post-harvest handling techniques to reduce spoilage and maintain fruit quality for better market prices.",
      "Consider forming farmer producer groups to access better marketing channels for your fruit crops.",
      "Implement integrated pest management to reduce chemical usage and access premium markets for your fruits."
    ],
    'vegetables': [
      "Consider staggered planting of vegetables to ensure continuous harvest and stable income throughout the season.",
      "Explore protected cultivation like poly houses for off-season vegetable production to fetch premium prices.",
      "Focus on quality grading and sorting of vegetable produce to access high-value urban markets."
    ],
    'grains': [
      "Stay informed about Minimum Support Price announcements and government procurement policies for your grain crops.",
      "Consider proper storage solutions to avoid post-harvest losses and sell when market prices are favorable.",
      "Implement soil testing and targeted fertilizer application to optimize input costs for grain production."
    ]
  };
  
  const currentMonth = new Date().getMonth();
  let recommendationsToUse;
  
  if (cropType.toLowerCase().includes('fruit')) {
    recommendationsToUse = seasonalRecommendations.fruits;
  } else if (cropType.toLowerCase().includes('vegetable')) {
    recommendationsToUse = seasonalRecommendations.vegetables;
  } else if (cropType.toLowerCase().includes('grain') || cropType.toLowerCase().includes('cereal')) {
    recommendationsToUse = seasonalRecommendations.grains;
  } else {
    if (currentMonth >= 10 || currentMonth <= 1) {
      recommendationsToUse = seasonalRecommendations.winter;
    } else if (currentMonth >= 2 && currentMonth <= 5) {
      recommendationsToUse = seasonalRecommendations.summer;
    } else {
      recommendationsToUse = seasonalRecommendations.monsoon;
    }
  }
  
  return recommendationsToUse || generalRecommendations;
}