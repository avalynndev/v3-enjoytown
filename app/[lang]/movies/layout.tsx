import Carousel from "@/components/carousel";
import { MovieTabs } from "./_components/tabs";
import { Container } from "@/components/ui/container";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header className="sticky top-0 z-50 flex h-14 items-center gap-2 border-b backdrop-blur rounded-t-2xl px-3 sm:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-sm sm:text-base font-medium truncate">Movies</h1>
      </header>
      <Container>
        <Carousel />
        <MovieTabs
          tabs={["Discover", "Now Playing", "Popular", "Top Rated", "Upcoming"]}
        />
        {children}
      </Container>
    </>
  );
}
