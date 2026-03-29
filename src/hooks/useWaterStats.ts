import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { calculateDynamicWaterStats, type WaterStats } from '../lib/waterMath';

export function useWaterStats() {
  const { lawnAreaSqFt, location } = useStore();
  const [stats, setStats] = useState<WaterStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const lat = location?.coords?.[0];
    const lon = location?.coords?.[1];

    calculateDynamicWaterStats(lawnAreaSqFt, lat, lon, location?.city)
      .then((data) => {
        if (isMounted) {
          setStats(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [lawnAreaSqFt, location?.city, location?.coords?.[0], location?.coords?.[1]]);

  return { stats, loading, error };
}
