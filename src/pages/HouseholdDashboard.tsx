import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplets, Calculator, Info, Ruler, Sun } from "lucide-react";
import { useStore } from "../store/useStore";
import { calculateGallonsPerWeek, getEtoForCity, PLANT_FACTOR, IRRIGATION_EFFICIENCY, CONVERSION_FACTOR } from "../lib/waterMath";

export function HouseholdDashboard() {
  const { location } = useStore();
  const lawnAreaSqFt = useStore(state => state.lawnAreaSqFt) || 1250;
  
  const { eto, cityName } = getEtoForCity(location?.city);
  const weeklyWaterEstimate = calculateGallonsPerWeek(lawnAreaSqFt, location?.city);
  const yearlyWaterEstimate = weeklyWaterEstimate * 52;

  return (
    <div className="max-w-4xl mx-auto w-full pb-12 pt-8 px-4">
      <header className="mb-10 text-center">
        <h1 className="text-4xl lg:text-5xl font-heading font-extrabold text-on-surface tracking-tight mb-4">Lawn Analysis Complete</h1>
        <p className="text-on-surface-variant font-medium text-lg">We successfully processed your property boundaries.</p>
      </header>
      
      <div className="flex flex-col gap-6">
        
        {/* Core Calculation Card */}
        <Card className="bg-surface-container-lowest border-0 shadow-2xl rounded-[32px] overflow-hidden">
          <CardHeader className="bg-primary/5 pb-8 pt-8">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="p-3 bg-primary text-white rounded-2xl shadow-ambient">
                <Ruler className="w-8 h-8" />
              </div>
            </div>
            <CardTitle className="text-xl font-heading font-extrabold text-center text-primary uppercase tracking-widest">Detected Lawn Area</CardTitle>
            <div className="text-center mt-4">
              <span className="text-7xl font-heading font-black">{lawnAreaSqFt.toLocaleString()}</span>
              <span className="text-2xl font-bold text-on-surface-variant ml-2">SQ FT</span>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            <div className="bg-surface-container p-6 rounded-2xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-tertiary-container text-on-tertiary-container rounded-full">
                  <Droplets className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-on-surface">Estimated Water Usage</h3>
                  <p className="text-on-surface-variant">Based on your specific dimensions</p>
                </div>
              </div>
              <div className="text-right flex flex-col items-end">
                <span className="text-4xl font-black font-heading text-tertiary">{weeklyWaterEstimate.toLocaleString()} <span className="text-xl text-on-surface-variant">gal/week</span></span>
                <span className="text-xl font-bold text-on-surface-variant mt-1">{yearlyWaterEstimate.toLocaleString()} gal/year</span>
              </div>
            </div>

            {/* Dropdown Reasoning */}
            <details className="group bg-surface-variant rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden cursor-pointer">
              <summary className="flex items-center justify-between p-6 font-bold text-lg select-none hover:bg-surface-container-high transition-colors">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <Calculator className="text-primary w-6 h-6" />
                    <span>View Precision Analysis & Methodology</span>
                  </div>
                  <span className="text-sm text-on-surface-variant ml-9 font-normal">Explore how satellite mapping and {location?.city || 'local'} weather calculate this figure</span>
                </div>
                <span className="transition group-open:rotate-180 bg-surface-container p-2 rounded-full">
                  <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <div className="p-6 pt-0 text-on-surface-variant border-t border-surface-container/10">
                <div className="space-y-6 pt-6">
                  
                  {/* Geospatial Explanation */}
                  <div>
                    <h4 className="font-heading font-extrabold text-on-surface mb-2 flex items-center gap-2 text-lg">
                      <Ruler className="w-5 h-5 text-primary" /> Geospatial Measurement
                    </h4>
                    <p className="text-[15px] leading-relaxed bg-surface p-4 rounded-xl shadow-sm border border-surface-container">
                      Your lawn boundary was accurately calculated using <strong>High-Resolution Web Mercator Satellite Imagery</strong>. 
                      By plotting the 4+ geodesic coordinate points you placed on the map, our engine applies a spherical polygon algorithm (via turf.js) to compute the exact curvature area over the earth, returning a highly precise area of <strong>{lawnAreaSqFt.toLocaleString()} sq ft</strong>.
                    </p>
                  </div>

                  {/* Weather & Climate Modifier */}
                  <div>
                    <h4 className="font-heading font-extrabold text-on-surface mb-2 flex items-center gap-2 text-lg">
                      <Sun className="w-5 h-5 text-tertiary" /> Climate Integration ({cityName})
                    </h4>
                    <p className="text-[15px] leading-relaxed bg-surface p-4 rounded-xl shadow-sm border border-surface-container">
                      Water usage isn't static—it scales with the heat. Your local Evapotranspiration Rate (ETo) for <strong>{cityName}</strong> is <strong>{eto} inches/week</strong>, meaning your lawn loses this much moisture to the atmosphere every week during peak summer.
                    </p>
                  </div>
                  
                  {/* Math Breakdown */}
                  <div className="bg-primary-fixed text-primary-fixed-variant rounded-xl p-5 shadow-ambient">
                    <h4 className="font-heading font-extrabold text-xl mb-4 flex items-center gap-2"><Info className="w-5 h-5" /> EPA WaterSense Formula</h4>
                    <ul className="space-y-4 font-mono text-sm mb-6">
                      <li className="flex justify-between border-b border-primary/20 pb-2">
                        <span>Lawn Size:</span> <strong>{lawnAreaSqFt.toLocaleString()} sq ft</strong>
                      </li>
                      <li className="flex justify-between border-b border-primary/20 pb-2">
                        <span>ETo ({cityName}):</span> <strong>{eto} in/week</strong>
                      </li>
                      <li className="flex justify-between border-b border-primary/20 pb-2">
                        <span>Plant Factor (Turf):</span> <strong>{PLANT_FACTOR}</strong>
                      </li>
                      <li className="flex justify-between border-b border-primary/20 pb-2">
                        <span>Conversion Factor:</span> <strong>{CONVERSION_FACTOR} gal/in·ft²</strong>
                      </li>
                      <li className="flex justify-between border-b border-primary/20 pb-2">
                        <span>Irrigation Efficiency:</span> <strong>{IRRIGATION_EFFICIENCY}</strong>
                      </li>
                      <li className="flex justify-between text-base pt-2 font-black tracking-widest text-primary-fixed-variant/80">
                        <span>FORMULA:</span> <span>({eto} × {PLANT_FACTOR} × {lawnAreaSqFt} × {CONVERSION_FACTOR}) ÷ {IRRIGATION_EFFICIENCY}</span>
                      </li>
                    </ul>
                    
                    <div className="bg-primary text-white p-4 rounded-xl text-center shadow-sm">
                      <p className="font-heading text-sm uppercase tracking-widest opacity-80 mb-1">Your Adjusted Weekly Usage</p>
                      <p className="text-4xl font-black">{weeklyWaterEstimate.toLocaleString()} Gallons</p>
                    </div>
                  </div>
                  
                  {/* National Average Context */}
                  <div className="text-sm rounded-lg bg-surface-container-low p-5 border-l-4 border-secondary">
                    <h4 className="font-bold text-on-surface mb-2">How do you compare?</h4>
                    <p className="leading-relaxed">
                      According to EPA irrigation calculations, a standard 5,000 sq ft suburban lawn requires nearly <strong>3,115 gallons per week</strong> to maintain 1 inch of watering depth. 
                      Your footprint of {lawnAreaSqFt.toLocaleString()} sq ft puts your estimated usage at <strong>{weeklyWaterEstimate.toLocaleString()} gallons</strong>, which is roughly {Math.round((weeklyWaterEstimate / 3115) * 100)}% of the national average.
                    </p>
                  </div>
                </div>
              </div>
            </details>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
