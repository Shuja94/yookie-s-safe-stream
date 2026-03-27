

## No-Music Islamic Videos Feature

### Reality Check
Removing music from a playing YouTube video in real-time is **not possible** — that would require real-time audio separation AI, which can't be done on embedded YouTube videos where we don't control the audio stream.

**What IS possible and practical:** Add a **"No Music" section** and tagging system so parents can curate and children can browse Islamic videos that are specifically music-free (nasheeds without instruments, Quran recitations, spoken stories, etc.).

### Plan

1. **Add `is_no_music` flag to Video type** (`src/types/index.ts`)
   - Add `is_no_music: boolean` to the `Video` interface

2. **Tag existing videos** (`src/data/mock-data.ts`)
   - Mark Quran surahs, duas, and spoken prophet stories as `is_no_music: true`
   - Add a few new no-music videos (e.g., Quran recitations for kids, no-music nasheeds)
   - Mark videos with background music as `is_no_music: false`

3. **Add store helper** (`src/lib/store.ts`)
   - Add `getNoMusicVideos(age)` method to filter approved videos where `is_no_music === true`

4. **Add "No Music" section to Child Home** (`src/pages/ChildHome.tsx`)
   - Add a new `VideoRow` titled "🔇 No Music" between existing rows showing only music-free content

5. **Add filter toggle on Category Browse** (`src/pages/CategoryBrowse.tsx`)
   - Add a "No Music Only" toggle/chip so parents or children can filter any category view to music-free content

6. **Parent content management** (`src/pages/parent/AddContent.tsx`)
   - Add a "No Music" checkbox when adding/editing videos so parents can tag content appropriately

