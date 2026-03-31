import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Library, PlusCircle, FolderOpen, History, Settings, LogOut, ChevronLeft, ChevronRight, Home, Menu, X,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const [mobileOpen, setMobileOpen] = useState(false);
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/parent/login');
  };

  const handleNavClick = () => {
    if (isMobile) setMobileOpen(false);
  };

  const sidebarContent = (
    <>
      <div className="p-4 flex items-center justify-between border-b border-border">
        <h2 className="text-sm font-bold text-primary">Halal Play</h2>
        {isMobile ? (
          <button onClick={() => setMobileOpen(false)} className="p-1 rounded-md hover:bg-secondary text-muted-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        ) : (
          <button onClick={() => setCollapsed(!collapsed)} className="p-1 rounded-md hover:bg-secondary text-muted-foreground transition-colors">
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
      </div>

      <div className="p-2">
        <button
          onClick={() => { navigate('/home'); handleNavClick(); }}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20 transition-colors w-full"
        >
          <Home className="w-4 h-4 flex-shrink-0" />
          <span>Kids Mode</span>
        </button>
      </div>

      <nav className="flex-1 p-2 space-y-0.5">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={handleNavClick}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`
            }
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            {(!collapsed || isMobile) && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-2 border-t border-border">
        <button
          onClick={() => { handleSignOut(); handleNavClick(); }}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors w-full"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {(!collapsed || isMobile) && <span>Sign Out</span>}
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className={`hidden md:flex ${collapsed ? 'w-16' : 'w-56'} border-r border-border bg-card flex-shrink-0 flex-col transition-all duration-300`}>
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {isMobile && mobileOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-64 bg-card flex flex-col z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-auto">
        {/* Mobile header */}
        {isMobile && (
          <header className="sticky top-0 z-40 flex items-center gap-3 px-4 py-3 border-b border-border bg-card/95 backdrop-blur-sm">
            <button onClick={() => setMobileOpen(true)} className="p-1.5 rounded-lg hover:bg-secondary text-foreground transition-colors">
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-sm font-bold text-primary">Halal Play</h1>
          </header>
        )}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
