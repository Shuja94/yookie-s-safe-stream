import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/parent/ProtectedRoute";

import { Navigate } from "react-router-dom";
import ProfileSelect from "./pages/ProfileSelect";
import ChildHome from "./pages/ChildHome";
import VideoDetail from "./pages/VideoDetail";
import VideoPlayer from "./pages/VideoPlayer";
import Favorites from "./pages/Favorites";
import CategoryBrowse from "./pages/CategoryBrowse";
import ParentLogin from "./pages/parent/ParentLogin";
import ParentDashboard from "./pages/parent/ParentDashboard";
import AddContent from "./pages/parent/AddContent";
import ManageLibrary from "./pages/parent/ManageLibrary";
import ManageCategories from "./pages/parent/ManageCategories";
import WatchHistoryPage from "./pages/parent/WatchHistoryPage";
import ParentSettings from "./pages/parent/ParentSettings";
import { ChildLayout } from "./components/child/ChildLayout";
import { ParentLayout } from "./components/parent/ParentLayout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Entry */}
            <Route path="/" element={<Navigate to="/profile" replace />} />
            <Route path="/profile" element={<ProfileSelect />} />

            {/* Child routes with bottom nav */}
            <Route element={<ChildLayout />}>
              <Route path="/home" element={<ChildHome />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/categories" element={<CategoryBrowse />} />
            </Route>

            {/* Child routes without bottom nav */}
            <Route path="/video/:id" element={<VideoDetail />} />
            <Route path="/player/:id" element={<VideoPlayer />} />

            {/* Parent routes */}
            <Route path="/parent/login" element={<ParentLogin />} />
            <Route element={<ProtectedRoute><ParentLayout /></ProtectedRoute>}>
              <Route path="/parent/dashboard" element={<ParentDashboard />} />
              <Route path="/parent/add" element={<AddContent />} />
              <Route path="/parent/library" element={<ManageLibrary />} />
              <Route path="/parent/categories" element={<ManageCategories />} />
              <Route path="/parent/history" element={<WatchHistoryPage />} />
              <Route path="/parent/settings" element={<ParentSettings />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
