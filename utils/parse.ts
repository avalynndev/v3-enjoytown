// utils/parse.ts
export type Channel = {
  id: string;
  name: string;
  logo?: string;
  group?: string;
  isHD?: boolean;
  country?: string;
  url: string;
};

/**
 * Fetch IPTV playlist and optionally filter by country.
 * @param country e.g. "India" or "United States"
 */
export async function fetchPlaylist(country?: string): Promise<Channel[]> {
  const res = await fetch("https://iptv-org.github.io/iptv/index.m3u", {
    next: { revalidate: 3600 }, // cache for 1 hour
  });

  const text = await res.text();

  // Example parser for M3U format
  const lines = text.split("\n");
  const channels: Channel[] = [];

  let current: Partial<Channel> = {};
  for (const line of lines) {
    if (line.startsWith("#EXTINF:")) {
      const nameMatch = line.match(/,(.+)$/);
      const name = nameMatch ? nameMatch[1].trim() : "Unknown";

      const logoMatch = line.match(/tvg-logo="([^"]+)"/);
      const logo = logoMatch ? logoMatch[1] : undefined;

      const groupMatch = line.match(/group-title="([^"]+)"/);
      const group = groupMatch ? groupMatch[1] : undefined;

      const countryMatch = line.match(/country="([^"]+)"/);
      const countryName = countryMatch ? countryMatch[1] : undefined;

      current = {
        id: crypto.randomUUID(),
        name,
        logo,
        group,
        country: countryName,
      };
    } else if (line.startsWith("http")) {
      current.url = line.trim();
      if (current.name && current.url) {
        // Filter by country if specified
        if (
          !country ||
          current.country?.toLowerCase().includes(country.toLowerCase())
        ) {
          channels.push(current as Channel);
        }
      }
      current = {};
    }
  }

  return channels;
}
