interface GrowthMetricProps {
  score: number;
  label?: string;
  size?: number;
  strokeWidth?: number;
}

export function GrowthMetric({ score, label = "Soil Health", size = 200, strokeWidth = 16 }: GrowthMetricProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          className="text-tertiary-fixed"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="text-primary transition-all duration-1000 ease-out"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-4xl font-heading font-extrabold text-on-surface tracking-tight">{score}%</span>
        <span className="text-sm font-body font-medium text-on-surface-variant uppercase tracking-widest mt-1">{label}</span>
      </div>
    </div>
  );
}
