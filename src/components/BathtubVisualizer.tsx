import { motion } from 'framer-motion';

/**
 * WaterDropVisualizer
 *
 * Renders a large water-droplet silhouette that fills from the bottom up
 * based on how much water the user's lawn consumes relative to the national
 * average for a 5,000 sq ft lawn (~3,000 gal/week).
 *
 * Implementation notes:
 *  - Uses a single <svg> so the <clipPath> and the shapes that reference it
 *    share the same coordinate space (fixes Chrome/Safari rendering bugs).
 *  - The "liquid" is a <rect> that starts at y=24 (off-screen bottom) and
 *    animates upward. Because it sits inside a <g> clipped to the droplet
 *    path, only the portion inside the drop is visible.
 *  - A subtle second rect with lower opacity creates a "layered wave" look.
 */
export function WaterDropVisualizer({ gallons }: { gallons: number }) {
  // National average: a 5,000 sq ft lawn ≈ 3,000 gal/week (EPA baseline)
  const nationalAvg = 3000;
  const rawPercentage = Math.round((gallons / nationalAvg) * 100);
  const fillPercentage = Math.min(100, Math.max(0, rawPercentage));

  // The drop path spans roughly y 2.69 → 20.35 (≈17.66 units tall).
  // We map fillPercentage into that vertical range.
  const dropTop = 2.69;
  const dropBottom = 20.35;
  const dropHeight = dropBottom - dropTop;
  const liquidTop = dropBottom - (dropHeight * fillPercentage) / 100;

  // Pick a colour depending on severity
  const liquidColor =
    rawPercentage <= 50 ? '#22c55e' : rawPercentage <= 80 ? '#3b82f6' : '#ef4444';
  const liquidColorLight =
    rawPercentage <= 50 ? '#4ade80' : rawPercentage <= 80 ? '#60a5fa' : '#f87171';

  return (
    <div className="bg-surface-container text-on-surface rounded-[2rem] p-8 shadow-sm flex flex-col items-center justify-center min-h-[440px]">
      {/* Header text */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold font-heading mb-2">Usage vs National Average</h3>
        <p className="text-on-surface-variant font-medium">
          You use{' '}
          <strong style={{ color: liquidColor }}>{rawPercentage}%</strong>{' '}
          of the national average ({nationalAvg.toLocaleString()} gal/week).
        </p>
      </div>

      {/* The drop — everything in one SVG so clip-path works everywhere */}
      <svg
        viewBox="0 0 24 24"
        width="200"
        height="270"
        className="drop-shadow-lg"
        aria-label={`Water usage: ${rawPercentage}% of national average`}
      >
        <defs>
          <clipPath id="waterDropClip">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
          </clipPath>
          {/* Subtle gradient for the liquid */}
          <linearGradient id="liquidGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={liquidColorLight} />
            <stop offset="100%" stopColor={liquidColor} />
          </linearGradient>
        </defs>

        {/* 1. Empty drop background */}
        <path
          d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"
          fill="#e2e8f0"
          stroke="#cbd5e1"
          strokeWidth="0.4"
        />

        {/* 2. Clipped liquid group — this is the key fix */}
        <g clipPath="url(#waterDropClip)">
          {/* Primary liquid rect — animates from bottom up */}
          <motion.rect
            x="0"
            width="24"
            height={dropHeight + 2}
            fill="url(#liquidGrad)"
            initial={{ y: dropBottom }}
            animate={{ y: liquidTop }}
            transition={{ duration: 1.8, ease: 'easeOut', delay: 0.3 }}
          />
          {/* Secondary wave layer for depth */}
          <motion.rect
            x="0"
            width="24"
            height={dropHeight + 2}
            fill={liquidColorLight}
            opacity={0.35}
            initial={{ y: dropBottom + 0.5 }}
            animate={{ y: liquidTop + 0.4 }}
            transition={{ duration: 2.0, ease: 'easeOut', delay: 0.4 }}
          />
        </g>

        {/* 3. Glass reflection overlay */}
        <path
          d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"
          fill="none"
          stroke="#ffffff"
          strokeWidth="0.6"
          opacity="0.5"
        />
      </svg>

      {/* Percentage label below the drop */}
      <motion.p
        className="mt-6 text-4xl font-black font-heading tracking-tight"
        style={{ color: liquidColor }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        {rawPercentage}%
      </motion.p>
      <p className="text-on-surface-variant text-sm font-medium mt-1">
        {gallons.toLocaleString()} gal/week
      </p>
    </div>
  );
}
