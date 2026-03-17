import { Category, Video, Profile, WatchHistory, Favorite } from '@/types';

export const mockProfile: Profile = {
  id: 'profile-1',
  name: 'Yookie',
  avatar_url: '',
  age: 4,
  default_age_min: 2,
  default_age_max: 6,
  created_at: new Date().toISOString(),
};

export const mockCategories: Category[] = [
  { id: 'cat-1', name: 'Islamic Stories', slug: 'islamic-stories', icon: '🌙', sort_order: 1, is_active: true, created_at: new Date().toISOString() },
  { id: 'cat-2', name: 'Quran & Duas', slug: 'quran-duas', icon: '📖', sort_order: 2, is_active: true, created_at: new Date().toISOString() },
  { id: 'cat-3', name: 'Good Manners', slug: 'good-manners', icon: '🤝', sort_order: 3, is_active: true, created_at: new Date().toISOString() },
  { id: 'cat-4', name: 'Learning', slug: 'learning', icon: '🎓', sort_order: 4, is_active: true, created_at: new Date().toISOString() },
  { id: 'cat-5', name: 'Cartoons', slug: 'cartoons', icon: '🎬', sort_order: 5, is_active: true, created_at: new Date().toISOString() },
  { id: 'cat-6', name: 'Animals', slug: 'animals', icon: '🐾', sort_order: 6, is_active: true, created_at: new Date().toISOString() },
  { id: 'cat-7', name: 'Bedtime', slug: 'bedtime', icon: '🌜', sort_order: 7, is_active: true, created_at: new Date().toISOString() },
  { id: 'cat-8', name: 'Nasheeds', slug: 'nasheeds', icon: '🎵', sort_order: 8, is_active: true, created_at: new Date().toISOString() },
  { id: 'cat-9', name: 'Family Friendly', slug: 'family-friendly', icon: '👨‍👩‍👧', sort_order: 9, is_active: true, created_at: new Date().toISOString() },
  { id: 'cat-10', name: 'Educational Shorts', slug: 'educational-shorts', icon: '⚡', sort_order: 10, is_active: true, created_at: new Date().toISOString() },
];

const yt = (id: string): string => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

