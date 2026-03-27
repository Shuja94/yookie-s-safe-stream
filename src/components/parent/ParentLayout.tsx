import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Library, PlusCircle, FolderOpen, History, Settings, LogOut, ChevronLeft, ChevronRight, Home,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  { to: '/parent/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/parent/library', icon: Library, label: 'Library' },
  { to: '/parent/add', icon: PlusCircle, label: 'Add Content' },
  { to: '/parent/categories', icon: FolderOpen, label: 'Categories' },
  { to: '/parent/history', icon: History, label: 'History' },
  { to: '/parent/settings', icon: Settings, label: 'Settings' },
];

export function ParentLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/parent/login');
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className={`${collapsed ? 'w-16' : 'w-56'} border-r border-border bg-card flex-shrink-0 flex flex-col transition-all duration-300`}>
        <div className="p-4 flex items-center justify-between border-b border-border">
          {!collapsed && <h2 className="text-sm font-bold text-primary">Halal Play</h2>}
          <button onClick={() => setCollapsed(!collapsed)} className="p-1 rounded-md hover:bg-secondary text-muted-foreground transition-colors">
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        <div className="p-2">
          <button
            onClick={() => navigate('/home')}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20 transition-colors w-full"
          >
            <Home className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>Kids Mode</span>}
          </button>
        </div>

        <nav className="flex-1 p-2 space-y-0.5">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`
              }
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>
        <div className="p-2 border-t border-border">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors w-full"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
