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
  { id: 'cat-2', name: 'Quran & Surahs', slug: 'quran-surahs', icon: '📖', sort_order: 2, is_active: true, created_at: new Date().toISOString() },
  { id: 'cat-3', name: 'Good Manners', slug: 'good-manners', icon: '🤝', sort_order: 3, is_active: true, created_at: new Date().toISOString() },
  { id: 'cat-4', name: 'Learning', slug: 'learning', icon: '🎓', sort_order: 4, is_active: true, created_at: new Date().toISOString() },
  { id: 'cat-5', name: 'Cartoons', slug: 'cartoons', icon: '🎬', sort_order: 5, is_active: true, created_at: new Date().toISOString() },
  { id: 'cat-6', name: 'Animals', slug: 'animals', icon: '🐾', sort_order: 6, is_active: true, created_at: new Date().toISOString() },
  { id: 'cat-7', name: 'Bedtime', slug: 'bedtime', icon: '🌜', sort_order: 7, is_active: true, created_at: new Date().toISOString() },
  { id: 'cat-8', name: 'Nasheeds', slug: 'nasheeds', icon: '🎵', sort_order: 8, is_active: true, created_at: new Date().toISOString() },
  { id: 'cat-9', name: 'Family Friendly', slug: 'family-friendly', icon: '👨‍👩‍👧', sort_order: 9, is_active: true, created_at: new Date().toISOString() },
  { id: 'cat-10', name: 'Duas', slug: 'duas', icon: '🤲', sort_order: 10, is_active: true, created_at: new Date().toISOString() },
];

const yt = (id: string): string => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