export const mockVideos: Video[] = [
  // Islamic Stories
  { id: 'v1', title: 'The Story of Prophet Nuh', description: 'A beautiful animated story about Prophet Nuh and the great flood.', source_type: 'youtube', youtube_video_id: 'dQw4w9WgXcQ', youtube_url: 'https://youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: yt('dQw4w9WgXcQ'), duration_seconds: 720, category_id: 'cat-1', language: 'English', tags: ['prophets', 'stories', 'animated'], age_min: 3, age_max: 8, is_approved: true, is_featured: true, is_hidden: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'v2', title: 'The Story of Prophet Ibrahim', description: 'Learn about Prophet Ibrahim and his faith.', source_type: 'youtube', youtube_video_id: 'J---aiyznGQ', youtube_url: 'https://youtube.com/watch?v=J---aiyznGQ', thumbnail_url: yt('J---aiyznGQ'), duration_seconds: 900, category_id: 'cat-1', language: 'English', tags: ['prophets', 'stories'], age_min: 3, age_max: 10, is_approved: true, is_featured: false, is_hidden: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'v3', title: 'The Story of Prophet Yusuf', description: 'The beautiful story of Prophet Yusuf.', source_type: 'youtube', youtube_video_id: '2Vv-BfVoq4g', youtube_url: 'https://youtube.com/watch?v=2Vv-BfVoq4g', thumbnail_url: yt('2Vv-BfVoq4g'), duration_seconds: 840, category_id: 'cat-1', language: 'English', tags: ['prophets', 'stories'], age_min: 3, age_max: 10, is_approved: true, is_featured: true, is_hidden: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  // Quran & Duas
  { id: 'v4', title: 'Surah Al-Fatiha for Kids', description: 'Learn Surah Al-Fatiha with beautiful recitation.', source_type: 'youtube', youtube_video_id: 'LLPZtD3M5cE', thumbnail_url: yt('LLPZtD3M5cE'), duration_seconds: 300, category_id: 'cat-2', language: 'Arabic', tags: ['quran', 'surah', 'learning'], age_min: 2, age_max: 12, is_approved: true, is_featured: false, is_hidden: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'v5', title: 'Morning & Evening Duas', description: 'Beautiful collection of daily duas for children.', source_type: 'youtube', youtube_video_id: 'YR5ApYxkU-U', thumbnail_url: yt('YR5ApYxkU-U'), duration_seconds: 480, category_id: 'cat-2', language: 'English', tags: ['duas', 'daily'], age_min: 2, age_max: 10, is_approved: true, is_featured: false, is_hidden: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  // Good Manners
  { id: 'v6', title: 'Saying Please and Thank You', description: 'Learn the importance of good manners.', source_type: 'youtube', youtube_video_id: '9bZkp7q19f0', thumbnail_url: yt('9bZkp7q19f0'), duration_seconds: 360, category_id: 'cat-3', language: 'English', tags: ['manners', 'kindness'], age_min: 2, age_max: 7, is_approved: true, is_featured: false, is_hidden: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  // Learning
  { id: 'v7', title: 'ABC Song - Learn the Alphabet', description: 'Fun alphabet learning song.', source_type: 'youtube', youtube_video_id: 'hq3yfQnllfQ', thumbnail_url: yt('hq3yfQnllfQ'), duration_seconds: 240, category_id: 'cat-4', language: 'English', tags: ['alphabet', 'songs', 'learning'], age_min: 2, age_max: 5, is_approved: true, is_featured: true, is_hidden: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'v8', title: 'Counting 1 to 10', description: 'Learn to count with colorful animations.', source_type: 'youtube', youtube_video_id: 'pRpeEdMmmQ0', thumbnail_url: yt('pRpeEdMmmQ0'), duration_seconds: 300, category_id: 'cat-4', language: 'English', tags: ['numbers', 'counting'], age_min: 2, age_max: 5, is_approved: true, is_featured: false, is_hidden: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  // Cartoons
  { id: 'v9', title: 'Omar & Hana - Sharing is Caring', description: 'Omar and Hana learn about sharing.', source_type: 'youtube', youtube_video_id: 'kJQP7kiw5Fk', thumbnail_url: yt('kJQP7kiw5Fk'), duration_seconds: 660, category_id: 'cat-5', language: 'English', tags: ['cartoon', 'omar-hana'], age_min: 3, age_max: 8, is_approved: true, is_featured: false, is_hidden: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  // Animals
  { id: 'v10', title: 'Animals of the Quran', description: 'Discover animals mentioned in the Quran.', source_type: 'youtube', youtube_video_id: 'RgKAFK5djSk', thumbnail_url: yt('RgKAFK5djSk'), duration_seconds: 540, category_id: 'cat-6', language: 'English', tags: ['animals', 'quran', 'learning'], age_min: 3, age_max: 10, is_approved: true, is_featured: false, is_hidden: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  // Bedtime
  { id: 'v11', title: 'Bedtime Quran Recitation', description: 'Soothing Quran recitation for bedtime.', source_type: 'youtube', youtube_video_id: 'fJ9rUzIMcZQ', thumbnail_url: yt('fJ9rUzIMcZQ'), duration_seconds: 1200, category_id: 'cat-7', language: 'Arabic', tags: ['quran', 'bedtime', 'calm'], age_min: 0, age_max: 12, is_approved: true, is_featured: false, is_hidden: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  // Nasheeds
  { id: 'v12', title: 'Tala Al Badru Alayna', description: 'Beautiful nasheed for children.', source_type: 'youtube', youtube_video_id: 'CevxZvSJLk8', thumbnail_url: yt('CevxZvSJLk8'), duration_seconds: 300, category_id: 'cat-8', language: 'Arabic', tags: ['nasheed', 'songs'], age_min: 2, age_max: 12, is_approved: true, is_featured: true, is_hidden: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  // Pending / hidden for admin view
  { id: 'v13', title: 'New Video - Pending Review', description: 'This video is pending parent approval.', source_type: 'youtube', youtube_video_id: 'M7lc1UVf-VE', thumbnail_url: yt('M7lc1UVf-VE'), duration_seconds: 420, category_id: 'cat-1', language: 'English', tags: ['pending'], age_min: 3, age_max: 8, is_approved: false, is_featured: false, is_hidden: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'v14', title: 'Hidden Video Example', description: 'This video has been hidden by parent.', source_type: 'youtube', youtube_video_id: 'jNQXAC9IVRw', thumbnail_url: yt('jNQXAC9IVRw'), duration_seconds: 180, category_id: 'cat-5', language: 'English', tags: ['hidden'], age_min: 3, age_max: 8, is_approved: true, is_featured: false, is_hidden: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

export const mockWatchHistory: WatchHistory[] = [
  { id: 'wh-1', profile_id: 'profile-1', video_id: 'v1', watched_seconds: 360, completed: false, last_watched_at: new Date(Date.now() - 3600000).toISOString() },
  { id: 'wh-2', profile_id: 'profile-1', video_id: 'v4', watched_seconds: 300, completed: true, last_watched_at: new Date(Date.now() - 7200000).toISOString() },
  { id: 'wh-3', profile_id: 'profile-1', video_id: 'v7', watched_seconds: 120, completed: false, last_watched_at: new Date(Date.now() - 86400000).toISOString() },
  { id: 'wh-4', profile_id: 'profile-1', video_id: 'v12', watched_seconds: 300, completed: true, last_watched_at: new Date(Date.now() - 172800000).toISOString() },
];

export const mockFavorites: Favorite[] = [
  { id: 'fav-1', profile_id: 'profile-1', video_id: 'v1', created_at: new Date().toISOString() },
  { id: 'fav-2', profile_id: 'profile-1', video_id: 'v12', created_at: new Date().toISOString() },
  { id: 'fav-3', profile_id: 'profile-1', video_id: 'v4', created_at: new Date().toISOString() },
];
