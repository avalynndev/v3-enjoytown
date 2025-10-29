import Carousel from "@/components/carousel";
import { MovieTabs } from "./_components/tabs";
import { Container } from "@/components/ui/container";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Container>
      <Carousel />
      <MovieTabs
        tabs={["Discover", "Now Playing", "Popular", "Top Rated", "Upcoming"]}
      />
      {children}
    </Container>
  );
}
