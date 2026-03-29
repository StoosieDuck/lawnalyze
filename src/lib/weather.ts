/**
 * Weather Service — powered by Open-Meteo (free, no API key)
 * https://open-meteo.com/
 *
 * Fetches a real 7-day forecast for a given lat/lon and returns
 * a simplified array the Schedule component can consume directly.
 *
 * Uses the GFS Seamless model for accuracy closer to Google Weather,
 * with `precipitation_probability_mean` via hourly aggregation.
 */

export interface DayForecast {
  /** Short day name, e.g. "Mon" */
  day: string;
  /** Day of month */
  date: number;
  /** Full date string, e.g. "2026-03-29" */
  dateISO: string;
  /** High temperature in °F */
  tempHigh: number;
  /** Low temperature in °F */
  tempLow: number;
  /** Precipitation probability 0-100 (daily max) */
  rainChance: number;
  /** Total precipitation in inches */
  precipIn: number;
  /** WMO weather code (used to pick an icon) */
  weatherCode: number;
  /** Human-readable condition */
  condition: string;
}


export async function fetchWeekForecast(
  lat?: number,
  lon?: number
): Promise<DayForecast[]> {
  const useLat = lat ?? 37.3861;
  const useLon = lon ?? -122.0839;

  // 1) Get local gridpoint from NWS API for these coordinates
  const pRes = await fetch(`https://api.weather.gov/points/${useLat},${useLon}`, {
     headers: { 'User-Agent': 'Lawnalyze (contact@lawnalyze.app)' }
  });
  if (!pRes.ok) throw new Error(`NWS Check HTTP ${pRes.status}`);
  const pData = await pRes.json();
  const forecastUrl = pData.properties.forecast;

  // 2) Get full 7-day text/temperature forecast
  const fRes = await fetch(forecastUrl, {
     headers: { 'User-Agent': 'Lawnalyze (contact@lawnalyze.app)' }
  });
  if (!fRes.ok) throw new Error(`NWS Forecast HTTP ${fRes.status}`);
  const fData = await fRes.json();
  
  const forecasts: DayForecast[] = [];
  const periods = fData.properties.periods;

  // We need to pair Day and Night periods to get High/Low and total precip chances.
  for (let i = 0; i < periods.length; i += 2) {
    const dayPeriod = periods[i];
    // If we start the array at night (isDaytime is false), skip it so we align properly.
    if (!dayPeriod.isDaytime && i === 0) {
      i -= 1; // Slide indices so the loop parses Day as the first element.
      continue;
    }
    
    const nightPeriod = periods[i + 1] || dayPeriod; // Fallback if no night

    // Date parsing
    const dateObj = new Date(dayPeriod.startTime);
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Sometimes NWS puts 'Chance of Rain 50%' in Detailed Forecast.
    const mergedForecast = (dayPeriod.detailedForecast + ' ' + nightPeriod.detailedForecast).toLowerCase();
    
    // Build weather code
    let weatherCode = 0; // default mostly clear
    if (mergedForecast.includes('thunder')) weatherCode = 95;
    else if (mergedForecast.includes('snow')) weatherCode = 71;
    else if (mergedForecast.includes('rain') || mergedForecast.includes('showers')) weatherCode = 61;
    else if (mergedForecast.includes('cloudy')) weatherCode = 3;

    forecasts.push({
      day: dayNames[dateObj.getDay()],
      date: dateObj.getDate(),
      dateISO: dayPeriod.startTime.split('T')[0],
      tempHigh: dayPeriod.temperature,
      tempLow: nightPeriod.temperature,
      rainChance: Math.max(
        dayPeriod.probabilityOfPrecipitation?.value || 0,
        nightPeriod.probabilityOfPrecipitation?.value || 0
      ),
      // Basic heuristic for typical US rain events since basic forecast endpoint omits exact accumulation
      precipIn: mergedForecast.includes('heavy rain') ? 0.35 : (mergedForecast.includes('rain') ? 0.05 : 0),
      weatherCode,
      condition: dayPeriod.shortForecast || 'Clear',
    });
    
    if (forecasts.length >= 7) break;
  }

  return forecasts;
}

/**
 * Best-Day Selection Algorithm
 *
 * Score = tempHigh × (1 - rainChance/100)
 *   → Hottest day with least rain = highest score
 *   → Ensures deep watering when the lawn needs it most
 */
export function findBestWateringDay(forecast: DayForecast[]): number {
  let bestIdx = 0;
  let bestScore = -1;
  forecast.forEach((day, idx) => {
    const score = day.tempHigh * (1 - day.rainChance / 100);
    if (score > bestScore) {
      bestScore = score;
      bestIdx = idx;
    }
  });
  return bestIdx;
}
