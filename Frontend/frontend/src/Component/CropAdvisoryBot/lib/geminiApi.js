import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyDU7xQMNUiyJ9SEtvDQCd3jmpgfTGo9kg8");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export const generateCropRecommendations = async (location) => {
  try {
    console.log("Generating recommendations for:", location);

    const prompt = `You are an expert Indian agricultural advisor with deep knowledge of crops, soil conditions, weather patterns, market trends, and government schemes available in India as of March 2025.

Please recommend **as many diverse crops as possible** that would be most suitable for farmers in ${location.district}, ${location.state}, India based on:
1. Local soil types and conditions  
2. Typical climate and rainfall patterns in this region  
3. Current and projected market conditions  
4. Traditional and emerging crop options for this specific region  

Ensure you include a **wide variety of crops** from the following categories:  
- **Grains & Cereals** (e.g., wheat, rice, millet, maize, sorghum, barley, quinoa)  
- **Pulses & Legumes** (e.g., lentils, chickpeas, pigeon peas, black gram, green gram)  
- **Vegetables** (e.g., potatoes, onions, tomatoes, leafy greens, root vegetables)  
- **Fruits** (e.g., mango, guava, banana, citrus, pomegranate, grapes)  
- **Oilseeds** (e.g., mustard, sunflower, sesame, groundnut, soybean)  
- **Cash Crops** (e.g., cotton, sugarcane, tea, coffee, rubber)  
- **Dairy & Fodder Crops** (e.g., alfalfa, napier grass, maize for silage)  
- **Spices & Medicinal Crops** (e.g., turmeric, ginger, cardamom, ashwagandha, aloe vera)  

For **each crop**, provide:  
- **A brief description** of why it's suitable for this location  
- **Suitability score** (0-100)  
- **Current market trend** (rising, stable, or falling)  
- **Estimated market price change percentage**  
- **Estimated ROI percentage**  
- **Growing season** (Kharif/Monsoon, Rabi/Winter, Zaid/Summer, or Year-round)  
- **Water requirement** (low, medium, or high)  
- **Suitable soil types** (list 1-3 types)  
- **Typical harvest time in months**  
- **Current price per kg in INR** (realistic estimate)  
- **Projected price per kg at harvest time in INR** (realistic estimate)  
- **Suggested resources** (list 2-4 specific resources, including Indian government schemes active as of March 2025 that can support growing this crop, along with practical tools, seeds, or fertilizers)  

Include relevant government schemes such as **PM-KISAN, PMFBY (Pradhan Mantri Fasal Bima Yojana), PM-KUSUM, Soil Health Card Scheme**, or any other schemes active in 2025 that provide financial aid, insurance, irrigation support, or soil management benefits specific to the recommended crops and region.  

Format the response as a **structured JSON object matching this shape exactly**:  
{
  "crops": [
    {
      "name": "crop name",
      "description": "brief description",
      "suitabilityScore": 85,
      "marketTrend": "rising",
      "marketPriceChange": 7.2,
      "estimatedROI": 18,
      "growingSeason": "season",
      "waterRequirement": "medium",
      "soilType": ["type1", "type2"],
      "harvestTime": "3-4 months",
      "currentPrice": 25.5,
      "projectedPrice": 27.8,
      "resources": ["PM-KISAN", "NPK Fertilizer", "Certified Seeds", "Drip Irrigation"]
    }
  ]
}

Ensure **all crop types** are properly suggested and avoid recommending only fruits. Consider local agricultural practices, market opportunities, and practical resources available in India as of March 2025.`;



    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    console.log("Gemini API raw response:", responseText);

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse JSON from Gemini response");
    }

    const parsedData = JSON.parse(jsonMatch[0]);
    console.log("Parsed crop recommendations:", parsedData);

    if (!parsedData.crops || !Array.isArray(parsedData.crops)) {
      throw new Error("Invalid response format from Gemini API");
    }

    parsedData.crops.forEach((crop) => {
      if (!crop.resources || !Array.isArray(crop.resources)) {
        throw new Error(`Missing or invalid resources for crop: ${crop.name}`);
      }
    });

    return parsedData;
  } catch (error) {
    console.error("Error generating crop recommendations:", error);

    // Fallback data is commented out as in the original, but I've left it here for reference
    // return {
    //   crops: [
    //     {
    //       name: "Wheat",
    //       description: "A staple grain crop ideal for winter growing season in northern and central India, benefiting from fertile loamy soils.",
    //       suitabilityScore: 85,
    //       marketTrend: "rising",
    //       marketPriceChange: 7.2,
    //       estimatedROI: 18,
    //       growingSeason: "Rabi (Winter)",
    //       waterRequirement: "medium",
    //       soilType: ["Loamy", "Clay Loam"],
    //       harvestTime: "3-4 months",
    //       currentPrice: 25.5,
    //       projectedPrice: 27.8,
    //       resources: [
    //         "PM-KISAN (Rs 6000/year financial aid)",
    //         "Soil Health Card Scheme (soil testing)",
    //         "NPK Fertilizer",
    //         "Certified Wheat Seeds (e.g., HD-2967)",
    //       ],
    //     },
    //     {
    //       name: "Rice",
    //       description: "Staple food suitable for regions with abundant water resources and clayey soils, supported by monsoon rains.",
    //       suitabilityScore: 78,
    //       marketTrend: "stable",
    //       marketPriceChange: 2.5,
    //       estimatedROI: 15,
    //       growingSeason: "Kharif (Monsoon)",
    //       waterRequirement: "high",
    //       soilType: ["Clay", "Clay Loam"],
    //       harvestTime: "3-6 months",
    //       currentPrice: 20.8,
    //       projectedPrice: 21.4,
    //       resources: [
    //         "PMFBY (crop insurance)",
    //         "PM-KUSUM (solar pump subsidy)",
    //         "Urea Fertilizer",
    //         "Pusa Basmati Seeds",
    //       ],
    //     },
    //     {
    //       name: "Cotton",
    //       description: "Cash crop with strong market demand, suitable for regions with moderate water and black cotton soils.",
    //       suitabilityScore: 72,
    //       marketTrend: "rising",
    //       marketPriceChange: 5.8,
    //       estimatedROI: 22,
    //       growingSeason: "Kharif (Monsoon)",
    //       waterRequirement: "medium",
    //       soilType: ["Black Cotton Soil", "Alluvial"],
    //       harvestTime: "6-8 months",
    //       currentPrice: 75.0,
    //       projectedPrice: 80.5,
    //       resources: [
    //         "PM-KISAN (Rs 6000/year financial aid)",
    //         "PMFBY (crop insurance)",
    //         "Bt Cotton Seeds",
    //         "Sprinkler Irrigation",
    //       ],
    //     },
    //     {
    //       name: "Chickpeas",
    //       description: "Nitrogen-fixing legume that improves soil health, ideal for low-water regions with sandy loam soils.",
    //       suitabilityScore: 68,
    //       marketTrend: "stable",
    //       marketPriceChange: 1.2,
    //       estimatedROI: 12,
    //       growingSeason: "Rabi (Winter)",
    //       waterRequirement: "low",
    //       soilType: ["Sandy Loam", "Medium Black"],
    //       harvestTime: "3-4 months",
    //       currentPrice: 65.2,
    //       projectedPrice: 66.0,
    //       resources: [
    //         "Soil Health Card Scheme (soil testing)",
    //         "National Mission on Sustainable Agriculture (NMSA)",
    //         "Rhizobium Inoculant",
    //         "Kabuli Chana Seeds",
    //       ],
    //     },
    //     {
    //       name: "Sugarcane",
    //       description: "High-value perennial crop with consistent demand from the sugar industry, suited to water-rich alluvial soils.",
    //       suitabilityScore: 65,
    //       marketTrend: "stable",
    //       marketPriceChange: 0.5,
    //       estimatedROI: 20,
    //       growingSeason: "Year-round",
    //       waterRequirement: "high",
    //       soilType: ["Alluvial", "Deep Loamy"],
    //       harvestTime: "12-18 months",
    //       currentPrice: 3.5,
    //       projectedPrice: 3.6,
    //       resources: [
    //         "PM-KUSUM (solar pump subsidy)",
    //         "Agricultural Infrastructure Fund (AIF) (storage support)",
    //         "Potash Fertilizer",
    //         "Ratoon Manager",
    //       ],
    //     },
    //   ],
    // };
  }
};
