// This file would normally contain API calls to a backend service
// For demo purposes, we're using mock data

// Mock data for demonstration purposes (commented out as in original)
// export const cropDatabase = {
//   'Maharashtra': [
//     {
//       id: '1',
//       name: 'Cotton',
//       description: 'Major cash crop in Maharashtra with strong market demand both domestically and internationally.',
//       suitabilityScore: 87,
//       marketTrend: 'rising',
//       marketPriceChange: 8.5,
//       estimatedROI: 25,
//       growingSeason: 'Kharif (Monsoon)',
//       waterRequirement: 'medium',
//       soilType: ['Black Cotton Soil', 'Alluvial'],
//       harvestTime: '6-8 months'
//     },
//     {
//       id: '2',
//       name: 'Soybean',
//       description: 'Excellent rotation crop that improves soil fertility and has strong demand for oil production.',
//       suitabilityScore: 82,
//       marketTrend: 'stable',
//       marketPriceChange: 3.2,
//       estimatedROI: 18,
//       growingSeason: 'Kharif (Monsoon)',
//       waterRequirement: 'medium',
//       soilType: ['Well-drained loamy', 'Medium black'],
//       harvestTime: '3-4 months'
//     },
//     {
//       id: '3',
//       name: 'Sugarcane',
//       description: 'High-value perennial crop with stable demand from Maharashtra\'s strong sugar industry.',
//       suitabilityScore: 79,
//       marketTrend: 'stable',
//       marketPriceChange: 2.1,
//       estimatedROI: 22,
//       growingSeason: 'Year-round',
//       waterRequirement: 'high',
//       soilType: ['Alluvial', 'Deep Loamy'],
//       harvestTime: '12-18 months'
//     },
//     {
//       id: '4',
//       name: 'Turmeric',
//       description: 'Specialty crop with increasing demand for culinary and medicinal uses both locally and abroad.',
//       suitabilityScore: 75,
//       marketTrend: 'rising',
//       marketPriceChange: 12.5,
//       estimatedROI: 28,
//       growingSeason: 'Kharif (Monsoon)',
//       waterRequirement: 'medium',
//       soilType: ['Sandy Loam', 'Red Soil'],
//       harvestTime: '8-9 months'
//     },
//     {
//       id: '5',
//       name: 'Pomegranate',
//       description: 'Drought-resistant fruit crop with excellent export potential and high market value.',
//       suitabilityScore: 72,
//       marketTrend: 'rising',
//       marketPriceChange: 7.8,
//       estimatedROI: 35,
//       growingSeason: 'Year-round',
//       waterRequirement: 'low',
//       soilType: ['Sandy Loam', 'Medium Black'],
//       harvestTime: 'Year-round (3 crops/2 years)'
//     }
//   ],
//   'Punjab': [
//     {
//       id: '1',
//       name: 'Wheat',
//       description: 'Principal rabi crop in Punjab with established procurement system and MSP support.',
//       suitabilityScore: 92,
//       marketTrend: 'stable',
//       marketPriceChange: 4.2,
//       estimatedROI: 15,
//       growingSeason: 'Rabi (Winter)',
//       waterRequirement: 'medium',
//       soilType: ['Loamy', 'Clay Loam'],
//       harvestTime: '4-5 months'
//     },
//     {
//       id: '2',
//       name: 'Rice (Paddy)',
//       description: 'Major kharif crop with guaranteed procurement; however, concerns about water table depletion exist.',
//       suitabilityScore: 88,
//       marketTrend: 'stable',
//       marketPriceChange: 2.8,
//       estimatedROI: 20,
//       growingSeason: 'Kharif (Monsoon)',
//       waterRequirement: 'high',
//       soilType: ['Clay', 'Clay Loam'],
//       harvestTime: '4-5 months'
//     },
//     {
//       id: '3',
//       name: 'Maize',
//       description: 'Emerging as an alternative to rice with lower water requirements and growing demand.',
//       suitabilityScore: 82,
//       marketTrend: 'rising',
//       marketPriceChange: 6.5,
//       estimatedROI: 22,
//       growingSeason: 'Kharif & Spring',
//       waterRequirement: 'medium',
//       soilType: ['Well-drained Loamy', 'Sandy Loam'],
//       harvestTime: '3-4 months'
//     },
//     {
//       id: '4',
//       name: 'Mustard',
//       description: 'Important oilseed crop that fits well in wheat rotation with minimal water requirements.',
//       suitabilityScore: 78,
//       marketTrend: 'rising',
//       marketPriceChange: 9.2,
//       estimatedROI: 25,
//       growingSeason: 'Rabi (Winter)',
//       waterRequirement: 'low',
//       soilType: ['Sandy Loam', 'Loamy'],
//       harvestTime: '4-5 months'
//     },
//     {
//       id: '5',
//       name: 'Potato',
//       description: 'High-value vegetable crop with established processing industry in the region.',
//       suitabilityScore: 76,
//       marketTrend: 'stable',
//       marketPriceChange: 5.5,
//       estimatedROI: 30,
//       growingSeason: 'Rabi (Winter)',
//       waterRequirement: 'medium',
//       soilType: ['Sandy Loam', 'Loamy'],
//       harvestTime: '3-4 months'
//     }
//   ],
//   'default': [
//     {
//       id: '1',
//       name: 'Rice',
//       description: 'Staple crop cultivated throughout India, especially in regions with good rainfall or irrigation.',
//       suitabilityScore: 85,
//       marketTrend: 'stable',
//       marketPriceChange: 3.2,
//       estimatedROI: 18,
//       growingSeason: 'Kharif (Monsoon)',
//       waterRequirement: 'high',
//       soilType: ['Clay', 'Clay Loam'],
//       harvestTime: '3-6 months'
//     },
//     {
//       id: '2',
//       name: 'Pulses (Mixed)',
//       description: 'Nitrogen-fixing crops that improve soil health while providing protein-rich produce with stable demand.',
//       suitabilityScore: 80,
//       marketTrend: 'rising',
//       marketPriceChange: 7.5,
//       estimatedROI: 20,
//       growingSeason: 'Various seasons',
//       waterRequirement: 'low',
//       soilType: ['Sandy Loam', 'Medium Black'],
//       harvestTime: '3-4 months'
//     },
//     {
//       id: '3',
//       name: 'Millets',
//       description: 'Drought-resistant, nutritious grains experiencing renewed market interest due to health benefits.',
//       suitabilityScore: 78,
//       marketTrend: 'rising',
//       marketPriceChange: 12.8,
//       estimatedROI: 22,
//       growingSeason: 'Kharif (Monsoon)',
//       waterRequirement: 'low',
//       soilType: ['Red', 'Gravelly', 'Sandy Loam'],
//       harvestTime: '3-4 months'
//     },
//     {
//       id: '4',
//       name: 'Maize',
//       description: 'Versatile crop with applications in food, feed, and industrial sectors with growing demand.',
//       suitabilityScore: 75,
//       marketTrend: 'stable',
//       marketPriceChange: 4.5,
//       estimatedROI: 15,
//       growingSeason: 'Year-round',
//       waterRequirement: 'medium',
//       soilType: ['Well-drained Loamy', 'Sandy Loam'],
//       harvestTime: '3-4 months'
//     },
//     {
//       id: '5',
//       name: 'Oilseeds (Mixed)',
//       description: 'Important for food security and reducing oil imports with government support programs.',
//       suitabilityScore: 72,
//       marketTrend: 'rising',
//       marketPriceChange: 6.8,
//       estimatedROI: 18,
//       growingSeason: 'Various seasons',
//       waterRequirement: 'medium',
//       soilType: ['Sandy Loam', 'Medium Black'],
//       harvestTime: '3-5 months'
//     }
//   ]
// };

// Function to get crop recommendations based on location (commented out as in original)
// export const getCropRecommendations = (state, district) => {
//   if (state in cropDatabase) {
//     return cropDatabase[state];
//   }
//   return cropDatabase['default'];
// };

// Function to analyze market trends
export const analyzeMarketTrends = (cropId, state) => {
    return {
        currentPrice: Math.floor(Math.random() * 50) + 50,
        projectedChange: Math.floor(Math.random() * 20) - 5,
        seasonalFactors: Math.random() > 0.5 ? 'Favorable' : 'Neutral',
        supplyOutlook: Math.random() > 0.7 ? 'Surplus Expected' : 'Balanced',
        exportDemand: Math.random() > 0.6 ? 'Strong' : 'Moderate'
    };
};