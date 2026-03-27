import { Category, Video, Profile, WatchHistory, Favorite } from '@/types';

export const mockProfile: Profile = {
  id: 'profile-1',
  name: 'Ahmed',
  avatar_url: 'lion',
  age: 4,
  default_age_min: 2,
  default_age_max: 8,
  created_at: new Date().toISOString(),
};

export const mockCategories: Category[] = [
  { id: 'cat-1', name: 'Islamic Stories', slug: 'islamic-stories', icon: '🌙', sort_order: 1, is_active: true, created_at: new Date().toISOString() },
  { id: 'cat-2', name: 'Quran', slug: 'quran', icon: '📖', sort_order: 2, is_active: true, created_at: new Date().toISOString() },
  { id: 'cat-3', name: 'Duas', slug: 'duas', icon: '🤲', sort_order: 3, is_active: true, created_at: new Date().toISOString() },
  { id: 'cat-4', name: 'Learning Islam', slug: 'learning-islam', icon: '🎓', sort_order: 4, is_active: true, created_at: new Date().toISOString() },
  { id: 'cat-5', name: 'Cartoons', slug: 'cartoons', icon: '🎬', sort_order: 5, is_active: true, created_at: new Date().toISOString() },
  { id: 'cat-6', name: 'Nasheeds', slug: 'nasheeds', icon: '🎵', sort_order: 6, is_active: true, created_at: new Date().toISOString() },
  { id: 'cat-7', name: 'Good Manners', slug: 'good-manners', icon: '🤝', sort_order: 7, is_active: true, created_at: new Date().toISOString() },
  { id: 'cat-8', name: 'Bedtime', slug: 'bedtime', icon: '🌜', sort_order: 8, is_active: true, created_at: new Date().toISOString() },
];

const yt = (id: string): string => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

const v = (id: string, title: string, ytId: string, cat: string, dur: number, ageMin: number, ageMax: number, tags: string[], opts: { featured?: boolean; noMusic?: boolean; desc?: string } = {}): Video => ({
  id,
  title,
  description: opts.desc || title,
  source_type: 'youtube',
  youtube_video_id: ytId,
  youtube_url: `https://youtube.com/watch?v=${ytId}`,
  thumbnail_url: yt(ytId),
  duration_seconds: dur,
  category_id: cat,
  language: 'English',
  tags,
  age_min: ageMin,
  age_max: ageMax,
  is_approved: true,
  is_featured: opts.featured || false,
  is_hidden: false,
  is_no_music: opts.noMusic || false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
});

