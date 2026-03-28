/**
 * Central EPA WaterSense Calculation Engine
 * Single source of truth for all water usage numbers across the app.
 *
 * Formula: (ETo × PlantFactor × Area × 0.62) / IrrigationEfficiency
 *   ETo = city-specific evapotranspiration rate (inches/week, peak summer)
 *   PlantFactor = 0.8 (cool-season turf grass)
 *   0.62 = conversion factor (inches × sq ft → gallons)
 *   IrrigationEfficiency = 0.65 (standard pop-up sprinkler)
 */

const CITY_ETO_MAP: Record<string, number> = {
  "Los Angeles": 1.4,
  "San Diego": 1.2,
  "San Francisco": 1.1,
  "San Jose": 1.3,
  "Sacramento": 1.7,
  "Fresno": 1.8,
  "Bakersfield": 1.8,
  "Palm Springs": 2.1,
  "Las Vegas": 2.2,
  "Phoenix": 2.2,
  "Austin": 1.6,
  "Dallas": 1.6,
  "Miami": 1.2,
  "Seattle": 1.0,
  "Denver": 1.5,
  default: 1.4,
};

const PLANT_FACTOR = 0.8;
const IRRIGATION_EFFICIENCY = 0.65;
const CONVERSION_FACTOR = 0.62;

export function getEtoForCity(city?: string): { eto: number; cityName: string } {
  const match =
    Object.keys(CITY_ETO_MAP).find(
      (c) => c !== "default" && city?.toLowerCase().includes(c.toLowerCase())
    ) || "default";
  return { eto: CITY_ETO_MAP[match], cityName: match === "default" ? "Average US" : match };
}

export function calculateGallonsPerWeek(sqft: number, city?: string): number {
  if (!sqft) return 0;
  const { eto } = getEtoForCity(city);
  return Math.round((eto * PLANT_FACTOR * sqft * CONVERSION_FACTOR) / IRRIGATION_EFFICIENCY);
}

export { CITY_ETO_MAP, PLANT_FACTOR, IRRIGATION_EFFICIENCY, CONVERSION_FACTOR };
