import { NavLink } from 'react-router-dom';
import { Home, Heart, Grid3X3 } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { to: '/home', icon: Home, label: 'Home' },
  { to: '/favorites', icon: Heart, label: 'Favorites' },
  { to: '/categories', icon: Grid3X3, label: 'Explore' },
];

export function ChildBottomNav() {
  return (
    <nav className="bottom-nav">
      <div className="flex items-center justify-around px-2 py-1.5">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `relative flex flex-col items-center gap-0.5 px-5 py-1.5 rounded-xl transition-all duration-200 ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -top-1 w-5 h-0.5 rounded-full bg-primary"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                <item.icon className="w-[22px] h-[22px]" strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-semibold">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
