/**
 * Central EPA WaterSense Calculation Engine
 * Single source of truth for all water usage numbers across the app.
 *
 * Formula: (ETo_Net × Area × 0.62) / IrrigationEfficiency
 *   ETo_Net = Max(0, Sum_ETo_7d - Sum_Rain_7d)
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
  "Miami": 1.3,
  "Seattle": 1.4,
  "Washington": 1.4,
  "Denver": 1.6,
  "New York": 1.1,
  "Chicago": 1.2,
  "Houston": 1.5,
  "Atlanta": 1.4,
  default: 1.4,
};

export const PLANT_FACTOR = 0.8; // Standard cool-season grass factor
export const IRRIGATION_EFFICIENCY = 0.65;
export const CONVERSION_FACTOR = 0.62;

export interface WaterStats {
  eto: number;
  rain: number;
  netInches: number;
  gallons: number;
  cityName: string;
  isLive: boolean;
}

export function getStaticEto(city?: string): { eto: number; cityName: string } {
  if (!city) return { eto: CITY_ETO_MAP.default, cityName: "Average US" };
  const match = Object.keys(CITY_ETO_MAP).find(
    (c) => c !== "default" && city.toLowerCase().includes(c.toLowerCase())
  );
  return { 
    eto: match ? CITY_ETO_MAP[match] : CITY_ETO_MAP.default, 
    cityName: match || city 
  };
}

/**
 * Fetches the last 7 days of ET0 and Precipitation from Open-Meteo.
 */
export async function calculateDynamicWaterStats(
  sqft: number, 
  lat?: number, 
  lon?: number, 
  city?: string
): Promise<WaterStats> {
  if (!sqft) return { eto: 0, rain: 0, netInches: 0, gallons: 0, cityName: city || 'Unset', isLive: false };

  // Fallback static data
  const staticData = getStaticEto(city);
  if (lat && lon) {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=et0_fao_evapotranspiration,precipitation_sum&timezone=auto&past_days=7`
      );
      const data = await response.json();
      
      if (data.daily) {
        // We sum the ET0 and Rain for the LAST 7 DAYS (past_days=7 means today + past 7)
        // This calculates the "Water Debt" the lawn currently has.
        const etoSum = (data.daily.et0_fao_evapotranspiration as number[]).reduce((a, b) => a + (b || 0), 0);
        const rainSum = (data.daily.precipitation_sum as number[]).reduce((a, b) => a + (b || 0), 0);
        
        // Convert mm to inches (Open-Meteo defaults to mm for ET0 and Precipitation)
        const etoInches = (etoSum / 25.4);
        const rainInches = (rainSum / 25.4);
        
        const netInches = Math.max(0, etoInches - rainInches);
        const gallons = Math.round((netInches * PLANT_FACTOR * sqft * CONVERSION_FACTOR) / IRRIGATION_EFFICIENCY);

        return {
          eto: +etoInches.toFixed(2),
          rain: +rainInches.toFixed(2),
          netInches: +netInches.toFixed(2),
          gallons,
          cityName: city || 'Local Area',
          isLive: true
        };
      }
    } catch (e) {
      console.error("Failed to fetch live climate data, using static fallback:", e);
    }
  }

  // Final fallback to static map
  const gallons = Math.round((staticData.eto * PLANT_FACTOR * sqft * CONVERSION_FACTOR) / IRRIGATION_EFFICIENCY);
  return {
    eto: staticData.eto,
    rain: 0,
    netInches: staticData.eto,
    gallons,
    cityName: staticData.cityName,
    isLive: false
  };
}
