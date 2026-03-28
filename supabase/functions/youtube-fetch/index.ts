const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface VideoItem {
  videoId: string;
  title: string;
  thumbnail: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('YOUTUBE_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'YouTube API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { type, id, pageToken } = await req.json();

    if (!type || !id) {
      return new Response(
        JSON.stringify({ success: false, error: 'type and id are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (type !== 'playlist' && type !== 'channel') {
      return new Response(
        JSON.stringify({ success: false, error: 'type must be "playlist" or "channel"' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let videos: VideoItem[] = [];
    let nextPageToken: string | null = null;

    if (type === 'playlist') {
      const result = await fetchPlaylistItems(apiKey, id, pageToken);
      videos = result.videos;
      nextPageToken = result.nextPageToken;
    } else {
      // For channels, first get the uploads playlist ID, then fetch from it
      const uploadsId = await getUploadsPlaylistId(apiKey, id);
      if (!uploadsId) {
        return new Response(
          JSON.stringify({ success: false, error: 'Could not find uploads playlist for this channel' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const result = await fetchPlaylistItems(apiKey, uploadsId, pageToken);
      videos = result.videos;
      nextPageToken = result.nextPageToken;
    }

    return new Response(
      JSON.stringify({ success: true, videos, nextPageToken }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('YouTube fetch error:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: msg }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function fetchPlaylistItems(
  apiKey: string,
  playlistId: string,
  pageToken?: string
): Promise<{ videos: VideoItem[]; nextPageToken: string | null }> {
  const params = new URLSearchParams({
    part: 'snippet',
    playlistId,
    maxResults: '50',
    key: apiKey,
  });
  if (pageToken) params.set('pageToken', pageToken);

  const res = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?${params}`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error?.message || `YouTube API error ${res.status}`);
  }

  const videos: VideoItem[] = (data.items || [])
    .filter((item: any) => {
      const id = item.snippet?.resourceId?.videoId;
      return id && /^[a-zA-Z0-9_-]{11}$/.test(id);
    })
    .map((item: any) => ({
      videoId: item.snippet.resourceId.videoId,
      title: item.snippet.title || '',
      thumbnail: `https://img.youtube.com/vi/${item.snippet.resourceId.videoId}/hqdefault.jpg`,
    }))
    .filter((v: VideoItem) => v.title !== 'Private video' && v.title !== 'Deleted video');

  return {
    videos,
    nextPageToken: data.nextPageToken || null,
  };
}

async function getUploadsPlaylistId(apiKey: string, channelId: string): Promise<string | null> {
  // Try as channel ID first
  let params = new URLSearchParams({
    part: 'contentDetails',
    id: channelId,
    key: apiKey,
  });

  let res = await fetch(`https://www.googleapis.com/youtube/v3/channels?${params}`);
  let data = await res.json();

  if (data.items?.length > 0) {
    return data.items[0].contentDetails?.relatedPlaylists?.uploads || null;
  }

  // Try as username/handle
  params = new URLSearchParams({
    part: 'contentDetails',
    forHandle: channelId,
    key: apiKey,
  });

  res = await fetch(`https://www.googleapis.com/youtube/v3/channels?${params}`);
  data = await res.json();

  if (data.items?.length > 0) {
    return data.items[0].contentDetails?.relatedPlaylists?.uploads || null;
  }

  return null;
}
