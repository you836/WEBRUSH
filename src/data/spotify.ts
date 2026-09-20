import type { LifeActivity } from '@/types';

export interface SpotifyRecord {
  spotify_track_uri: string;
  ts: string;
  platform: string;
  ms_played: string;
  track_name: string;
  artist_name: string;
  album_name: string;
  reason_start: string;
  reason_end: string;
  shuffle: string;
  skipped: string;
}

/** Infer genre from artist name for categorization */
function inferGenre(artist: string): string {
  const a = artist.toLowerCase();
  if (['arijit', 'rahman', 'shreya', 'kumar sanu', 'kishore', 'lata', 'sonu nigam', 'atif', 'neha kakkar', 'badshah', 'yo yo'].some(k => a.includes(k))) return 'Bollywood';
  if (['drake', 'kendrick', 'kanye', 'jay-z', 'eminem', 'travis', 'j. cole', 'migos', 'cardi', 'nicki', 'lil', '21 savage', 'post malone'].some(k => a.includes(k))) return 'Hip-Hop';
  if (['metallica', 'nirvana', 'foo fighters', 'linkin', 'green day', 'radiohead', 'coldplay', 'imagine dragons', 'arctic monkeys', 'red hot', 'queens'].some(k => a.includes(k))) return 'Rock';
  if (['bad bunny', 'j balvin', 'daddy yankee', 'ozuna', 'shakira', 'rosalia', 'maluma'].some(k => a.includes(k))) return 'Latin';
  if (['bts', 'blackpink', 'twice', 'stray', 'exo', 'nct', 'itzy', 'aespa'].some(k => a.includes(k))) return 'K-Pop';
  if (['beethoven', 'mozart', 'bach', 'chopin', 'classical', 'vivaldi'].some(k => a.includes(k))) return 'Classical';
  if (['miles davis', 'john coltrane', 'louis armstrong', 'ella fitzgerald', 'billie holiday', 'norah jones'].some(k => a.includes(k))) return 'Jazz';
  if (['avicii', 'marshmello', 'calvin harris', 'david guetta', 'tiesto', 'zedd', 'skrillex', 'deadmau5', 'daft punk', 'martin garrix', 'kygo', 'flume'].some(k => a.includes(k))) return 'Electronic';
  return 'Pop';
}

export function normalizeSpotifyData(records: SpotifyRecord[]): LifeActivity[] {
  return records
    .filter(r => r.track_name && r.artist_name && r.ts)
    .map((r) => {
      const genre = inferGenre(r.artist_name);
      const msPlayed = parseInt(r.ms_played) || 0;
      return {
        id: crypto.randomUUID(),
        source: 'music' as const,
        timestamp: normalizeTimestamp(r.ts),
        title: `${r.track_name} — ${r.artist_name}`,
        description: r.album_name ? `From album "${r.album_name}"` : undefined,
        category: genre,
        tags: [r.artist_name, genre, ...(r.album_name ? [r.album_name] : [])],
        metadata: {
          artist: r.artist_name,
          album: r.album_name,
          durationMs: msPlayed,
          platform: r.platform,
          shuffle: r.shuffle === 'TRUE',
          skipped: r.skipped === 'TRUE',
          trackUri: r.spotify_track_uri,
          reasonStart: r.reason_start,
          reasonEnd: r.reason_end,
        },
      };
    });
}

function normalizeTimestamp(ts: string): string {
  // Handle "2024-12-15 23:06:22" format -> ISO
  if (ts.includes('T')) return ts;
  const parts = ts.split(' ');
  if (parts.length === 2) return `${parts[0]}T${parts[1]}Z`;
  return `${ts}T00:00:00Z`;
}
