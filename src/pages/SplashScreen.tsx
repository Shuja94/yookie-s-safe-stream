import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function SplashScreen() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<'logo' | 'done'>('logo');

  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase('done');
      setTimeout(() => navigate('/profile'), 400);
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: phase === 'done' ? 0 : 1, scale: phase === 'done' ? 1.1 : 1 }}
        transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
        className="text-center"
      >
        <motion.div
          className="w-24 h-24 md:w-32 md:h-32 rounded-[2rem] gradient-hero mx-auto mb-6 flex items-center justify-center"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="text-4xl md:text-5xl">🎬</span>
        </motion.div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">YookiePlay</h1>
        <p className="text-muted-foreground text-sm">A safe little world of videos</p>
        <motion.div
          className="mt-8 flex justify-center gap-1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-primary"
              animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
