// Simple in-memory store for mock data (will be replaced with Supabase)
import { Video, Category, WatchHistory, Favorite, Profile } from '@/types';
import { mockVideos, mockCategories, mockWatchHistory, mockFavorites, mockProfile } from '@/data/mock-data';

const PROFILES_KEY = 'halalplay_profiles';
const ACTIVE_PROFILE_KEY = 'halalplay_active_profile';

function loadProfiles(): Profile[] {
  try {
    const raw = localStorage.getItem(PROFILES_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [{ ...mockProfile }];
}

function saveProfiles(profiles: Profile[]) {
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
}

class AppStore {
  videos: Video[] = [...mockVideos];
  categories: Category[] = [...mockCategories];
  watchHistory: WatchHistory[] = [...mockWatchHistory];
  favorites: Favorite[] = [...mockFavorites];
  profiles: Profile[] = loadProfiles();
  activeProfileId: string | null = localStorage.getItem(ACTIVE_PROFILE_KEY);
  isParentMode = false;
  private listeners: Set<() => void> = new Set();

  get profile(): Profile {
    if (this.activeProfileId) {
      const found = this.profiles.find(p => p.id === this.activeProfileId);
      if (found) return found;
    }
    return this.profiles[0] || mockProfile;
  }

  set profile(p: Profile) {
    const idx = this.profiles.findIndex(pr => pr.id === p.id);
    if (idx >= 0) {
      this.profiles[idx] = p;
    }
    saveProfiles(this.profiles);
    this.notify();
  }

  selectProfile(id: string) {
    this.activeProfileId = id;
    localStorage.setItem(ACTIVE_PROFILE_KEY, id);
    this.notify();
  }

  clearActiveProfile() {
    this.activeProfileId = null;
    localStorage.removeItem(ACTIVE_PROFILE_KEY);
    this.notify();
  }

  addProfile(data: { name: string; avatar_url: string; age: number }): Profile {
    const p: Profile = {
      id: `profile-${Date.now()}`,
      name: data.name,
      avatar_url: data.avatar_url,
      age: data.age,
      default_age_min: Math.max(0, data.age - 2),
      default_age_max: Math.min(12, data.age + 2),
      created_at: new Date().toISOString(),
    };
    this.profiles.push(p);
    saveProfiles(this.profiles);
    this.notify();
    return p;
  }

  updateProfile(id: string, updates: Partial<Profile>) {
    const idx = this.profiles.findIndex(p => p.id === id);
    if (idx >= 0) {
      this.profiles[idx] = { ...this.profiles[idx], ...updates };
      saveProfiles(this.profiles);
      this.notify();
    }
  }

  deleteProfile(id: string) {
    if (this.profiles.length <= 1) return; // keep at least one
    this.profiles = this.profiles.filter(p => p.id !== id);
    if (this.activeProfileId === id) this.clearActiveProfile();
    saveProfiles(this.profiles);
    this.notify();
  }

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
      if (!v.thumbnail_url) return false;
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

  addVideo(video: Omit<Video, 'id' | 'created_at' | 'updated_at'>): Video | null {
    // Reject entries without a valid YouTube video ID and thumbnail
    if (!video.youtube_video_id || !/^[a-zA-Z0-9_-]{11}$/.test(video.youtube_video_id)) {
      return null;
    }
    if (!video.thumbnail_url || !video.thumbnail_url.includes('img.youtube.com')) {
      return null;
    }
    // Reject duplicates
    if (this.videos.some(v => v.youtube_video_id === video.youtube_video_id)) {
      return null;
    }
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

  setAvatar(avatarId: string) {
    this.updateProfile(this.profile.id, { avatar_url: avatarId });
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
    // Shuffle both pools for variety
    const shuffled = (arr: typeof approved) => {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    };
    return [...shuffled(sameCategory), ...shuffled(others)].slice(0, limit);
  }
}

export const store = new AppStore();
