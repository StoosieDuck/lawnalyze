import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { Droplets } from 'lucide-react';

export function Splash() {
  const setOnboardingStep = useStore((state) => state.setOnboardingStep);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-surface-container-low text-on-surface overflow-hidden relative w-full">
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary-container/20 to-surface pointer-events-none" />
      
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="z-10 flex flex-col items-center max-w-lg text-center px-6"
      >
        <motion.div
           initial={{ y: -50, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ delay: 0.5, duration: 0.8 }}
           className="w-24 h-24 bg-primary-container text-white rounded-full flex items-center justify-center mb-8 shadow-ambient gradient-primary"
        >
          <Droplets size={48} className="drop-shadow-md" />
        </motion.div>
        
        <h1 className="text-5xl md:text-7xl font-heading font-extrabold text-primary mb-6 tracking-tighter shadow-sm text-shadow-sm">
          LAWNALYZE
        </h1>
        <p className="text-xl md:text-2xl font-body font-medium text-on-surface-variant leading-relaxed mb-12">
          Data-driven water conservation and management for a greener future.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setOnboardingStep('address')}
          className="bg-primary text-white font-bold text-lg px-12 py-5 rounded-full shadow-ambient hover:bg-primary/90 transition-colors w-full sm:w-auto"
        >
          Get Started
        </motion.button>
      </motion.div>
    </div>
  );
}
