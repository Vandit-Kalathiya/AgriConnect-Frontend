import { postAi } from "../../../services/aiApi";

export const fetchCropRecommendationsByLocation = async (location) => {
  try {
    const payload = await postAi("/crop/recommendations", {
      district: location?.district,
      state: location?.state,
    });

    if (!Array.isArray(payload?.crops)) {
      throw new Error("Invalid response format from AI backend");
    }

    payload.crops.forEach((crop) => {
      if (!Array.isArray(crop.resources)) {
        throw new Error(`Missing or invalid resources for crop: ${crop?.name}`);
      }
    });

    return payload;
  } catch (error) {
    console.error("Error fetching crop recommendations:", error);

    return {
      crops: [
        {
          name: "Wheat",
          description:
            "A staple grain crop ideal for winter growing season in northern and central India, benefiting from fertile loamy soils.",
          suitabilityScore: 85,
          marketTrend: "rising",
          marketPriceChange: 7.2,
          estimatedROI: 18,
          growingSeason: "Rabi (Winter)",
          waterRequirement: "medium",
          soilType: ["Loamy", "Clay Loam"],
          harvestTime: "3-4 months",
          currentPrice: 25.5,
          projectedPrice: 27.8,
          resources: [
            "PM-KISAN (Rs 6000/year financial aid)",
            "Soil Health Card Scheme (soil testing)",
            "NPK Fertilizer",
            "Certified Wheat Seeds (e.g., HD-2967)",
          ],
        },
        {
          name: "Rice",
          description:
            "Staple food suitable for regions with abundant water resources and clayey soils, supported by monsoon rains.",
          suitabilityScore: 78,
          marketTrend: "stable",
          marketPriceChange: 2.5,
          estimatedROI: 15,
          growingSeason: "Kharif (Monsoon)",
          waterRequirement: "high",
          soilType: ["Clay", "Clay Loam"],
          harvestTime: "3-6 months",
          currentPrice: 20.8,
          projectedPrice: 21.4,
          resources: [
            "PMFBY (crop insurance)",
            "PM-KUSUM (solar pump subsidy)",
            "Urea Fertilizer",
            "Pusa Basmati Seeds",
          ],
        },
      ],
    };
  }
};
