import { Droplets, Leaf, RotateCcw, Sunrise, ExternalLink, Banknote, TrendingUp } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { useStore } from '../store/useStore';

function Source({ label, url }: { label: string; url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-xs font-semibold text-primary/70 hover:text-primary transition-colors underline underline-offset-2"
    >
      {label} <ExternalLink size={10} />
    </a>
  );
}

export function SavingTips() {
  const lawnAreaSqFt = useStore((state) => state.lawnAreaSqFt);
  
  // Calculations
  const avgRebatePerSqFt = 2.50;
  const estimatedCashRebate = lawnAreaSqFt * avgRebatePerSqFt;
  const estimatedAnnualWaterSaved = lawnAreaSqFt * 25; // ~25 gallons per sq ft/year saved by removing turf

  return (
    <div className="max-w-6xl mx-auto w-full pb-12 animated-enter px-4">
      <header className="mb-10 text-center">
        <h1 className="text-4xl lg:text-5xl font-heading font-extrabold text-on-surface tracking-tight">Saving Tips</h1>
        <p className="text-on-surface-variant font-medium mt-2 text-lg">Actionable heuristics to drastically shrink your daily water footprint.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <Card className="bg-surface-container border-0 shadow-sm rounded-3xl overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-8">
             <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-primary/10 text-primary rounded-2xl">
                  <RotateCcw size={32} />
                </div>
                <h3 className="font-bold text-2xl text-on-surface font-heading">Smart Controllers</h3>
             </div>
             <p className="text-on-surface-variant leading-relaxed text-lg mb-4">
                Upgrade to weather-based irrigation controllers. These modern systems connect to local weather stations and automatically adjust your watering schedule based on real-time rainfall, temperature, and evaporation rates.
             </p>
             <div className="flex flex-wrap gap-3">
               <Source label="EPA WaterSense" url="https://www.epa.gov/watersense/watering-tips" />
               <Source label="Irrigation Association" url="https://www.irrigation.org/IA/Advocacy/Smart-Irrigation-Month.aspx" />
             </div>
          </CardContent>
        </Card>

        <Card className="bg-surface-container border-0 shadow-sm rounded-3xl overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-8">
             <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-secondary/10 text-secondary rounded-2xl">
                  <Leaf size={32} />
                </div>
                <h3 className="font-bold text-2xl text-on-surface font-heading">Drought-Tolerant Native Flora</h3>
             </div>
             <p className="text-on-surface-variant leading-relaxed text-lg mb-4">
                Replace heavily irrigated turf boundaries with native desert landscaping. Local plants have evolved to survive with minimal rainfall, drastically reducing your daily evaporative water loss and maintenance needs.
             </p>
             <div className="flex flex-wrap gap-3">
               <Source label="USDA Plant Database" url="https://plants.usda.gov/" />
               <Source label="CA Native Plant Society" url="https://www.cnps.org/gardening" />
             </div>
          </CardContent>
        </Card>

        <Card className="bg-surface-container border-0 shadow-sm rounded-3xl overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-8">
             <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-tertiary/10 text-tertiary rounded-2xl">
                  <Droplets size={32} />
                </div>
                <h3 className="font-bold text-2xl text-on-surface font-heading">Targeted Depth Mulching</h3>
             </div>
             <p className="text-on-surface-variant leading-relaxed text-lg mb-4">
                Apply a robust 2-3 inch layer of organic mulch around all shrubs, trees, and garden beds. Mulch acts as a protective shield, retaining essential root moisture and blocking competitive weeds that steal water.
             </p>
             <div className="flex flex-wrap gap-3">
               <Source label="University of Florida IFAS" url="https://edis.ifas.ufl.edu/publication/MG256" />
               <Source label="Oregon State Extension" url="https://extension.oregonstate.edu/gardening/techniques/mulching-woody-ornamentals" />
             </div>
          </CardContent>
        </Card>

        <Card className="bg-surface-container border-0 shadow-sm rounded-3xl overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-8">
             <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-primary/10 text-primary rounded-2xl">
                  <Sunrise size={32} />
                </div>
                <h3 className="font-bold text-2xl text-on-surface font-heading">Dawn Watering Regimen</h3>
             </div>
             <p className="text-on-surface-variant leading-relaxed text-lg mb-4">
                Exclusively schedule watering between 5:00 AM and 8:00 AM. This prevents rapid evaporation under the hot afternoon sun and stops fungal diseases from spreading by allowing grass blades to dry during the day.
             </p>
             <div className="flex flex-wrap gap-3">
               <Source label="Penn State Extension" url="https://extension.psu.edu/watering-lawns" />
               <Source label="Iowa State Extension" url="https://hortnews.extension.iastate.edu/1994/7-1-1994/water.html" />
               <Source label="Clemson HGIC" url="https://hgic.clemson.edu/factsheet/watering-lawns/" />
             </div>
          </CardContent>
        </Card>
      </div>

      {/* Featured: Turf Conversion Incentives */}
      <Card className="bg-primary/5 border-primary/20 border shadow-lg rounded-[2.5rem] overflow-hidden">
        <CardContent className="p-10">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-primary/10 text-primary rounded-2xl">
                  <Banknote size={32} />
                </div>
                <h3 className="font-bold text-3xl text-on-surface font-heading">Turf Conversion Incentives</h3>
              </div>
              <p className="text-on-surface-variant leading-relaxed text-xl mb-8">
                Many states offer lucrative cash rebates to homeowners who replace water-thirsty grass with drought-tolerant alternatives or high-efficiency turf systems.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-surface-container rounded-3xl p-6 shadow-sm border border-surface-variant/10">
                  <p className="text-xs font-bold text-on-surface-variant/60 uppercase tracking-widest mb-2">Estimated Cash Back</p>
                  <p className="text-4xl font-black text-primary font-heading tracking-tight">
                    ${estimatedCashRebate.toLocaleString()}
                  </p>
                  <p className="text-sm text-on-surface-variant mt-1">Based on ~$2.50/sq ft rebates</p>
                </div>
                <div className="bg-surface-container rounded-3xl p-6 shadow-sm border border-surface-variant/10">
                  <p className="text-xs font-bold text-on-surface-variant/60 uppercase tracking-widest mb-2">Water Banked / Year</p>
                  <p className="text-4xl font-black text-secondary font-heading tracking-tight">
                    {estimatedAnnualWaterSaved.toLocaleString()}
                  </p>
                  <p className="text-sm text-on-surface-variant mt-1">Total gallons saved annually</p>
                </div>
              </div>
            </div>

            <div className="lg:w-1/3 flex flex-col gap-6 justify-center">
              <div className="bg-surface rounded-3xl p-8 border border-primary/20 relative overflow-hidden group">
                <TrendingUp className="absolute -right-4 -bottom-4 text-primary/5 w-32 h-32 group-hover:scale-110 transition-transform" />
                <h4 className="font-bold text-xl mb-4 text-on-surface">Did you know?</h4>
                <p className="text-on-surface-variant text-base relative z-10 leading-relaxed">
                  Homeowners in areas like Los Angeles and Las Vegas have received over <strong>$15,000</strong> in combined incentives for lawn replacement through programs like <span className="font-bold">SoCal Water$mart</span>.
                </p>
                <div className="mt-6 flex flex-wrap gap-3 relative z-10">
                  <Source label="SoCal rebate info" url="https://socalwatersmart.com/en/residential-rebates/turf-replacement-program-2/" />
                  <Source label="SNWA rebates" url="https://www.snwa.com/rebates/wsll/index.html" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

