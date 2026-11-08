import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AmbientLights } from './components/AmbientLights';
import { VerificationGateway } from './components/VerificationGateway';
import { UnlockedLetterView } from './components/UnlockedLetterView';

export const App: React.FC = () => {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('letter_unlocked_priya') === 'true';
    }
    return false;
  });

  const handleVerified = () => {
    sessionStorage.setItem('letter_unlocked_priya', 'true');
    setIsUnlocked(true);
  };

  const handleRelock = () => {
    sessionStorage.removeItem('letter_unlocked_priya');
    setIsUnlocked(false);
  };

  useEffect(() => {
    // Scroll to top on lock/unlock transition
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [isUnlocked]);

  return (
    <main className="relative min-h-screen bg-twilight-950 text-slate-100 overflow-x-hidden">
      {/* 60fps Canvas-based Diwali Ambient Floating Embers */}
      <AmbientLights />

      {/* Screen Transitions */}
      <AnimatePresence mode="wait">
        {!isUnlocked ? (
          <motion.div
            key="gateway"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
            transition={{ duration: 0.6 }}
          >
            <VerificationGateway onVerified={handleVerified} />
          </motion.div>
        ) : (
          <motion.div
            key="unlocked-letter"
            initial={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
          >
            <UnlockedLetterView onRelock={handleRelock} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default App;
