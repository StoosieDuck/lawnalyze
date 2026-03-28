import { Droplets, Leaf, RotateCcw, Sunrise, ExternalLink } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

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
  return (
    <div className="max-w-6xl mx-auto w-full pb-12 animated-enter px-4">
      <header className="mb-10 text-center">
        <h1 className="text-4xl lg:text-5xl font-heading font-extrabold text-on-surface tracking-tight">Saving Tips</h1>
        <p className="text-on-surface-variant font-medium mt-2 text-lg">Actionable heuristics to drastically shrink your daily water footprint.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
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
    </div>
  );
}
