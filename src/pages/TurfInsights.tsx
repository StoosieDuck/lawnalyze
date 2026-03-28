import { useStore } from '../store/useStore';
import { Droplet, Calculator } from 'lucide-react';
import { WaterDropVisualizer } from '../components/BathtubVisualizer';
import { calculateGallonsPerWeek } from '../lib/waterMath';

// Average US bathtub holds ~36 gallons (EPA)
const BATHTUB_GALLONS = 36;

export function TurfInsights() {
  const { lawnAreaSqFt, location } = useStore();

  const estimatedGallonsPerWeek = calculateGallonsPerWeek(lawnAreaSqFt, location?.city);
  const estimatedGallonsPerYear = estimatedGallonsPerWeek * 52;
  const bathtubsPerWeek = +(estimatedGallonsPerWeek / BATHTUB_GALLONS).toFixed(1);
  const bathtubsPerYear = Math.round(estimatedGallonsPerYear / BATHTUB_GALLONS);

  // Generate array of bathtub icons, capped at 20 for visual display  
  const bathtubCount = Math.min(Math.ceil(bathtubsPerWeek), 20);

  return (
    <div className="max-w-6xl mx-auto w-full pb-12 animated-enter px-4">
       <header className="mb-10 text-center">
        <h1 className="text-4xl lg:text-5xl font-heading font-extrabold text-on-surface tracking-tight">Detailed Usage</h1>
        <p className="text-on-surface-variant font-medium mt-2 text-lg">See the financial and ecological impact of switching to artificial turf.</p>
      </header>
      
      {/* Hero Banner */}
      <div className="w-full bg-[#f1f2ec] rounded-[1.5rem] p-6 lg:px-8 lg:py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-5">
          <div className="w-[72px] h-[72px] rounded-full bg-[#707968] flex items-center justify-center shrink-0">
            <Droplet size={30} className="text-[#1a1b19]" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-[20px] font-bold text-[#1a1b19] tracking-normal mb-0.5">Estimated Water Usage</h2>
            <p className="text-[#515c4b] font-medium text-[15px]">Based on your specific dimensions</p>
          </div>
        </div>
        <div className="md:text-right flex flex-col items-start md:items-end justify-center">
          <div className="flex items-baseline gap-1.5 mb-1 pt-1">
            <span className="text-[46px] font-bold text-[#1a1b19] tracking-tight leading-none font-sans">{estimatedGallonsPerWeek.toLocaleString()}</span>
            <span className="text-[19px] font-bold text-[#1a1b19] tracking-tight font-sans">gal/week</span>
          </div>
          <span className="text-[16px] font-bold text-[#1a1b19] tracking-tight font-sans">{estimatedGallonsPerYear.toLocaleString()} gal/year</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 flex flex-col gap-8">
          <WaterDropVisualizer gallons={estimatedGallonsPerWeek} />
        </div>

        {/* Bathtub Comparison Card */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-surface-container rounded-[2rem] p-8 shadow-sm flex flex-col h-full">
            <h3 className="text-2xl font-bold font-heading text-on-surface mb-2">🛁 In Bathtubs</h3>
            <p className="text-on-surface-variant font-medium mb-6">
              Your weekly water usage fills roughly <strong className="text-primary text-2xl">{bathtubsPerWeek}</strong> standard bathtubs. That's <strong>{bathtubsPerYear.toLocaleString()}</strong> per year.
            </p>

            {/* Visual bathtub grid */}
            <div className="flex flex-wrap gap-2 mb-6">
              {Array.from({ length: bathtubCount }).map((_, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-lg filter grayscale opacity-80"
                  title={`Bathtub ${i + 1}`}
                >
                  🛁
                </div>
              ))}
              {bathtubsPerWeek > 20 && (
                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-xs font-bold text-primary">
                  +{Math.ceil(bathtubsPerWeek) - 20}
                </div>
              )}
            </div>

            {/* Dropdown with math */}
            <details className="group bg-surface-variant rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden cursor-pointer mt-auto">
              <summary className="flex items-center justify-between p-4 font-bold text-sm select-none hover:bg-surface-container-high transition-colors">
                <div className="flex items-center gap-2">
                  <Calculator className="text-primary w-4 h-4" />
                  <span>View Calculation</span>
                </div>
                <span className="transition group-open:rotate-180 bg-surface-container p-1.5 rounded-full">
                  <svg fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="16"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <div className="p-4 pt-0 text-on-surface-variant border-t border-surface-container/10">
                <div className="space-y-3 pt-4 font-mono text-sm">
                  <div className="flex justify-between">
                    <span>Weekly usage:</span>
                    <strong>{estimatedGallonsPerWeek.toLocaleString()} gal</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg bathtub capacity:</span>
                    <strong>{BATHTUB_GALLONS} gal</strong>
                  </div>
                  <div className="flex justify-between border-t border-surface-container pt-3">
                    <span>Bathtubs / week:</span>
                    <strong>{estimatedGallonsPerWeek.toLocaleString()} ÷ {BATHTUB_GALLONS} = {bathtubsPerWeek}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Bathtubs / year:</span>
                    <strong>{bathtubsPerWeek} × 52 = {bathtubsPerYear.toLocaleString()}</strong>
                  </div>
                  <p className="text-xs text-on-surface-variant/60 mt-2">
                    Source: EPA estimates the average US bathtub at 36 gallons (epa.gov/watersense)
                  </p>
                </div>
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
