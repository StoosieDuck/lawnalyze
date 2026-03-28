/**
 * Weather Service — powered by Open-Meteo (free, no API key)
 * https://open-meteo.com/
 *
 * Fetches a real 7-day forecast for a given lat/lon and returns
 * a simplified array the Schedule component can consume directly.
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
  /** Precipitation probability 0-100 */
  rainChance: number;
  /** Total precipitation in mm */
  precipMm: number;
  /** WMO weather code (used to pick an icon) */
  weatherCode: number;
  /** Human-readable condition */
  condition: string;
}

/**
 * Map WMO weather codes to human-readable conditions.
 * https://open-meteo.com/en/docs → "WMO Weather interpretation codes"
 */
function wmoToCondition(code: number): string {
  if (code === 0) return 'Clear Sky';
  if (code <= 3) return 'Partly Cloudy';
  if (code <= 48) return 'Foggy';
  if (code <= 57) return 'Drizzle';
  if (code <= 67) return 'Rain';
  if (code <= 77) return 'Snow';
  if (code <= 82) return 'Showers';
  if (code <= 86) return 'Snow Showers';
  if (code >= 95) return 'Thunderstorm';
  return 'Cloudy';
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Fetch a 7-day forecast from Open-Meteo for the given coordinates.
 * Falls back to Los Angeles (34.05, -118.24) if no coords provided.
 */
export async function fetchWeekForecast(
  lat?: number,
  lon?: number
): Promise<DayForecast[]> {
  const useLat = lat ?? 34.0522;
  const useLon = lon ?? -118.2437;

  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${useLat}&longitude=${useLon}` +
    `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,weather_code` +
    `&temperature_unit=fahrenheit` +
    `&timezone=auto` +
    `&forecast_days=7`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Open-Meteo HTTP ${res.status}`);

  const data = await res.json();
  const d = data.daily;

  const forecasts: DayForecast[] = [];
  for (let i = 0; i < d.time.length; i++) {
    const dateObj = new Date(d.time[i] + 'T12:00:00'); // noon to avoid TZ edge
    forecasts.push({
      day: DAY_NAMES[dateObj.getDay()],
      date: dateObj.getDate(),
      dateISO: d.time[i],
      tempHigh: Math.round(d.temperature_2m_max[i]),
      tempLow: Math.round(d.temperature_2m_min[i]),
      rainChance: Math.round(d.precipitation_probability_max[i] ?? 0),
      precipMm: d.precipitation_sum[i] ?? 0,
      weatherCode: d.weather_code[i],
      condition: wmoToCondition(d.weather_code[i]),
    });
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
