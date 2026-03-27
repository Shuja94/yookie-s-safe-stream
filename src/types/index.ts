export interface Profile {
  id: string;
  name: string;
  avatar_url?: string;
  age: number;
  default_age_min: number;
  default_age_max: number;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  source_type: 'youtube' | 'hosted';
  youtube_url?: string;
  youtube_video_id?: string;
  video_url?: string;
  thumbnail_url: string;
  duration_seconds: number;
  category_id: string;
  language: string;
  tags: string[];
  age_min: number;
  age_max: number;
  is_approved: boolean;
  is_featured: boolean;
  is_hidden: boolean;
  is_no_music: boolean;
  safe_notes?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface Favorite {
  id: string;
  profile_id: string;
  video_id: string;
  created_at: string;
}

export interface WatchHistory {
  id: string;
  profile_id: string;
  video_id: string;
  watched_seconds: number;
  completed: boolean;
  last_watched_at: string;
}

export interface AppSettings {
  id: string;
  app_name: string;
  subtitle: string;
  logo_url?: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  child_mode_locked: boolean;
  default_profile_id?: string;
  updated_at: string;
}

export type VideoWithCategory = Video & { category?: Category };
