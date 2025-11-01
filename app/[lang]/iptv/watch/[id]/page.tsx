import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { PageProps } from "@/types/languages";
import { getDictionary } from "@/utils/dictionaries";
import { fetchPlaylist } from "@/utils/iptv/parse-playlist";
import { ShizuruPlayer } from "@/components/shizuru-player";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Container } from "@/components/ui/container";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Link from "next/link";

type IPTVWatchPageProps = PageProps<{ id: string }>;

export async function generateMetadata(props: IPTVWatchPageProps): Promise<Metadata> {
  const { lang, id } = await props.params;
  const dictionary = await getDictionary(lang);
  
  const channels = await fetchPlaylist();
  const channel = channels.find((ch) => ch.id === decodeURIComponent(id));
  
  const title = channel ? `Watch ${channel.name} - Live TV` : "Watch Live TV";
  const description = channel 
    ? `Watch ${channel.name} live on Enjoytown`
    : "Watch live TV channels on Enjoytown";

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

export default async function IPTVWatchPage(props: IPTVWatchPageProps) {
  const { lang, id } = await props.params;
  const dictionary = await getDictionary(lang);
  
  const channels = await fetchPlaylist();
  const channelId = decodeURIComponent(id);
  const channel = channels.find((ch) => ch.id === channelId);
  
  if (!channel) {
    notFound();
  }

  // Pass original URL; player will attempt direct first and fallback to proxy
  const streamUrl = channel.url;

  return (
    <>
      <header className="sticky top-0 z-50 flex h-14 items-center gap-2 border-b backdrop-blur px-3 sm:px-6 rounded-t-2xl overflow-hidden">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-sm sm:text-base font-medium truncate">{channel.name}</h1>
      </header>

      <div className="flex justify-center items-center pt-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link href={`/${lang}/iptv`}>Live TV</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>{channel.name}</BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <Container>
        <div className="max-w-5xl mx-auto space-y-6 pt-4 px-4 pb-6 lg:px-0 lg:pt-4">
          <ShizuruPlayer src={streamUrl} autoPlay />
          
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">{channel.name}</h2>
              {channel.group && (
                <p className="text-sm text-muted-foreground">
                  Category: {channel.group}
                </p>
              )}
              {channel.country && (
                <p className="text-sm text-muted-foreground">
                  Country: {channel.country}
                </p>
              )}
              {channel.isHD && (
                <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-primary text-primary-foreground rounded">
                  HD
                </span>
              )}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}

