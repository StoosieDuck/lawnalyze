import { useStore } from '../store/useStore';
import { Droplet } from 'lucide-react';
import { WaterDropVisualizer } from '../components/BathtubVisualizer';
import { calculateGallonsPerWeek } from '../lib/waterMath';

export function TurfInsights() {
  const { lawnAreaSqFt, location } = useStore();

  const estimatedGallonsPerWeek = calculateGallonsPerWeek(lawnAreaSqFt, location?.city);
  const estimatedGallonsPerYear = estimatedGallonsPerWeek * 52;

  return (
    <div className="max-w-7xl mx-auto w-full pb-12 animated-enter">
       <header className="mb-10 pl-2 lg:pl-0">
        <h1 className="text-4xl lg:text-5xl font-heading font-extrabold text-on-surface tracking-tight">Detailed Usage</h1>
        <p className="text-on-surface-variant font-medium mt-2 text-lg">See the financial and ecological impact of switching to artificial turf.</p>
      </header>
      
      {/* Hero Banner: Exact match to Figma design */}
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
        {/* Left Col - Analytics */}
        <div className="lg:col-span-8 flex flex-col gap-8">

          <WaterDropVisualizer gallons={estimatedGallonsPerWeek} />
          
        </div>
      </div>
    </div>
  );
}