export const mockVideos: Video[] = [
  // ====================== ISLAMIC STORIES (cat-1) ======================
  v('v1', 'Prophet Nuh (AS) - The Great Flood', 'UgMs1DEaOzs', 'cat-1', 720, 3, 10, ['prophets', 'animated'], { featured: true, desc: 'The story of Prophet Nuh and the great flood, beautifully animated.' }),
  v('v2', 'Prophet Yusuf (AS) - The Most Beautiful Story', 'zKZYclIe1-E', 'cat-1', 900, 3, 10, ['prophets', 'animated'], { featured: true }),
  v('v3', 'Prophet Ibrahim (AS) - Friend of Allah', 'BQn-H4FEnKU', 'cat-1', 840, 3, 10, ['prophets', 'animated']),
  v('v4', 'Prophet Musa (AS) and Pharaoh', '6y5v4xQAmls', 'cat-1', 960, 3, 10, ['prophets', 'animated']),
  v('v5', 'Prophet Muhammad ﷺ - The Last Messenger', 'Sgd1gFZVPeg', 'cat-1', 1200, 4, 12, ['prophets', 'seerah']),
  v('v6', 'Prophet Adam (AS) - The First Human', 'cTKxWrDL2Xo', 'cat-1', 780, 3, 10, ['prophets', 'creation']),
  v('v7', 'Prophet Sulaiman (AS) - King of Jinn', 'F7Pu_A7YpKo', 'cat-1', 660, 3, 10, ['prophets', 'animated']),
  v('v8', 'Prophet Isa (AS) - Jesus in Islam', 'Ke-JiStvl7A', 'cat-1', 720, 4, 12, ['prophets', 'animated']),
  v('v9', 'Prophet Dawud (AS) - The Brave King', '0ftR_0q1vAk', 'cat-1', 600, 3, 10, ['prophets', 'animated']),
  v('v10', 'Prophet Ismail (AS) - The Sacrifice', 'AwW8s_r4g4w', 'cat-1', 720, 3, 10, ['prophets', 'animated']),
  v('v11', 'The Story of Ashab Al-Kahf (Sleepers of the Cave)', 'voDslYJZPjw', 'cat-1', 900, 4, 12, ['stories', 'quran-stories']),
  v('v12', 'Prophet Yunus (AS) and the Whale', '64rh1744Quk', 'cat-1', 600, 3, 8, ['prophets', 'animated']),
  v('v13', 'Isra and Mi\'raj - Night Journey', 'MPCvPqIeCCs', 'cat-1', 840, 4, 12, ['prophets', 'isra-miraj'], { featured: true }),
  v('v14', 'The Elephant Army - Surah Al-Fil Story', 'VDHIBZA7gxg', 'cat-1', 480, 2, 8, ['stories', 'surah-stories']),
  v('v15', 'Prophet Shuaib (AS) Story', 'BQn-H4FEnKU', 'cat-1', 720, 3, 10, ['prophets']),

  // ====================== QURAN (cat-2) ======================
  v('v16', 'Surah Al-Fatiha for Kids - Repeated', 'MPCvPqIeCCs', 'cat-2', 300, 2, 12, ['quran', 'fatiha', 'memorize'], { featured: true, noMusic: true }),
  v('v17', 'Surah Al-Ikhlas - Learn & Memorize', 'VDHIBZA7gxg', 'cat-2', 240, 2, 12, ['quran', 'ikhlas', 'memorize'], { noMusic: true }),
  v('v18', 'Surah Al-Falaq for Kids', 'voDslYJZPjw', 'cat-2', 240, 2, 12, ['quran', 'falaq', 'memorize'], { noMusic: true }),
  v('v19', 'Surah An-Nas for Kids', 'MPCvPqIeCCs', 'cat-2', 240, 2, 12, ['quran', 'nas', 'memorize'], { noMusic: true }),
  v('v20', 'Surah Al-Kawthar for Kids', 'VDHIBZA7gxg', 'cat-2', 180, 2, 12, ['quran', 'kawthar'], { noMusic: true }),
  v('v21', 'Surah Al-Asr for Kids', 'voDslYJZPjw', 'cat-2', 180, 2, 12, ['quran', 'asr'], { noMusic: true }),
  v('v22', 'Surah Al-Fil for Kids', 'MPCvPqIeCCs', 'cat-2', 240, 2, 12, ['quran', 'fil'], { noMusic: true }),
  v('v23', 'Surah Al-Masad for Kids', 'VDHIBZA7gxg', 'cat-2', 240, 2, 12, ['quran', 'masad'], { noMusic: true }),
  v('v24', 'Surah An-Nasr for Kids', 'voDslYJZPjw', 'cat-2', 180, 2, 12, ['quran', 'nasr'], { noMusic: true }),
  v('v25', 'Surah Al-Kafiroon for Kids', 'MPCvPqIeCCs', 'cat-2', 240, 2, 12, ['quran', 'kafiroon'], { noMusic: true }),
  v('v26', 'Juz Amma Full - Short Surahs', 'VDHIBZA7gxg', 'cat-2', 3600, 3, 12, ['quran', 'juz-amma', 'full'], { noMusic: true }),
  v('v27', 'Surah Al-Mulk for Kids', 'voDslYJZPjw', 'cat-2', 600, 5, 12, ['quran', 'mulk'], { noMusic: true }),
  v('v28', 'Surah Yasin for Kids', 'MPCvPqIeCCs', 'cat-2', 900, 5, 12, ['quran', 'yasin'], { noMusic: true }),
  v('v29', 'Surah Al-Baqarah Last 2 Verses', 'VDHIBZA7gxg', 'cat-2', 300, 4, 12, ['quran', 'baqarah'], { noMusic: true }),
  v('v30', 'Ayatul Kursi - Repeated 10 Times', 'voDslYJZPjw', 'cat-2', 480, 3, 12, ['quran', 'ayatul-kursi', 'memorize'], { featured: true, noMusic: true }),

  // ====================== DUAS (cat-3) ======================
  v('v31', 'Daily Duas for Kids - Morning & Evening', 'MPCvPqIeCCs', 'cat-3', 420, 2, 10, ['duas', 'daily'], { noMusic: true }),
  v('v32', 'Dua Before Eating', 'VDHIBZA7gxg', 'cat-3', 120, 2, 8, ['duas', 'eating'], { noMusic: true }),
  v('v33', 'Dua Before Sleeping', 'voDslYJZPjw', 'cat-3', 120, 2, 8, ['duas', 'sleeping'], { noMusic: true }),
  v('v34', 'Dua When Entering Bathroom', 'MPCvPqIeCCs', 'cat-3', 90, 2, 8, ['duas', 'bathroom'], { noMusic: true }),
  v('v35', 'Dua When Leaving Home', 'VDHIBZA7gxg', 'cat-3', 90, 2, 8, ['duas', 'travel'], { noMusic: true }),
  v('v36', 'Dua for Parents', 'voDslYJZPjw', 'cat-3', 120, 3, 12, ['duas', 'parents'], { noMusic: true, featured: true }),
  v('v37', 'Dua When It Rains', 'MPCvPqIeCCs', 'cat-3', 90, 2, 8, ['duas', 'rain'], { noMusic: true }),
  v('v38', 'Dua After Wudu', 'VDHIBZA7gxg', 'cat-3', 120, 3, 10, ['duas', 'wudu'], { noMusic: true }),
  v('v39', 'Dua Before Exam / Study', 'voDslYJZPjw', 'cat-3', 120, 5, 12, ['duas', 'study'], { noMusic: true }),
  v('v40', 'Dua When Looking in Mirror', 'MPCvPqIeCCs', 'cat-3', 60, 3, 10, ['duas', 'mirror'], { noMusic: true }),
  v('v41', 'Essential Duas Compilation', 'VDHIBZA7gxg', 'cat-3', 900, 2, 12, ['duas', 'compilation'], { noMusic: true }),
  v('v42', 'Dua When Wearing New Clothes', 'voDslYJZPjw', 'cat-3', 90, 2, 8, ['duas', 'clothes'], { noMusic: true }),

  // ====================== LEARNING ISLAM (cat-4) ======================
  v('v43', 'Learn Arabic Alphabet with Zaky', '64rh1744Quk', 'cat-4', 2400, 2, 7, ['arabic', 'alphabet', 'zaky'], { featured: true }),
  v('v44', 'Five Pillars of Islam for Kids', 'UgMs1DEaOzs', 'cat-4', 600, 3, 10, ['pillars', 'basics']),
  v('v45', 'How to Make Wudu for Kids', 'zKZYclIe1-E', 'cat-4', 420, 3, 10, ['wudu', 'prayer']),
  v('v46', 'How to Pray Salah Step by Step', 'BQn-H4FEnKU', 'cat-4', 600, 4, 12, ['prayer', 'salah'], { featured: true }),
  v('v47', 'Learn About Ramadan', '6y5v4xQAmls', 'cat-4', 480, 3, 10, ['ramadan', 'fasting']),
  v('v48', 'What is Hajj? Explained for Kids', 'Sgd1gFZVPeg', 'cat-4', 540, 4, 12, ['hajj', 'pilgrimage']),
  v('v49', 'Names of Allah for Kids', 'cTKxWrDL2Xo', 'cat-4', 720, 3, 12, ['names-of-allah', 'learning']),
  v('v50', 'Islamic Months for Kids', 'F7Pu_A7YpKo', 'cat-4', 480, 4, 12, ['calendar', 'months']),
  v('v51', 'Learn About Zakat - Giving in Islam', 'Ke-JiStvl7A', 'cat-4', 360, 4, 10, ['zakat', 'charity']),
  v('v52', 'The Story of Ka\'bah', '0ftR_0q1vAk', 'cat-4', 600, 3, 12, ['kabah', 'history']),
  v('v53', 'Islamic Greeting - Assalamu Alaikum', 'AwW8s_r4g4w', 'cat-4', 300, 2, 7, ['greetings', 'salam']),
  v('v54', 'Days of the Week in Arabic', 'voDslYJZPjw', 'cat-4', 360, 3, 8, ['arabic', 'days']),
  v('v55', 'Numbers in Arabic 1-10', '64rh1744Quk', 'cat-4', 300, 2, 7, ['arabic', 'numbers']),
  v('v56', 'Colors in Arabic for Kids', 'UgMs1DEaOzs', 'cat-4', 300, 2, 7, ['arabic', 'colors']),

  // ====================== CARTOONS (cat-5) ======================
  v('v57', 'Omar & Hana - Full Episodes Compilation', 'cTKxWrDL2Xo', 'cat-5', 1800, 2, 7, ['omar-hana', 'compilation'], { featured: true }),
  v('v58', 'Omar & Hana - Say Bismillah!', 'AwW8s_r4g4w', 'cat-5', 360, 2, 7, ['omar-hana', 'bismillah']),
  v('v59', 'Omar & Hana - Alhamdulillah', '0ftR_0q1vAk', 'cat-5', 300, 2, 7, ['omar-hana', 'alhamdulillah']),
  v('v60', 'Omar & Hana - Assalamualaikum', 'Ke-JiStvl7A', 'cat-5', 360, 2, 7, ['omar-hana', 'greetings']),
  v('v61', 'Omar & Hana - First Day of Ramadan', 'Sgd1gFZVPeg', 'cat-5', 854, 2, 8, ['omar-hana', 'ramadan']),
  v('v62', 'Omar & Hana - Miss Laila', 'F7Pu_A7YpKo', 'cat-5', 600, 2, 7, ['omar-hana']),
  v('v63', 'Omar & Hana - Be Kind to Animals', '6y5v4xQAmls', 'cat-5', 420, 2, 7, ['omar-hana', 'kindness']),
  v('v64', 'Omar & Hana - Sharing is Caring', 'BQn-H4FEnKU', 'cat-5', 360, 2, 7, ['omar-hana', 'sharing']),
  v('v65', 'Omar & Hana - Clean and Tidy', 'zKZYclIe1-E', 'cat-5', 360, 2, 7, ['omar-hana', 'cleanliness']),
  v('v66', 'Omar & Hana - Love Your Parents', 'UgMs1DEaOzs', 'cat-5', 420, 2, 7, ['omar-hana', 'parents']),
  v('v67', 'Zaky Adventures - Full Episode', '64rh1744Quk', 'cat-5', 1800, 2, 8, ['zaky', 'adventure']),
  v('v68', 'Zaky - Learning with Animals', 'cTKxWrDL2Xo', 'cat-5', 720, 2, 7, ['zaky', 'animals']),
  v('v69', 'FreeQuranEducation - Animated Stories', 'F7Pu_A7YpKo', 'cat-5', 900, 3, 10, ['animated', 'quran-stories']),
  v('v70', 'Ghulam Rasool - Islamic Cartoon', 'Ke-JiStvl7A', 'cat-5', 1200, 4, 12, ['ghulam-rasool', 'cartoon']),
  v('v71', 'Omar & Hana - Eid Mubarak!', '0ftR_0q1vAk', 'cat-5', 480, 2, 7, ['omar-hana', 'eid']),
  v('v72', 'Omar & Hana - I Love My Mama', 'AwW8s_r4g4w', 'cat-5', 360, 2, 6, ['omar-hana', 'mother']),
  v('v73', 'Islamic Cartoon - Patience', 'Sgd1gFZVPeg', 'cat-5', 480, 3, 8, ['cartoon', 'patience']),
  v('v74', 'Omar & Hana - Wudu Song', 'BQn-H4FEnKU', 'cat-5', 300, 2, 7, ['omar-hana', 'wudu']),
  v('v75', 'Omar & Hana - Quran Time', 'zKZYclIe1-E', 'cat-5', 360, 2, 7, ['omar-hana', 'quran']),

  // ====================== NASHEEDS (cat-6) ======================
  v('v76', 'Tala Al Badru Alayna - Kids Nasheed', 'voDslYJZPjw', 'cat-6', 300, 2, 12, ['nasheed', 'classic'], { featured: true, noMusic: true }),
  v('v77', 'Bismillah Nasheed - Omar & Hana', 'AwW8s_r4g4w', 'cat-6', 240, 2, 7, ['nasheed', 'omar-hana']),
  v('v78', 'Alhamdulillah Nasheed for Kids', '0ftR_0q1vAk', 'cat-6', 240, 2, 7, ['nasheed']),
  v('v79', 'SubhanAllah Nasheed', 'Ke-JiStvl7A', 'cat-6', 240, 2, 8, ['nasheed', 'dhikr']),
  v('v80', 'Allahu Akbar - Kids Nasheed', 'F7Pu_A7YpKo', 'cat-6', 300, 2, 10, ['nasheed']),
  v('v81', 'Muhammad ﷺ Nasheed for Kids', '6y5v4xQAmls', 'cat-6', 360, 3, 12, ['nasheed', 'prophet']),
  v('v82', 'Ramadan Nasheed - Omar & Hana', 'Sgd1gFZVPeg', 'cat-6', 300, 2, 8, ['nasheed', 'ramadan']),
  v('v83', 'Assalamu Alaikum Nasheed', 'cTKxWrDL2Xo', 'cat-6', 240, 2, 7, ['nasheed', 'greeting']),
  v('v84', 'Allah is One - Tawheed Nasheed', 'BQn-H4FEnKU', 'cat-6', 300, 2, 10, ['nasheed', 'tawheed'], { noMusic: true }),
  v('v85', 'A is for Allah Nasheed', 'zKZYclIe1-E', 'cat-6', 300, 2, 7, ['nasheed', 'alphabet']),
  v('v86', 'I am a Muslim - Nasheed', 'UgMs1DEaOzs', 'cat-6', 240, 3, 10, ['nasheed', 'identity']),
  v('v87', 'Eid Song - Happy Eid Nasheed', '64rh1744Quk', 'cat-6', 300, 2, 8, ['nasheed', 'eid']),

  // ====================== GOOD MANNERS (cat-7) ======================
  v('v88', 'Say Bismillah Before You Eat', 'AwW8s_r4g4w', 'cat-7', 300, 2, 7, ['manners', 'eating']),
  v('v89', 'Be Kind to Others - Islamic Manners', '0ftR_0q1vAk', 'cat-7', 360, 2, 8, ['manners', 'kindness']),
  v('v90', 'Respect Your Parents in Islam', 'Ke-JiStvl7A', 'cat-7', 420, 3, 10, ['manners', 'parents']),
  v('v91', 'Honesty in Islam for Kids', 'F7Pu_A7YpKo', 'cat-7', 360, 3, 10, ['manners', 'honesty']),
  v('v92', 'Sharing with Others', '6y5v4xQAmls', 'cat-7', 300, 2, 7, ['manners', 'sharing']),
  v('v93', 'Good Table Manners in Islam', 'Sgd1gFZVPeg', 'cat-7', 300, 2, 8, ['manners', 'table']),
  v('v94', 'Being Grateful - Shukr', 'cTKxWrDL2Xo', 'cat-7', 360, 3, 10, ['manners', 'gratitude']),
  v('v95', 'Helping Others - Islamic Values', 'BQn-H4FEnKU', 'cat-7', 360, 2, 8, ['manners', 'helping']),
  v('v96', 'Keeping Promises in Islam', 'zKZYclIe1-E', 'cat-7', 300, 4, 10, ['manners', 'promises']),
  v('v97', 'How to Apologize - Saying Sorry', 'UgMs1DEaOzs', 'cat-7', 300, 2, 7, ['manners', 'apology']),

  // ====================== BEDTIME (cat-8) ======================
  v('v98', 'Bedtime Dua & Surah for Kids', 'voDslYJZPjw', 'cat-8', 600, 2, 8, ['bedtime', 'duas'], { noMusic: true }),
  v('v99', 'Calm Quran Recitation for Sleep', 'MPCvPqIeCCs', 'cat-8', 1800, 2, 12, ['bedtime', 'quran', 'calm'], { noMusic: true, featured: true }),
  v('v100', 'Prophet Stories Before Bed', 'VDHIBZA7gxg', 'cat-8', 1200, 3, 8, ['bedtime', 'stories']),
  v('v101', 'Goodnight Islamic Story', '64rh1744Quk', 'cat-8', 600, 2, 6, ['bedtime', 'stories']),
  v('v102', 'Surah Al-Mulk Before Sleep', 'MPCvPqIeCCs', 'cat-8', 600, 5, 12, ['bedtime', 'quran', 'mulk'], { noMusic: true }),
  v('v103', 'Sleeping Duas Compilation', 'VDHIBZA7gxg', 'cat-8', 480, 2, 10, ['bedtime', 'duas'], { noMusic: true }),
  v('v104', 'Calm Surah Rahman for Kids', 'voDslYJZPjw', 'cat-8', 1200, 3, 12, ['bedtime', 'quran', 'rahman'], { noMusic: true }),
  v('v105', 'Stars and Moon - Islamic Bedtime', '64rh1744Quk', 'cat-8', 480, 2, 6, ['bedtime', 'nature']),

  // === Admin test videos ===
  { id: 'v-pending', title: 'New Video - Pending Review', description: 'This video is pending parent approval.', source_type: 'youtube', youtube_video_id: 'MPCvPqIeCCs', thumbnail_url: yt('MPCvPqIeCCs'), duration_seconds: 420, category_id: 'cat-1', language: 'English', tags: ['pending'], age_min: 3, age_max: 8, is_approved: false, is_featured: false, is_hidden: false, is_no_music: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'v-hidden', title: 'Hidden Video Example', description: 'This video has been hidden by parent.', source_type: 'youtube', youtube_video_id: 'cTKxWrDL2Xo', thumbnail_url: yt('cTKxWrDL2Xo'), duration_seconds: 180, category_id: 'cat-5', language: 'English', tags: ['hidden'], age_min: 3, age_max: 8, is_approved: true, is_featured: false, is_hidden: true, is_no_music: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

export const mockWatchHistory: WatchHistory[] = [
  { id: 'wh-1', profile_id: 'profile-1', video_id: 'v1', watched_seconds: 360, completed: false, last_watched_at: new Date(Date.now() - 3600000).toISOString() },
  { id: 'wh-2', profile_id: 'profile-1', video_id: 'v16', watched_seconds: 300, completed: true, last_watched_at: new Date(Date.now() - 7200000).toISOString() },
  { id: 'wh-3', profile_id: 'profile-1', video_id: 'v57', watched_seconds: 120, completed: false, last_watched_at: new Date(Date.now() - 86400000).toISOString() },
  { id: 'wh-4', profile_id: 'profile-1', video_id: 'v76', watched_seconds: 300, completed: true, last_watched_at: new Date(Date.now() - 172800000).toISOString() },
  { id: 'wh-5', profile_id: 'profile-1', video_id: 'v58', watched_seconds: 200, completed: false, last_watched_at: new Date(Date.now() - 43200000).toISOString() },
];

export const mockFavorites: Favorite[] = [
  { id: 'fav-1', profile_id: 'profile-1', video_id: 'v57', created_at: new Date().toISOString() },
  { id: 'fav-2', profile_id: 'profile-1', video_id: 'v76', created_at: new Date().toISOString() },
  { id: 'fav-3', profile_id: 'profile-1', video_id: 'v16', created_at: new Date().toISOString() },
  { id: 'fav-4', profile_id: 'profile-1', video_id: 'v43', created_at: new Date().toISOString() },
  { id: 'fav-5', profile_id: 'profile-1', video_id: 'v1', created_at: new Date().toISOString() },
];
