import Carousel from "@/components/carousel";
import { TvTabs } from "./tabs";
import { Container } from "@/components/ui/container";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Language } from "@/tmdb";

export default async function TvLayout({
  children,
  language,
  title,
}: Readonly<{
  children: React.ReactNode;
  language: Language;
  title: string;
}>) {
  return (
    <>
      <header className="sticky top-0 z-50 flex h-14 items-center gap-2 border-b backdrop-blur rounded-t-2xl px-3 sm:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-sm sm:text-base font-medium truncate">{title}</h1>
      </header>

      <Container>
        <Carousel type="tv-series" language={language} />
        <TvTabs
          tabs={[
            "Discover",
            "On The Air",
            "Popular",
            "Top Rated",
            "Airing Today",
          ]}
        />
        {children}
      </Container>
    </>
  );
}
