import { Home, Grid3X3, Heart, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/home', icon: Home, label: 'Home' },
  { to: '/categories', icon: Grid3X3, label: 'Explore' },
  { to: '/favorites', icon: Heart, label: 'Favorites' },
];

export function ChildBottomNav() {
  return (
    <nav className="bottom-nav">
      <div className="flex items-center justify-around py-2 px-4 max-w-lg mx-auto">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-colors min-w-[56px] ${
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
