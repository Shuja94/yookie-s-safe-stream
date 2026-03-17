import { Outlet } from 'react-router-dom';
import { ChildBottomNav } from '@/components/child/ChildBottomNav';

export function ChildLayout() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <Outlet />
      <ChildBottomNav />
    </div>
  );
}
