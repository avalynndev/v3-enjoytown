"use client";

import { use, useEffect, useState, useMemo } from "react";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import type { PageProps } from "@/types/languages";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";

interface Channel {
  id: string;
  name: string;
  logo?: string;
  group?: string;
  isHD?: boolean;
}

export default function IPTVPage({ params }: PageProps) {
  const { lang } = use(params);
  const [allChannels, setAllChannels] = useState<Channel[]>([]);
  const [displayedChannels, setDisplayedChannels] = useState<Channel[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const { ref, inView } = useInView({ threshold: 0 });
  const pageSize = 60;

  // Initial load
  useEffect(() => {
    async function loadAll() {
      const res = await fetch("https://iptv-org.github.io/api/channels.json", {
        next: { revalidate: 3600 },
      });
      const data: Channel[] = await res.json();
      setAllChannels(data);
      setDisplayedChannels(data.slice(0, pageSize));
      setIsLoading(false);
    }
    loadAll();
  }, []);

  // Infinite scroll
  useEffect(() => {
    if (inView && !isLoading && search === "") {
      const nextPage = page + 1;
      const nextSlice = allChannels.slice(0, nextPage * pageSize);
      setDisplayedChannels(nextSlice);
      setPage(nextPage);
    }
  }, [inView, isLoading, allChannels, page, search]);

  // Search filtering (instant)
  const filteredChannels = useMemo(() => {
    if (!search.trim()) return displayedChannels;
    return allChannels.filter((ch) =>
      ch.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, displayedChannels, allChannels]);

  if (isLoading) {
    return (
      <Container>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 py-6">
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className="p-3 rounded-md border bg-muted animate-pulse h-32"
            />
          ))}
        </div>
      </Container>
    );
  }

  return (
    <>
      <header className="sticky top-0 z-50 flex h-14 items-center gap-2 border-b backdrop-blur rounded-t-2xl px-3 sm:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 h-4" />
        <h1 className="text-sm sm:text-base font-medium truncate">Live TV</h1>
      </header>

      <Container>
        <div className="space-y-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold">Live TV Channels</h1>
              <p className="text-muted-foreground mt-1">
                {filteredChannels.length} of {allChannels.length} channels
              </p>
            </div>
            <Input
              type="text"
              placeholder="Search channels..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full sm:w-64"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {filteredChannels.map((channel, index) => (
              <Link
                key={`${channel.id}-${index}`}
                href={`/${lang}/iptv/watch/${encodeURIComponent(channel.id)}`}
              >
                <div className="p-3 rounded-md border bg-card hover:bg-accent transition-colors cursor-pointer h-full flex flex-col">
                  <div className="aspect-video bg-muted rounded-md mb-2 flex items-center justify-center overflow-hidden">
                    {channel.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={channel.logo}
                        alt={channel.name}
                        loading="lazy"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-xs text-muted-foreground text-center px-2">
                        {channel.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <p
                    className="text-sm font-medium truncate"
                    title={channel.name}
                  >
                    {channel.name}
                  </p>
                </div>
              </Link>
            ))}

            {/* Infinite scroll trigger */}
            {search === "" && displayedChannels.length < allChannels.length && (
              <>
                <div
                  ref={ref}
                  className="p-3 rounded-md border bg-muted animate-pulse h-32"
                />
                <div className="p-3 rounded-md border bg-muted animate-pulse h-32" />
                <div className="p-3 rounded-md border bg-muted animate-pulse h-32" />
              </>
            )}
          </div>
        </div>
      </Container>
    </>
  );
}