export const mockVideos: Video[] = [
  // === Islamic Stories (Prophet stories) ===
  { id: 'v1', title: 'Prophet Nuh (AS) - Quran Stories', description: 'The story of Prophet Nuh and the great flood, beautifully animated for children.', source_type: 'youtube', youtube_video_id: 'UgMs1DEaOzs', youtube_url: 'https://youtube.com/watch?v=UgMs1DEaOzs', thumbnail_url: yt('UgMs1DEaOzs'), duration_seconds: 720, category_id: 'cat-1', language: 'English', tags: ['prophets', 'stories', 'animated'], age_min: 3, age_max: 8, is_approved: true, is_featured: true, is_hidden: false, is_no_music: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'v2', title: 'Prophet Ishaq & Yaqub (AS) - Stories of the Prophets', description: 'Learn about Prophet Ishaq and Yaqub in this animated Islamic story.', source_type: 'youtube', youtube_video_id: 'zKZYclIe1-E', youtube_url: 'https://youtube.com/watch?v=zKZYclIe1-E', thumbnail_url: yt('zKZYclIe1-E'), duration_seconds: 756, category_id: 'cat-1', language: 'English', tags: ['prophets', 'stories', 'animated'], age_min: 3, age_max: 10, is_approved: true, is_featured: false, is_hidden: false, is_no_music: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'v3', title: 'Prophet Shuaib (AS) - Quran Stories for Kids', description: 'The inspiring story of Prophet Shuaib told for children.', source_type: 'youtube', youtube_video_id: 'BQn-H4FEnKU', youtube_url: 'https://youtube.com/watch?v=BQn-H4FEnKU', thumbnail_url: yt('BQn-H4FEnKU'), duration_seconds: 840, category_id: 'cat-1', language: 'English', tags: ['prophets', 'stories'], age_min: 3, age_max: 10, is_approved: true, is_featured: false, is_hidden: false, is_no_music: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'v40', title: 'Isra and Mi\'raj - Omar & Hana', description: 'Learn about the miraculous Night Journey with Omar & Hana.', source_type: 'youtube', youtube_video_id: '6y5v4xQAmls', youtube_url: 'https://youtube.com/watch?v=6y5v4xQAmls', thumbnail_url: yt('6y5v4xQAmls'), duration_seconds: 845, category_id: 'cat-1', language: 'English', tags: ['prophets', 'stories', 'omar-hana', 'isra-miraj'], age_min: 3, age_max: 10, is_approved: true, is_featured: true, is_hidden: false, is_no_music: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  // === Quran & Surahs (no music — pure recitation) ===
  { id: 'v4', title: 'Surah Al-Fatiha - Learn Quran with Zakaria', description: 'Learn Surah Al-Fatiha repeated 10 times for easy memorization.', source_type: 'youtube', youtube_video_id: 'MPCvPqIeCCs', youtube_url: 'https://youtube.com/watch?v=MPCvPqIeCCs', thumbnail_url: yt('MPCvPqIeCCs'), duration_seconds: 300, category_id: 'cat-2', language: 'Arabic', tags: ['quran', 'surah', 'fatiha', 'zakaria', 'memorize'], age_min: 2, age_max: 12, is_approved: true, is_featured: true, is_hidden: false, is_no_music: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'v5', title: 'Surah Al-Ikhlas to An-Nas for Kids', description: 'Learn the last short surahs of the Quran — Al-Ikhlas, Al-Falaq and An-Nas.', source_type: 'youtube', youtube_video_id: 'VDHIBZA7gxg', youtube_url: 'https://youtube.com/watch?v=VDHIBZA7gxg', thumbnail_url: yt('VDHIBZA7gxg'), duration_seconds: 480, category_id: 'cat-2', language: 'Arabic', tags: ['quran', 'surah', 'ikhlas', 'falaq', 'nas', 'memorize'], age_min: 2, age_max: 12, is_approved: true, is_featured: false, is_hidden: false, is_no_music: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  // === Good Manners ===
  { id: 'v6', title: 'Omar & Hana - Say Bismillah!', description: 'Omar and Hana remind us to always say Bismillah before we eat!', source_type: 'youtube', youtube_video_id: 'AwW8s_r4g4w', youtube_url: 'https://youtube.com/watch?v=AwW8s_r4g4w', thumbnail_url: yt('AwW8s_r4g4w'), duration_seconds: 360, category_id: 'cat-3', language: 'English', tags: ['omar-hana', 'manners', 'bismillah'], age_min: 2, age_max: 7, is_approved: true, is_featured: false, is_hidden: false, is_no_music: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'v34', title: 'Omar & Hana - Alhamdulillah', description: 'A catchy nasheed from Omar & Hana about saying Alhamdulillah.', source_type: 'youtube', youtube_video_id: '0ftR_0q1vAk', youtube_url: 'https://youtube.com/watch?v=0ftR_0q1vAk', thumbnail_url: yt('0ftR_0q1vAk'), duration_seconds: 300, category_id: 'cat-3', language: 'English', tags: ['omar-hana', 'alhamdulillah', 'manners'], age_min: 2, age_max: 7, is_approved: true, is_featured: false, is_hidden: false, is_no_music: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  // === Learning ===
  { id: 'v7', title: 'Let\'s Learn Arabic with Zaky - Full Movie', description: 'Learn Arabic letters, numbers and more with Zaky in this full educational movie.', source_type: 'youtube', youtube_video_id: '64rh1744Quk', youtube_url: 'https://youtube.com/watch?v=64rh1744Quk', thumbnail_url: yt('64rh1744Quk'), duration_seconds: 2687, category_id: 'cat-4', language: 'English', tags: ['arabic', 'learning', 'zaky', 'alphabet'], age_min: 2, age_max: 7, is_approved: true, is_featured: true, is_hidden: false, is_no_music: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  // === Cartoons (Omar & Hana, Zaky) ===
  { id: 'v9', title: 'Omar & Hana - Full Episodes Compilation', description: 'Enjoy a full compilation of Omar & Hana Islamic cartoon episodes.', source_type: 'youtube', youtube_video_id: 'cTKxWrDL2Xo', youtube_url: 'https://youtube.com/watch?v=cTKxWrDL2Xo', thumbnail_url: yt('cTKxWrDL2Xo'), duration_seconds: 1800, category_id: 'cat-5', language: 'English', tags: ['cartoon', 'omar-hana', 'compilation'], age_min: 2, age_max: 7, is_approved: true, is_featured: true, is_hidden: false, is_no_music: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'v15', title: 'Omar & Hana - Miss Laila', description: 'Omar and Hana meet Miss Laila in this fun Islamic cartoon episode.', source_type: 'youtube', youtube_video_id: 'F7Pu_A7YpKo', youtube_url: 'https://youtube.com/watch?v=F7Pu_A7YpKo', thumbnail_url: yt('F7Pu_A7YpKo'), duration_seconds: 600, category_id: 'cat-5', language: 'English', tags: ['cartoon', 'omar-hana'], age_min: 2, age_max: 7, is_approved: true, is_featured: false, is_hidden: false, is_no_music: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'v16', title: 'Omar & Hana - Assalamualaikum', description: 'Learn how to greet others the Islamic way with Omar and Hana!', source_type: 'youtube', youtube_video_id: 'Ke-JiStvl7A', youtube_url: 'https://youtube.com/watch?v=Ke-JiStvl7A', thumbnail_url: yt('Ke-JiStvl7A'), duration_seconds: 360, category_id: 'cat-5', language: 'English', tags: ['cartoon', 'omar-hana', 'greetings', 'salam'], age_min: 2, age_max: 7, is_approved: true, is_featured: false, is_hidden: false, is_no_music: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'v17', title: 'First Day of Ramadan - Omar & Hana', description: 'Celebrate the first day of Ramadan with Omar and Hana!', source_type: 'youtube', youtube_video_id: 'Sgd1gFZVPeg', youtube_url: 'https://youtube.com/watch?v=Sgd1gFZVPeg', thumbnail_url: yt('Sgd1gFZVPeg'), duration_seconds: 854, category_id: 'cat-5', language: 'English', tags: ['cartoon', 'omar-hana', 'ramadan'], age_min: 2, age_max: 8, is_approved: true, is_featured: false, is_hidden: false, is_no_music: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  // === Nasheeds ===
  { id: 'v12', title: 'Tala Al Badru Alayna - Nasheed for Kids', description: 'The beautiful classic nasheed Tala al Badru Alayna sung by children.', source_type: 'youtube', youtube_video_id: 'voDslYJZPjw', youtube_url: 'https://youtube.com/watch?v=voDslYJZPjw', thumbnail_url: yt('voDslYJZPjw'), duration_seconds: 300, category_id: 'cat-8', language: 'Arabic', tags: ['nasheed', 'classic', 'tala-al-badru'], age_min: 2, age_max: 12, is_approved: true, is_featured: true, is_hidden: false, is_no_music: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  // === Duas (no music — spoken duas) ===
  { id: 'v41', title: 'Daily Duas for Kids - Morning & Evening', description: 'Learn essential daily duas for morning and evening, spoken clearly for children.', source_type: 'youtube', youtube_video_id: 'MPCvPqIeCCs', youtube_url: 'https://youtube.com/watch?v=MPCvPqIeCCs', thumbnail_url: yt('MPCvPqIeCCs'), duration_seconds: 420, category_id: 'cat-10', language: 'Arabic', tags: ['duas', 'daily', 'morning', 'evening'], age_min: 2, age_max: 12, is_approved: true, is_featured: false, is_hidden: false, is_no_music: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'v42', title: 'Dua Before Eating & Sleeping', description: 'Important duas every Muslim child should know — before eating and before sleeping.', source_type: 'youtube', youtube_video_id: 'VDHIBZA7gxg', youtube_url: 'https://youtube.com/watch?v=VDHIBZA7gxg', thumbnail_url: yt('VDHIBZA7gxg'), duration_seconds: 300, category_id: 'cat-10', language: 'Arabic', tags: ['duas', 'eating', 'sleeping'], age_min: 2, age_max: 10, is_approved: true, is_featured: false, is_hidden: false, is_no_music: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  // === Family Friendly ===
  { id: 'v21', title: 'Omar & Hana - First Day Ramadan Compilation', description: 'A special Ramadan compilation from Omar & Hana for the whole family.', source_type: 'youtube', youtube_video_id: 'Sgd1gFZVPeg', youtube_url: 'https://youtube.com/watch?v=Sgd1gFZVPeg', thumbnail_url: yt('Sgd1gFZVPeg'), duration_seconds: 854, category_id: 'cat-9', language: 'English', tags: ['omar-hana', 'ramadan', 'family'], age_min: 2, age_max: 10, is_approved: true, is_featured: false, is_hidden: false, is_no_music: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  // === Pending / hidden for admin view ===
  { id: 'v13', title: 'New Video - Pending Review', description: 'This video is pending parent approval.', source_type: 'youtube', youtube_video_id: 'MPCvPqIeCCs', thumbnail_url: yt('MPCvPqIeCCs'), duration_seconds: 420, category_id: 'cat-1', language: 'English', tags: ['pending'], age_min: 3, age_max: 8, is_approved: false, is_featured: false, is_hidden: false, is_no_music: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'v14', title: 'Hidden Video Example', description: 'This video has been hidden by parent.', source_type: 'youtube', youtube_video_id: 'cTKxWrDL2Xo', thumbnail_url: yt('cTKxWrDL2Xo'), duration_seconds: 180, category_id: 'cat-5', language: 'English', tags: ['hidden'], age_min: 3, age_max: 8, is_approved: true, is_featured: false, is_hidden: true, is_no_music: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

export const mockWatchHistory: WatchHistory[] = [
  { id: 'wh-1', profile_id: 'profile-1', video_id: 'v1', watched_seconds: 360, completed: false, last_watched_at: new Date(Date.now() - 3600000).toISOString() },
  { id: 'wh-2', profile_id: 'profile-1', video_id: 'v4', watched_seconds: 300, completed: true, last_watched_at: new Date(Date.now() - 7200000).toISOString() },
  { id: 'wh-3', profile_id: 'profile-1', video_id: 'v9', watched_seconds: 120, completed: false, last_watched_at: new Date(Date.now() - 86400000).toISOString() },
  { id: 'wh-4', profile_id: 'profile-1', video_id: 'v12', watched_seconds: 300, completed: true, last_watched_at: new Date(Date.now() - 172800000).toISOString() },
  { id: 'wh-5', profile_id: 'profile-1', video_id: 'v6', watched_seconds: 200, completed: false, last_watched_at: new Date(Date.now() - 43200000).toISOString() },
];

export const mockFavorites: Favorite[] = [
  { id: 'fav-1', profile_id: 'profile-1', video_id: 'v9', created_at: new Date().toISOString() },
  { id: 'fav-2', profile_id: 'profile-1', video_id: 'v12', created_at: new Date().toISOString() },
  { id: 'fav-3', profile_id: 'profile-1', video_id: 'v4', created_at: new Date().toISOString() },
  { id: 'fav-4', profile_id: 'profile-1', video_id: 'v6', created_at: new Date().toISOString() },
  { id: 'fav-5', profile_id: 'profile-1', video_id: 'v7', created_at: new Date().toISOString() },
];
