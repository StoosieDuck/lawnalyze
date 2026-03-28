import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { MapPin, ArrowRight } from 'lucide-react';

export function AddressInput() {
  const { setLocation, setOnboardingStep } = useStore();
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateCode, setStateCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorObj, setErrorObj] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (address && city && stateCode) {
      setLoading(true);
      setErrorObj('');
      try {
        // Free OpenStreetMap Geocoding API
        const query = encodeURIComponent(`${address}, ${city}, ${stateCode}`);
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`);
        const data = await response.json();

        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          setLocation(address, city, stateCode, [lat, lon]);
          setOnboardingStep('map');
        } else {
          // Fallback to City Center if exact address fails
          const cityQuery = encodeURIComponent(`${city}, ${stateCode}`);
          const cityResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${cityQuery}&limit=1`);
          const cityData = await cityResponse.json();
          if (cityData && cityData.length > 0) {
             const lat = parseFloat(cityData[0].lat);
             const lon = parseFloat(cityData[0].lon);
             setLocation(address, city, stateCode, [lat, lon]);
             setOnboardingStep('map');
          } else {
             setErrorObj('Could not locate address. Please verify your input.');
          }
        }
      } catch (err) {
        setErrorObj('Network error fetching location. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-surface px-6 relative overflow-hidden w-full">
      <div className="absolute -top-[40%] -right-[20%] w-[80%] h-[80%] rounded-full bg-primary-fixed blur-3xl opacity-20 pointer-events-none" />
      
      <motion.div 
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full z-10"
      >
        <div className="mb-8">
          <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mb-6 text-primary shadow-sm">
            <MapPin size={32} />
          </div>
          <h2 className="text-4xl font-heading font-extrabold text-on-surface mb-2">Locate Property</h2>
          <p className="text-on-surface-variant font-medium text-lg">Enter your exact address to center the satellite view perfectly over your lawn.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-5">
            <div>
              <label htmlFor="address" className="block text-sm font-bold text-on-surface-variant mb-1 uppercase tracking-wider">Street Address</label>
              <input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 1600 Pennsylvania Ave NW"
                required
                className="w-full bg-surface-container-low border-2 border-transparent focus:border-primary px-5 py-4 rounded-xl text-lg text-on-surface outline-none transition-all shadow-sm focus:shadow-md"
              />
            </div>
            
            <div className="flex gap-4">
               <div className="flex-1">
                 <label htmlFor="city" className="block text-sm font-bold text-on-surface-variant mb-1 uppercase tracking-wider">City</label>
                 <input
                   id="city"
                   type="text"
                   value={city}
                   onChange={(e) => setCity(e.target.value)}
                   placeholder="Washington"
                   required
                   className="w-full bg-surface-container-low border-2 border-transparent focus:border-primary px-5 py-4 rounded-xl text-lg text-on-surface outline-none transition-all shadow-sm focus:shadow-md"
                 />
               </div>
               
               <div className="w-1/3">
                 <label htmlFor="state" className="block text-sm font-bold text-on-surface-variant mb-1 uppercase tracking-wider">State</label>
                 <input
                   id="state"
                   type="text"
                   value={stateCode}
                   onChange={(e) => setStateCode(e.target.value.toUpperCase())}
                   placeholder="DC"
                   required
                   maxLength={2}
                   className="w-full bg-surface-container-low border-2 border-transparent focus:border-primary px-5 py-4 rounded-xl text-lg text-on-surface outline-none transition-all shadow-sm"
                 />
               </div>
            </div>
          </div>
          
          {errorObj && <p className="text-error font-medium">{errorObj}</p>}

          <button
            type="submit"
            disabled={!address || !city || !stateCode || loading}
            className="w-full flex items-center justify-center gap-3 bg-primary gradient-primary text-white py-4 rounded-xl font-bold text-lg disabled:opacity-50 hover:scale-[1.02] transition-transform shadow-ambient"
          >
            {loading ? "Geocoding..." : "Find My Lawn"} <ArrowRight size={20} />
          </button>
          
          <div className="flex justify-center mt-4">
            <button 
              type="button" 
              onClick={() => useStore.getState().resetOnboarding()}
              className="text-on-surface-variant font-medium text-sm hover:text-on-surface transition-colors"
            >
              ← Back to Start
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
