import axios from 'axios';

// This service handles all Gemini API interactions
class GeminiApiService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://generativelanguage.googleapis.com/v1/models';
        this.model = 'gemini-pro';
    }

    // Fetch market data for crops
    async getMarketData(crop = null) {
        const prompt = crop
            ? `Provide detailed market data for ${crop} including current prices, trends, and regional variations in Indian markets.`
            : `Provide detailed market data for top 10 agricultural crops in India with their current prices, trends, and regional variations.`;

        return this.generateContent(prompt);
    }

    // Get price forecast for a specific crop
    async getPriceForecast(crop, months = 12) {
        const prompt = `Provide a detailed price forecast analysis for ${crop} in Indian markets for the next ${months} months. Include expected price ranges, factors affecting prices, and market trends.`;

        return this.generateContent(prompt);
    }

    // Get historical price data
    async getHistoricalData(crop, months = 6) {
        const prompt = `Provide historical price data for ${crop} in Indian markets over the past ${months} months. Include monthly average prices, high/low prices, and trend analysis.`;

        return this.generateContent(prompt);
    }

    // Get crop recommendations based on current market conditions
    async getCropRecommendations(region = null) {
        const prompt = region
            ? `Recommend the top 5 most profitable crops to grow in ${region}, India based on current market trends, expected harvest prices, and growth duration. Include expected profit margins and growth duration.`
            : `Recommend the top 5 most profitable crops to grow in India based on current market trends, expected harvest prices, and growth duration. Include expected profit margins and growth duration for different regions of India.`;

        return this.generateContent(prompt);
    }

    // Get detailed information about a specific crop
    async getCropDetails(crop) {
        const prompt = `Provide detailed information about ${crop} including growing conditions, care requirements, common varieties in India, typical yield per hectare, and market value.`;

        return this.generateContent(prompt);
    }

    // Core method to communicate with Gemini API
    async generateContent(prompt) {
        try {
            const response = await axios.post(
                `${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`,
                {
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
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 8192,
                    }
                }
            );

            // Process and format the response data
            return this.processApiResponse(response.data, prompt);
        } catch (error) {
            console.error('Error calling Gemini API:', error);
            throw new Error('Failed to fetch data from Gemini API');
        }
    }

    // Process and structure the API response
    processApiResponse(response, prompt) {
        try {
            // Extract the text content from the response
            const text = response.candidates[0].content.parts[0].text;

            // Different parsing logic based on the type of prompt
            if (prompt.includes('market data')) {
                return this.parseMarketData(text);
            } else if (prompt.includes('forecast')) {
                return this.parseForecastData(text);
            } else if (prompt.includes('historical')) {
                return this.parseHistoricalData(text);
            } else if (prompt.includes('recommend')) {
                return this.parseRecommendations(text);
            } else if (prompt.includes('information about')) {
                return this.parseCropDetails(text);
            }

            // Fallback: return the raw text if no specific parsing applies
            return { rawData: text };
        } catch (error) {
            console.error('Error processing API response:', error);
            throw new Error('Failed to process data from Gemini API');
        }
    }

    // Parse market data response
    parseMarketData(text) {
        // This is a placeholder for the actual parsing logic
        // In a real implementation, this would use regex or other parsing techniques
        // to extract structured data from the text response

        // For demo purposes, we'll return mock structured data
        const mockCrops = ['Rice', 'Wheat', 'Potato', 'Onion', 'Tomato', 'Cotton', 'Sugarcane', 'Maize', 'Soybean', 'Mustard'];

        return mockCrops.map(crop => ({
            crop,
            prices: {
                kgPrice: `₹${(Math.random() * 50 + 10).toFixed(2)}`,
                tenKgPrice: `₹${(Math.random() * 500 + 100).toFixed(1)}`,
                quintalPrice: `₹${(Math.random() * 5000 + 1000).toFixed(1)}`,
                tonPrice: `₹${(Math.random() * 50000 + 10000).toFixed(1)}`,
                averageMarketPrice: `₹${(Math.random() * 5000 + 1000).toFixed(0)} / Quintal`,
                bestMarketPrice: `₹${(Math.random() * 7000 + 3000).toFixed(0)} / Quintal`,
                lowestMarketPrice: `₹${(Math.random() * 3000 + 1000).toFixed(0)} / Quintal`,
                bestPriceMarket: this.getRandomMarket(),
                lowestPriceMarket: this.getRandomMarket(),
                marketPrices: this.generateRandomMarketPrices(),
            },
            summary: `As per the current market rates, the maximum price of ${crop} is ₹${(Math.random() * 7000 + 3000).toFixed(0)} per Quintal, whereas the minimum rate is ₹${(Math.random() * 3000 + 1000).toFixed(0)} per Quintal across varieties. The average price is ₹${(Math.random() * 5000 + 1000).toFixed(0)} per Quintal across varieties.`,
            trend: `${(Math.random() > 0.5 ? '+' : '-')}${(Math.random() * 10).toFixed(1)}%`,
            trendUp: Math.random() > 0.5,
        }));
    }

    // Parse forecast data response
    parseForecastData(text) {
        // Mock forecast data for demo
        const months = ['April', 'May', 'June', 'July', 'August', 'September',
            'October', 'November', 'December', 'January', 'February', 'March'];

        return {
            forecastData: months.map((month, index) => ({
                month,
                expectedPrice: (Math.random() * 5000 + 1000).toFixed(0),
                highEstimate: (Math.random() * 6000 + 2000).toFixed(0),
                lowEstimate: (Math.random() * 4000 + 800).toFixed(0),
                confidence: (Math.random() * 30 + 70).toFixed(0) + '%',
            })),
            factors: [
                'Seasonal demand variations',
                'Expected rainfall patterns',
                'Government policies and MSP',
                'International market trends',
                'Production estimates',
            ],
            summary: 'Prices are expected to follow a seasonal pattern with peaks during shortage periods and troughs during harvest season. Overall trend indicates a moderate increase over the next year.'
        };
    }

    // Parse historical data response
    parseHistoricalData(text) {
        // Mock historical data for demo
        const pastMonths = ['October', 'November', 'December', 'January', 'February', 'March'];

        return {
            historicalData: pastMonths.map((month, index) => ({
                month,
                averagePrice: (Math.random() * 5000 + 1000).toFixed(0),
                highPrice: (Math.random() * 6000 + 2000).toFixed(0),
                lowPrice: (Math.random() * 4000 + 800).toFixed(0),
                volumeTraded: (Math.random() * 10000 + 5000).toFixed(0) + ' quintals',
            })),
            trendSummary: 'Prices have shown a steady increase over the past 6 months with seasonal variations. The highest prices were observed during the off-season months.'
        };
    }

    // Parse crop recommendations response
    parseRecommendations(text) {
        // Mock recommendations data for demo
        return {
            recommendations: [
                {
                    crop: 'Soybean',
                    profitMargin: '45-60%',
                    growthDuration: '90-120 days',
                    investmentPerAcre: '₹15,000 - ₹20,000',
                    expectedReturns: '₹35,000 - ₹45,000',
                    bestRegions: ['Madhya Pradesh', 'Maharashtra', 'Rajasthan'],
                    reasonForRecommendation: 'High market demand, favorable MSP, and drought resistance make it a profitable option for the upcoming season.'
                },
                {
                    crop: 'Turmeric',
                    profitMargin: '70-90%',
                    growthDuration: '8-9 months',
                    investmentPerAcre: '₹60,000 - ₹70,000',
                    expectedReturns: '₹120,000 - ₹150,000',
                    bestRegions: ['Andhra Pradesh', 'Tamil Nadu', 'Telangana'],
                    reasonForRecommendation: 'Export demand is high, prices are expected to rise, and the crop is less susceptible to pests.'
                },
                {
                    crop: 'Green Peas',
                    profitMargin: '50-65%',
                    growthDuration: '60-90 days',
                    investmentPerAcre: '₹25,000 - ₹30,000',
                    expectedReturns: '₹45,000 - ₹60,000',
                    bestRegions: ['Uttar Pradesh', 'Haryana', 'Punjab'],
                    reasonForRecommendation: 'Short duration crop with good returns, fits well in crop rotation systems.'
                },
                {
                    crop: 'Mustard',
                    profitMargin: '40-55%',
                    growthDuration: '110-150 days',
                    investmentPerAcre: '₹12,000 - ₹15,000',
                    expectedReturns: '₹28,000 - ₹35,000',
                    bestRegions: ['Rajasthan', 'Haryana', 'Uttar Pradesh'],
                    reasonForRecommendation: 'Government support through MSP, low water requirement, and consistent market demand.'
                },
                {
                    crop: 'Strawberry',
                    profitMargin: '100-150%',
                    growthDuration: '5-6 months',
                    investmentPerAcre: '₹200,000 - ₹250,000',
                    expectedReturns: '₹500,000 - ₹700,000',
                    bestRegions: ['Maharashtra', 'Himachal Pradesh', 'Uttarakhand'],
                    reasonForRecommendation: 'High-value crop with excellent returns, growing urban demand, and potential for value addition.'
                }
            ],
            seasonalFactors: 'Consider the upcoming monsoon season while planning crop selection. Crops requiring less water might be more suitable if rainfall predictions are below average.',
            marketTrends: 'Export-oriented crops and pulses are showing strong price trends due to global supply shortages. Organic produce continues to command premium prices in urban markets.'
        };
    }

    // Parse crop details response
    parseCropDetails(text) {
        // Mock crop details for demo
        return {
            varieties: ['IR-36', 'Pusa Basmati', 'Sona Masuri', 'HMT'],
            growingConditions: 'Requires temperatures between 20-35°C, high humidity, and adequate water supply. Thrives in alluvial soils with good water retention.',
            careRequirements: 'Regular irrigation, fertilization with emphasis on nitrogen, and careful pest management, especially for stem borers and blast disease.',
            typicalYield: '25-30 quintals per acre under normal conditions, up to 40 quintals with optimal practices',
            growingRegions: ['West Bengal', 'Punjab', 'Haryana', 'Uttar Pradesh', 'Andhra Pradesh', 'Tamil Nadu'],
            cropCycle: 'Typically 120-150 days from sowing to harvest, depending on variety',
            waterRequirements: 'High - requires standing water during critical growth phases',
            pestDiseases: ['Rice blast', 'Bacterial leaf blight', 'Stem borer', 'Brown plant hopper'],
            storageGuidelines: 'Store in moisture-proof bags in cool, dry conditions. Ideal moisture content for storage is 12-14%.',
            valueAddition: 'Can be processed into rice flour, rice bran oil, puffed rice, and various ready-to-eat products for higher returns'
        };
    }

    // Helper methods for generating mock data
    getRandomMarket() {
        const markets = [
            'Delhi', 'Mumbai', 'Kolkata', 'Chennai', 'Bangalore',
            'Hyderabad', 'Lucknow', 'Patna', 'Jaipur', 'Bhopal',
            'Chandigarh', 'Ahmedabad', 'Kochi', 'Guwahati', 'Shimla'
        ];
        return markets[Math.floor(Math.random() * markets.length)];
    }

    generateRandomMarketPrices() {
        const states = [
            'Andhra Pradesh', 'Bihar', 'Chhattisgarh', 'Gujarat', 'Haryana',
            'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Punjab',
            'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal'
        ];

        const prices = {};
        states.forEach(state => {
            prices[state] = `₹${(Math.random() * 4000 + 1000).toFixed(0)}`;
        });

        return prices;
    }
}

export default GeminiApiService;