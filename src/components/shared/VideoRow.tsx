import { motion } from 'framer-motion';
import { useRef, ReactNode, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface VideoRowProps {
  title: string;
  children: ReactNode;
  delay?: number;
}

export function VideoRow({ title, children, delay = 0 }: VideoRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    return () => el.removeEventListener('scroll', checkScroll);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="mb-7 group/row relative"
    >
      <div className="flex items-center justify-between mb-2.5 px-5 md:px-12">
        <h2 className="text-[15px] md:text-base font-bold text-foreground tracking-tight">{title}</h2>
      </div>

      <div className="relative">
        {/* Left fade + arrow */}
        {canScrollLeft && (
          <div className="hidden md:flex absolute left-0 top-0 bottom-0 z-10 w-16 items-center justify-start bg-gradient-to-r from-background to-transparent">
            <button
              onClick={() => scroll('left')}
              className="ml-1 p-2 rounded-full bg-surface-2/80 backdrop-blur-sm text-foreground hover:bg-surface-3 transition-colors opacity-0 group-hover/row:opacity-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        )}

        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto hide-scrollbar snap-row px-5 md:px-12 pb-1"
        >
          {children}
        </div>

        {/* Right fade + arrow */}
        {canScrollRight && (
          <div className="hidden md:flex absolute right-0 top-0 bottom-0 z-10 w-16 items-center justify-end bg-gradient-to-l from-background to-transparent">
            <button
              onClick={() => scroll('right')}
              className="mr-1 p-2 rounded-full bg-surface-2/80 backdrop-blur-sm text-foreground hover:bg-surface-3 transition-colors opacity-0 group-hover/row:opacity-100"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </motion.section>
  );
}
