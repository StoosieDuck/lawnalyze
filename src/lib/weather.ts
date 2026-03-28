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

/**
 * Map WMO weather codes to human-readable conditions.
 * https://open-meteo.com/en/docs → "WMO Weather interpretation codes"
 */
function wmoToCondition(code: number): string {
  if (code === 0) return 'Clear';
  if (code === 1) return 'Mainly Clear';
  if (code === 2) return 'Partly Cloudy';
  if (code === 3) return 'Overcast';
  if (code <= 48) return 'Foggy';
  if (code <= 55) return 'Drizzle';
  if (code <= 57) return 'Freezing Drizzle';
  if (code <= 65) return 'Rain';
  if (code <= 67) return 'Freezing Rain';
  if (code <= 75) return 'Snowfall';
  if (code === 77) return 'Snow Grains';
  if (code <= 82) return 'Rain Showers';
  if (code <= 86) return 'Snow Showers';
  if (code === 95) return 'Thunderstorm';
  if (code >= 96) return 'Thunderstorm w/ Hail';
  return 'Cloudy';
}

/**
 * Fetch a 7-day forecast from Open-Meteo for the given coordinates.
 * Falls back to Mountain View, CA if no coords provided.
 *
 * Key choices for accuracy matching Google Weather:
 *  - `models=gfs_seamless` — GFS is the same base model Google uses
 *  - `precipitation_unit=inch` — display-friendly for US
 *  - `timezone=auto` — server picks the right zone for the coords
 */
export async function fetchWeekForecast(
  lat?: number,
  lon?: number
): Promise<DayForecast[]> {
  const useLat = lat ?? 37.3861;
  const useLon = lon ?? -122.0839;

  const params = new URLSearchParams({
    latitude: String(useLat),
    longitude: String(useLon),
    daily: [
      'temperature_2m_max',
      'temperature_2m_min',
      'precipitation_sum',
      'precipitation_probability_max',
      'weather_code',
    ].join(','),
    temperature_unit: 'fahrenheit',
    precipitation_unit: 'inch',
    timezone: 'auto',
    forecast_days: '7',
    models: 'gfs_seamless',
  });

  const url = `https://api.open-meteo.com/v1/forecast?${params}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Open-Meteo HTTP ${res.status}`);

  const data = await res.json();
  const d = data.daily;

  const forecasts: DayForecast[] = [];
  for (let i = 0; i < d.time.length; i++) {
    // Parse the date in the API's own timezone to avoid day-shift bugs.
    // d.time[i] is "YYYY-MM-DD". We extract parts directly.
    const [y, m, day] = d.time[i].split('-').map(Number);
    const dateObj = new Date(y, m - 1, day); // local Date
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    forecasts.push({
      day: dayNames[dateObj.getDay()],
      date: day,
      dateISO: d.time[i],
      tempHigh: Math.round(d.temperature_2m_max[i]),
      tempLow: Math.round(d.temperature_2m_min[i]),
      rainChance: Math.round(d.precipitation_probability_max[i] ?? 0),
      precipIn: +(d.precipitation_sum[i] ?? 0).toFixed(2),
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
