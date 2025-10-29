"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";

export function TvTabs({ tabs }: { tabs: string[] }) {
  const router = useRouter();

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

  const handleTabChange = (value: string) => {
    const slug = slugify(value);
    router.push(slug == "discover" ? "/tv-series" : `/tv-series/${slug}`);
  };

  const visibleTabs = tabs.filter((tab) => slugify(tab));

  return (
    <>
      <Tabs
        onValueChange={handleTabChange}
        className="w-full mt-6 hidden md:flex"
      >
        <TabsList className={`grid w-full grid-cols-5 pb-4`}>
          {visibleTabs.map((tab) => {
            const value = slugify(tab);
            return (
              <TabsTrigger
                key={value}
                value={value}
                className="hover:border-[#ccc] hover:ring-ring/50 hover:shadow-md transition-all duration-300"
              >
                {tab}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>
      <div className="overflow-hidden md:hidden border rounded-xl max-h-80 mt-2 mb-4">
        <div className="flex flex-col gap-3 rounded-xl bg-white/50 backdrop-blur-md shadow-md p-4 text-center dark:bg-background">
          {[
            { href: "/tv-series", label: "Discover" },
            { href: "/tv-series/airing-today", label: "Airing Today" },
            { href: "/tv-series/popular", label: "Popular" },
            { href: "/tv-series/top-rated", label: "Top Rated" },
            { href: "/tv-series/on-the-air", label: "On The Air" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium hover:text-sky-700 transition"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
