// app/api/iptv/route.ts
import { NextResponse } from "next/server";

const PAGE_SIZE = 50;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") || 1);

  // Fetch everything just once (cached for an hour)
  const [channelsRes, streamsRes, logosRes, blocklistRes] = await Promise.all([
    fetch("https://iptv-org.github.io/api/channels.json", {
      next: { revalidate: 3600 },
    }),
    fetch("https://iptv-org.github.io/api/streams.json", {
      next: { revalidate: 3600 },
    }),
    fetch("https://iptv-org.github.io/api/logos.json", {
      next: { revalidate: 3600 },
    }),
    fetch("https://iptv-org.github.io/api/blocklist.json", {
      next: { revalidate: 3600 },
    }),
  ]);

  const [channels, streams, logos, blocklist] = await Promise.all([
    channelsRes.json(),
    streamsRes.json(),
    logosRes.json(),
    blocklistRes.json(),
  ]);

  // Filter and enrich
  const available = channels
    .filter((ch: any) => !blocklist.some((b: any) => b.channel === ch.id))
    .map((ch: any) => {
      const stream = streams.find((s: any) => s.channel === ch.id);
      const logo = logos.find((l: any) => l.channel === ch.id);
      return {
        id: ch.id,
        name: ch.name,
        logo: logo?.url ?? null,
        group: ch.categories?.[0] ?? "Other",
        country: ch.country,
        url: stream?.url ?? null,
      };
    })
    .filter((c: any) => c.url);

  // Pagination
  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const data = available.slice(start, end);

  return NextResponse.json({
    channels: data,
    total: available.length,
    hasMore: end < available.length,
  });
}
