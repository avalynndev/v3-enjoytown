import type { IPTVChannel } from "@/types/iptv";
import { APP_URL } from "@/constants";

const SOURCE_URL = "https://raw.githubusercontent.com/Free-TV/IPTV/master/playlist.m3u8";

function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

export async function fetchPlaylist(): Promise<IPTVChannel[]> {
  const envProxy = process.env.PROXY_M3U8 ?? "";
  const localProxy = `${APP_URL}/api/proxy?url=`;
  const tryUrls = [
    `${localProxy}${encodeURIComponent(SOURCE_URL)}`,
    envProxy ? `${envProxy}${encodeURIComponent(SOURCE_URL)}` : null,
    SOURCE_URL,
  ].filter(Boolean) as string[];

  let res: Response | null = null;
  let lastError: unknown = null;
  for (const url of tryUrls) {
    try {
      res = await fetch(url, { cache: "no-store" });
      if (res.ok) break;
      lastError = new Error(`Request failed: ${res.status}`);
    } catch (e) {
      lastError = e;
    }
  }

  if (!res || !res.ok) {
    console.error("Failed to fetch IPTV playlist", lastError);
    return [];
  }
  const text = await res.text();

  const lines = text.split(/\r?\n/);
  const channels: IPTVChannel[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.startsWith("#EXTINF")) continue;
    
    const next = lines[i + 1] ?? "";
    const nameMatch = line.split(",").pop() ?? "Channel";
    
    const logoMatch = /tvg-logo="([^"]+)"/.exec(line)?.[1];
    const groupMatch = /group-title="([^"]+)"/.exec(line)?.[1];
    const countryMatch = /tvg-country="([^"]+)"/.exec(line)?.[1];
    const languageMatch = /tvg-language="([^"]+)"/.exec(line)?.[1];
    const idMatch = /tvg-id="([^"]+)"/.exec(line)?.[1];
    
    const isHD = /\[HD\]|HD/i.test(line);
    
    const url = next.startsWith("http") ? next.trim() : "";
    if (!url) continue;
    
    const channelId = hashString(url);
    
    channels.push({
      id: channelId,
      name: nameMatch.trim(),
      url,
      logo: logoMatch,
      group: groupMatch,
      country: countryMatch,
      language: languageMatch,
      isHD,
    });
  }
  
  return channels;
}

