// Simple in-memory store for mock data (will be replaced with Supabase)
import { Video, Category, WatchHistory, Favorite, Profile } from '@/types';
import { mockVideos, mockCategories, mockWatchHistory, mockFavorites, mockProfile } from '@/data/mock-data';

class AppStore {
  videos: Video[] = [...mockVideos];
  categories: Category[] = [...mockCategories];
  watchHistory: WatchHistory[] = [...mockWatchHistory];
  favorites: Favorite[] = [...mockFavorites];
  profile: Profile = { ...mockProfile };
  isParentMode = false;
  private listeners: Set<() => void> = new Set();

  subscribe(fn: () => void) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }

  getApprovedVideos(age?: number): Video[] {
    return this.videos.filter(v => {
      if (!v.is_approved || v.is_hidden) return false;
      if (age !== undefined) {
        return age >= v.age_min && age <= v.age_max;
      }
      return true;
    });
  }

  getFeaturedVideos(age?: number): Video[] {
    return this.getApprovedVideos(age).filter(v => v.is_featured);
  }

  getVideosByCategory(categoryId: string, age?: number): Video[] {
    return this.getApprovedVideos(age).filter(v => v.category_id === categoryId);
  }

  getVideo(id: string): Video | undefined {
    return this.videos.find(v => v.id === id);
  }

  getCategory(id: string): Category | undefined {
    return this.categories.find(c => c.id === id);
  }

  getCategoryBySlug(slug: string): Category | undefined {
    return this.categories.find(c => c.slug === slug);
  }

  isFavorite(videoId: string): boolean {
    return this.favorites.some(f => f.video_id === videoId && f.profile_id === this.profile.id);
  }

  toggleFavorite(videoId: string) {
    const existing = this.favorites.find(f => f.video_id === videoId && f.profile_id === this.profile.id);
    if (existing) {
      this.favorites = this.favorites.filter(f => f.id !== existing.id);
    } else {
      this.favorites.push({
        id: `fav-${Date.now()}`,
        profile_id: this.profile.id,
        video_id: videoId,
        created_at: new Date().toISOString(),
      });
    }
    this.notify();
  }

  getFavoriteVideos(age?: number): Video[] {
    const favIds = this.favorites.filter(f => f.profile_id === this.profile.id).map(f => f.video_id);
    return this.getApprovedVideos(age).filter(v => favIds.includes(v.id));
  }

  getWatchHistory(): (WatchHistory & { video?: Video })[] {
    return this.watchHistory
      .filter(wh => wh.profile_id === this.profile.id)
      .sort((a, b) => new Date(b.last_watched_at).getTime() - new Date(a.last_watched_at).getTime())
      .map(wh => ({ ...wh, video: this.getVideo(wh.video_id) }));
  }

  getContinueWatching(age?: number): (WatchHistory & { video: Video })[] {
    const approved = this.getApprovedVideos(age);
    return this.watchHistory
      .filter(wh => wh.profile_id === this.profile.id && !wh.completed)
      .sort((a, b) => new Date(b.last_watched_at).getTime() - new Date(a.last_watched_at).getTime())
      .map(wh => ({ ...wh, video: approved.find(v => v.id === wh.video_id)! }))
      .filter(wh => wh.video);
  }

  updateWatchProgress(videoId: string, seconds: number, completed: boolean) {
    const existing = this.watchHistory.find(wh => wh.video_id === videoId && wh.profile_id === this.profile.id);
    if (existing) {
      existing.watched_seconds = seconds;
      existing.completed = completed;
      existing.last_watched_at = new Date().toISOString();
    } else {
      this.watchHistory.push({
        id: `wh-${Date.now()}`,
        profile_id: this.profile.id,
        video_id: videoId,
        watched_seconds: seconds,
        completed,
        last_watched_at: new Date().toISOString(),
      });
    }
    this.notify();
  }

  addVideo(video: Omit<Video, 'id' | 'created_at' | 'updated_at'>): Video {
    const newVideo: Video = {
      ...video,
      id: `v-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.videos.push(newVideo);
    this.notify();
    return newVideo;
  }

  updateVideo(id: string, updates: Partial<Video>) {
    const idx = this.videos.findIndex(v => v.id === id);
    if (idx >= 0) {
      this.videos[idx] = { ...this.videos[idx], ...updates, updated_at: new Date().toISOString() };
      this.notify();
    }
  }

  deleteVideo(id: string) {
    this.videos = this.videos.filter(v => v.id !== id);
    this.notify();
  }

  addCategory(cat: Omit<Category, 'id' | 'created_at'>): Category {
    const newCat: Category = {
      ...cat,
      id: `cat-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    this.categories.push(newCat);
    this.notify();
    return newCat;
  }

  updateCategory(id: string, updates: Partial<Category>) {
    const idx = this.categories.findIndex(c => c.id === id);
    if (idx >= 0) {
      this.categories[idx] = { ...this.categories[idx], ...updates };
      this.notify();
    }
  }

  deleteCategory(id: string) {
    this.categories = this.categories.filter(c => c.id !== id);
    this.notify();
  }

  getNoMusicVideos(age?: number): Video[] {
    return this.getApprovedVideos(age).filter(v => v.is_no_music);
  }

  getRecommendations(videoId: string, age?: number, limit = 6): Video[] {
    const video = this.getVideo(videoId);
    if (!video) return [];
    const approved = this.getApprovedVideos(age).filter(v => v.id !== videoId);
    const sameCategory = approved.filter(v => v.category_id === video.category_id);
    const others = approved.filter(v => v.category_id !== video.category_id);
    return [...sameCategory, ...others].slice(0, limit);
  }
}

export const store = new AppStore();
