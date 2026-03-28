import { Droplets, Leaf, RotateCcw, Sunrise } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

export function SavingTips() {
  return (
    <div className="max-w-7xl mx-auto w-full pb-12 animated-enter">
      <header className="mb-10 pl-2 lg:pl-0">
        <h1 className="text-4xl lg:text-5xl font-heading font-extrabold text-on-surface tracking-tight">Saving Tips</h1>
        <p className="text-on-surface-variant font-medium mt-2 text-lg">Actionable heuristics to drastically shrink your daily water footprint.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        
        <Card className="bg-surface-container border-0 shadow-sm rounded-3xl overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-8">
             <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-primary/10 text-primary rounded-2xl">
                  <RotateCcw size={32} />
                </div>
                <h3 className="font-bold text-2xl text-on-surface font-heading">Smart Controllers</h3>
             </div>
             <p className="text-on-surface-variant leading-relaxed text-lg">
                Upgrade to weather-based irrigation controllers. These modern systems connect to local weather stations and automatically adjust your watering schedule based on real-time rainfall, temperature, and evaporation rates.
             </p>
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
             <p className="text-on-surface-variant leading-relaxed text-lg">
                Replace heavily irrigated turf boundaries with native desert landscaping. Local plants have evolved to survive with minimal rainfall, drastically reducing your daily evaporative water loss and maintenance needs.
             </p>
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
             <p className="text-on-surface-variant leading-relaxed text-lg">
                Apply a robust 2-3 inch layer of organic mulch around all shrubs, trees, and garden beds. Mulch acts as a protective shield, retaining essential root moisture and blocking competitive weeds that steal water.
             </p>
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
             <p className="text-on-surface-variant leading-relaxed text-lg">
                Exclusively schedule watering between 5:00 AM and 8:00 AM. This prevents rapid evaporation under the hot afternoon sun and stops fungal diseases from spreading by allowing grass blades to dry during the day.
             </p>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
