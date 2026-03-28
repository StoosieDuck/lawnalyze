import { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { MapContainer, TileLayer, useMap, Marker } from 'react-leaflet';
import { MapPin, ArrowRight, CheckCircle2, Search } from 'lucide-react';
import area from '@turf/area';
import { polygon } from '@turf/helpers';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

import * as L from 'leaflet';

// Component to handle auto-centering dynamically
function MapController({ markerPos }: { markerPos: [number, number] | null }) {
  const map = useMap();
  const location = useStore(state => state.location);
  
  useEffect(() => {
    if (markerPos) {
      map.flyTo(markerPos, 20, { duration: 1.5 });
    } else if (location?.coords) {
      map.setView(location.coords, 20); // Center on exact Geocoded address
    } else {
      map.setView([34.0522, -118.2437], 18); // Fallback to LA
    }
    // Force calculate to fix bounding box bugs
    setTimeout(() => map.invalidateSize(), 250); 
  }, [map, location, markerPos]);
  
  return null;
}

// Custom Draw Hook to bypass Vite Rollup issues with obsolete react-leaflet-draw
function DrawControl({ onCalculateArea }: { onCalculateArea: (area: number) => void }) {
  const map = useMap();

  useEffect(() => {
    (window as any).L = L;
    let isMounted = true;
    let drawControl: any = null;
    let drawnItems: any = null;
    let handleDrawCreatedRef: any = null;

    let handleKeyDownRef: any = null;

    import('leaflet-draw').then(() => {
      if (!isMounted) return;

      drawnItems = new L.FeatureGroup();
      map.addLayer(drawnItems);
      
      drawControl = new (L.Control as any).Draw({
        edit: { featureGroup: drawnItems },
        draw: { 
          polyline: false, circle: false, circlemarker: false, marker: false, 
          polygon: {
            allowIntersection: false,
            shapeOptions: { color: '#0b5cff', weight: 4, fillOpacity: 0.2, fillColor: '#0b5cff' }
          }, 
          rectangle: false
        }
      });
      map.addControl(drawControl);

      const recalcTotalArea = () => {
        let totalSqFt = 0;
        drawnItems.eachLayer((layer: any) => {
          if (layer instanceof L.Polygon) {
            let latlngs: any[] = layer.getLatLngs()[0] as any[];
            if (Array.isArray(latlngs) && Array.isArray(latlngs[0])) latlngs = latlngs[0];
            try {
              const coords = latlngs.map((ll: any) => [ll.lng, ll.lat]);
              coords.push([latlngs[0].lng, latlngs[0].lat]);
              const poly = polygon([coords]);
              const areaSqMeters = area(poly);
              totalSqFt += Math.round(areaSqMeters * 10.7639);
            } catch {}
          }
        });
        onCalculateArea(totalSqFt);
      };

      const handleDrawCreated = (e: any) => {
        // Don't clear — allow multiple polygons!
        drawnItems.addLayer(e.layer);
        
        // Auto-enable editing so vertices are interactive
        if (e.layer.editing) {
          e.layer.editing.enable();
        }

        // Recalculate total of all polygons
        recalcTotalArea();

        // Bind live edit events for this layer
        e.layer.on('edit', () => {
          recalcTotalArea();
        });
      };

      handleDrawCreatedRef = handleDrawCreated;
      map.on((L as any).Draw.Event.CREATED, handleDrawCreated);

      // Recalculate when polygons are deleted via the toolbar
      map.on((L as any).Draw.Event.DELETED, () => {
        recalcTotalArea();
      });
      map.on((L as any).Draw.Event.EDITED, () => {
        recalcTotalArea();
      });

      const handleKeyDown = (e: KeyboardEvent) => {
        const target = e.target as HTMLElement;
        if (target && (target.tagName.toLowerCase() === 'input' || target.tagName.toLowerCase() === 'textarea')) {
          return;
        }
        
        if (e.key === 'Backspace' || e.key === 'Delete') {
          // Check if we are drawing and have the delete last point native action available
          const actions = Array.from(document.querySelectorAll('.leaflet-draw-actions a')) as HTMLAnchorElement[];
          const deletePointBtn = actions.find(el => 
            el.textContent?.toLowerCase().includes('delete last') || 
            el.title?.toLowerCase().includes('delete last')
          );
          
          if (deletePointBtn) {
            e.preventDefault();
            deletePointBtn.click();
           } else {
            // Delete the last polygon added
            if (drawnItems && drawnItems.getLayers().length > 0) {
              e.preventDefault();
              const layers = drawnItems.getLayers();
              drawnItems.removeLayer(layers[layers.length - 1]);
              recalcTotalArea();
            }
          }
        }
      };
      
      handleKeyDownRef = handleKeyDown;
      window.addEventListener('keydown', handleKeyDown);

    }).catch(console.error);

    return () => {
      isMounted = false;
      if (handleKeyDownRef) window.removeEventListener('keydown', handleKeyDownRef);
      if (handleDrawCreatedRef) map.off((L as any).Draw.Event.CREATED, handleDrawCreatedRef);
      if (drawControl) map.removeControl(drawControl);
      if (drawnItems) map.removeLayer(drawnItems);
    };
  }, [map, onCalculateArea]);

  return null;
}

export function MapSelection() {
  const { location, setLawnAreaSqFt, setOnboardingStep } = useStore();
  const [calculatedArea, setCalculatedArea] = useState<number>(0);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [markerPos, setMarkerPos] = useState<[number, number] | null>(null);

  const handleFinish = () => {
    if (calculatedArea > 0) {
      setLawnAreaSqFt(calculatedArea);
      setOnboardingStep('dashboard'); // Transition to main app
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    
    setIsSearching(true);
    try {
      const query = encodeURIComponent(searchQuery);
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`);
      const data = await res.json();
      if (data && data.length > 0) {
        setMarkerPos([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
      } else {
        alert("Address not found. Please try another query.");
      }
    } catch(err) {
      alert("Error searching address.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface-container-low w-full relative font-body overflow-y-auto overflow-x-hidden">
      {/* Static gradient — top right */}
      <div className="pointer-events-none fixed top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-green-400/35 via-emerald-300/20 to-transparent blur-3xl animate-drift-slow" />
      {/* Static gradient — bottom left */}
      <div className="pointer-events-none fixed bottom-[-15%] left-[-5%] w-[70%] h-[60%] rounded-full bg-gradient-to-tr from-green-500/30 via-emerald-400/15 to-transparent blur-3xl animate-drift-slow-reverse" />
      <style>{`
        /* Make Leaflet tools refined, modern, and high-res */
        .leaflet-draw.leaflet-control {
          background: transparent !important;
          border: none !important;
          margin-top: 16px !important;
        }
        .leaflet-draw-toolbar.leaflet-bar {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
        }
        .leaflet-draw-toolbar a {
          position: relative !important;
          background-color: rgba(255, 255, 255, 0.7) !important;
          backdrop-filter: blur(16px) saturate(180%);
          -webkit-backdrop-filter: blur(16px) saturate(180%);
          width: 52px !important;
          height: 52px !important;
          border-radius: 16px !important;
          margin-bottom: 12px !important;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 8px 32px rgba(0,0,0,0.1), inset 0 1px 1px rgba(255,255,255,0.8), 0 0 0 1px rgba(255,255,255,0.3) !important;
          border: none !important;
        }
        .leaflet-draw-toolbar a:hover {
          background-color: rgba(255, 255, 255, 0.9) !important;
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.15), inset 0 1px 1px rgba(255,255,255,1), 0 0 0 1px rgba(255,255,255,0.5) !important;
        }
        
        .leaflet-draw-toolbar a:hover::after {
          content: attr(title);
          position: absolute;
          left: 64px;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(30, 41, 59, 0.9);
          backdrop-filter: blur(8px);
          color: white;
          padding: 8px 16px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 700;
          white-space: nowrap;
          pointer-events: none;
          z-index: 1000;
          box-shadow: 0 8px 24px rgba(0,0,0,0.2);
          animation: mapPopIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        @keyframes mapPopIn {
          from { opacity: 0; transform: translate(-15px, -50%); }
          to { opacity: 1; transform: translate(0, -50%); }
        }
        
        /* Inject Custom High-Res SVG Icons */
        a.leaflet-draw-draw-polygon {
          background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMi41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0yMSAxNlY4YTIgMiAwIDAgMC0xLTEuNzNsLTctNGEyIDIgMCAwIDAtMiAwbC03IDRBMiAyIDAgMCAwIDMgOHY4YTIgMiAwIDAgMCAxIDEuNzNsNyA0YTIgMiAwIDAgMCAyIDBsNy00QTIgMiAwIDAgMCAyMSAxNnoiLz48L3N2Zz4=') !important;
          background-position: center !important;
          background-repeat: no-repeat !important;
          background-size: 24px !important;
        }
        a.leaflet-draw-edit-edit {
          display: none !important; /* Managed automatically now */
        }
        a.leaflet-draw-edit-remove {
          background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNlZjQ0NDQiIHN0cm9rZS13aWR0aD0iMi41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0zIDZoMTgiLz48cGF0aCBkPSJNMTkgNnYxNGMwIDEtMSAyLTIgMkg3Yy0xIDAtMi0xLTItMlY2Ii8+PHBhdGggZD0iTTggNlY0YzAtMSAxLTIgMi0yaDRjMSAwIDIgMSAyIDJ2MiIvPjxsaW5lIHgxPSIxMCIgeDI9IjEwIiB5MT0iMTEiIHkyPSIxNyIvPjxsaW5lIHgxPSIxNCIgeDI9IjE0IiB5MT0iMTEiIHkyPSIxNyIvPjwvc3ZnPg==') !important;
          background-position: center !important;
          background-repeat: no-repeat !important;
          background-size: 24px !important;
        }

        .leaflet-draw-actions {
          background: white;
          padding: 6px 10px;
          border-radius: 12px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.1);
          border: 1px solid #eee;
          margin-left: 12px;
        }
        .leaflet-draw-actions li:not(:last-child) {
          border-right: 1px solid #f1f3f5;
          margin-right: 8px;
          padding-right: 8px;
        }
        .leaflet-draw-actions li a {
          color: #1a1a1a !important;
          font-weight: 700;
          font-family: inherit;
        }

        /* Custom Edit Nodes */
        .leaflet-editing-icon {
          border-radius: 50% !important;
          width: 14px !important;
          height: 14px !important;
          margin-left: -7px !important;
          margin-top: -7px !important;
          background-color: #0b5cff !important;
          border: 3px solid white !important;
          box-shadow: 0 2px 6px rgba(0,0,0,0.4) !important;
        }
      `}</style>
      
      {/* Top Bar */}
      <div className="glass-nav z-50 p-4 border-b border-surface-variant flex items-center justify-between sticky top-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-container text-white rounded-full flex items-center justify-center">
            <MapPin size={20} />
          </div>
          <div>
            <h2 className="text-xl font-heading font-extrabold text-on-surface">Select Boundary</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-sm font-medium text-on-surface-variant line-clamp-1 max-w-[150px] md:max-w-sm">{location?.address || `${location?.city}`}</p>
              <button onClick={() => setOnboardingStep('address')} className="text-xs font-bold text-primary hover:underline px-2 py-0.5 bg-primary/10 rounded-full">
                Change
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {calculatedArea > 0 && (
            <div className="bg-primary-fixed text-primary-fixed-variant px-3 py-1.5 md:px-4 md:py-2 rounded-xl flex items-center gap-2 shadow-sm">
              <CheckCircle2 size={16} className="text-primary hidden md:block" />
              <span className="font-bold text-sm md:text-base">{calculatedArea.toLocaleString()} SQ FT</span>
            </div>
          )}
          <button 
            onClick={() => useStore.getState().resetOnboarding()} 
            className="text-xs font-bold text-error bg-error/10 hover:bg-error/20 px-3 py-2 rounded-lg transition-colors"
          >
            Start Over
          </button>
        </div>
      </div>

      <div className="flex-1 w-full flex flex-col items-center pt-8 pb-32 px-4 md:px-6 relative z-10 max-w-7xl mx-auto">
        
        {/* Search Bar - Center above Map */}
        <div className="w-full max-w-3xl mb-6">
          <h3 className="text-2xl font-bold font-heading mb-4 text-center text-on-surface">Map out your lawn</h3>
          <p className="text-center text-on-surface-variant mb-6 text-sm md:text-base">
            Use the polygon drawing tool on the left to outline each lawn section. <strong>Draw multiple polygons</strong> for separate lawn areas — they'll be summed automatically. <br/>
            <span className="text-primary font-bold">Tip:</span> Click the first dot to close a shape, then draw another. Press <kbd className="px-1.5 py-0.5 bg-surface-container rounded text-xs font-mono">Delete</kbd> to remove the last polygon.
          </p>
          
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center bg-surface rounded-2xl shadow-sm border border-surface-variant overflow-hidden p-2 gap-2">
            <input 
              type="text" 
              placeholder="Not the right spot? Search new address..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 w-full bg-transparent px-4 py-3 text-on-surface outline-none font-medium"
            />
            <button 
              type="submit" 
              disabled={isSearching || !searchQuery}
              className="w-full sm:w-auto px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Search size={18} />
              {isSearching ? '...' : 'Recenter'}
            </button>
          </form>
        </div>

        {/* Map Area - Square Box */}
        <div className="w-full max-w-[1240px] aspect-[16/9] rounded-[32px] overflow-hidden border-[12px] border-surface shadow-2xl relative bg-surface-variant isolate">
          <MapContainer 
            center={location?.coords || [34.0522, -118.2437]} 
            zoom={20}
            maxZoom={22}
            scrollWheelZoom={true}
            className="w-full h-full z-0"
            style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
            zoomControl={false}
          >
            <MapController markerPos={markerPos} />
            <TileLayer
              attribution='&copy; Google Maps Satellite'
              url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
              maxNativeZoom={21}
              maxZoom={22}
            />
            <DrawControl onCalculateArea={setCalculatedArea} />
            <Marker 
              position={markerPos || location?.coords || [34.0522, -118.2437]}
              icon={L.divIcon({
                className: '',
                html: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="42" viewBox="0 0 32 42" fill="none">
                  <path d="M16 0C7.163 0 0 7.163 0 16c0 10.512 14.208 24.576 15.104 25.472a1.28 1.28 0 001.792 0C17.792 40.576 32 26.512 32 16 32 7.163 24.837 0 16 0z" fill="#4285F4"/>
                  <circle cx="16" cy="16" r="6" fill="white"/>
                </svg>`,
                iconSize: [32, 42],
                iconAnchor: [16, 42],
              })}
            />
          </MapContainer>
        </div>
      </div>

      {/* Bottom Floating Action */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-surface-container-low via-surface-container-low to-transparent z-[1000] flex justify-center pb-safe pointer-events-none">
        <button
          onClick={handleFinish}
          disabled={calculatedArea === 0}
          className="w-full max-w-3xl flex items-center justify-center gap-2 bg-primary text-white py-5 px-6 rounded-2xl font-extrabold text-lg disabled:opacity-0 disabled:translate-y-10 hover:scale-[1.02] transition-all shadow-[0_8px_30px_rgb(0,0,0,0.12)] pointer-events-auto"
        >
          Confirm {calculatedArea > 0 ? `${calculatedArea.toLocaleString()} SQ FT` : ''} <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
