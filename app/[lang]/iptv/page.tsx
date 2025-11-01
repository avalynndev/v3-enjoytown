import type { Metadata } from "next";
import Link from "next/link";
import type { PageProps } from "@/types/languages";
import { getDictionary } from "@/utils/dictionaries";
import { fetchPlaylist } from "@/utils/iptv/parse-playlist";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Container } from "@/components/ui/container";

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { lang } = await props.params;
  const dictionary = await getDictionary(lang);

  const title = "Live TV";
  const description = "Explore and watch live TV channels from around the world.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: "Enjoytown",
    },
    twitter: {
      title,
      description,
    },
  };
}

export default async function IPTVPage(props: PageProps) {
  const { lang } = await props.params;
  const dictionary = await getDictionary(lang);
  
  const channels = await fetchPlaylist();
  
  // Group channels by category
  const groupedChannels = channels.reduce((acc, channel) => {
    const group = channel.group || "Other";
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(channel);
    return acc;
  }, {} as Record<string, typeof channels>);

  return (
    <>
      <header className="sticky top-0 z-50 flex h-14 items-center gap-2 border-b backdrop-blur rounded-t-2xl px-3 sm:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-sm sm:text-base font-medium truncate">Live TV</h1>
      </header>

      <Container>
        <div className="space-y-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Live TV Channels</h1>
              <p className="text-muted-foreground mt-1">
                {channels.length} channels available
              </p>
            </div>
          </div>

          {Object.entries(groupedChannels).map(([group, groupChannels]) => (
            <div key={group} className="space-y-4">
              <h2 className="text-xl font-semibold">{group}</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {groupChannels.map((channel, index) => (
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
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" title={channel.name}>
                          {channel.name}
                        </p>
                        {channel.isHD && (
                          <span className="text-xs text-primary font-medium">HD</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </>
  );
}
