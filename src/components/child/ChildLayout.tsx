import { Outlet } from 'react-router-dom';
import { ChildBottomNav } from '@/components/child/ChildBottomNav';
import { motion, AnimatePresence } from 'framer-motion';

export function ChildLayout() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Outlet />
      </motion.div>
      <ChildBottomNav />
    </div>
  );
}
