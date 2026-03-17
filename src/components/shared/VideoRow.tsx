import { motion } from 'framer-motion';
import { useRef, ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface VideoRowProps {
  title: string;
  children: ReactNode;
  delay?: number;
}

export function VideoRow({ title, children, delay = 0 }: VideoRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.7;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
      className="mb-8"
    >
      <div className="flex items-center justify-between mb-3 px-4 md:px-8">
        <h2 className="text-lg md:text-xl font-semibold text-foreground">{title}</h2>
        <div className="hidden md:flex gap-1">
          <button onClick={() => scroll('left')} className="p-1.5 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => scroll('right')} className="p-1.5 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto hide-scrollbar px-4 md:px-8 pb-2"
      >
        {children}
      </div>
    </motion.section>
  );
}
