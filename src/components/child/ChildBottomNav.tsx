import { Home, Grid3X3, Heart } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/home', icon: Home, label: 'Home' },
  { to: '/categories', icon: Grid3X3, label: 'Explore' },
  { to: '/favorites', icon: Heart, label: 'Favorites' },
];

export function ChildBottomNav() {
  return (
    <nav className="bottom-nav">
      <div className="flex items-center justify-around py-2.5 px-4 max-w-lg mx-auto">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-5 py-1.5 rounded-2xl transition-all min-w-[60px] ${
                isActive
                  ? 'text-primary bg-primary/10 scale-105'
                  : 'text-muted-foreground hover:text-foreground active:scale-95'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-bold">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
