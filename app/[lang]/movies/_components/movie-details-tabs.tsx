import { Suspense } from "react";

import { Images } from "@/components/images";
import { getDictionary } from "@/utils/dictionaries";
import { Tabs, TabsContent, TabsTrigger, TabsList } from "@/components/ui/tabs";
import { Container } from "@/components/ui/container";
import { Videos } from "@/components/videos";
import { Credits } from "@/components/credits";
import { Language } from "@/tmdb";
import {
  Carousel,
  CarouselNext,
  CarouselPrevious,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { PosterCard } from "@/components/ui/poster-card";
import { tmdb } from "@/services/tmdb";
import { tmdbImage } from "@/utils/tmdb/image";

export async function MovieDetailsTabs({
  lang,
  id,
}: {
  lang: Language;
  id: number;
}) {
  const dictionary = await getDictionary(lang);
  const similar = await tmdb.movies.related(id, "similar", lang);

  const recommendations = await tmdb.movies.related(
    id,
    "recommendations",
    lang,
  );

  return (
    <Container>
      <Tabs defaultValue="credits" className="w-full p-4 lg:p-0">
        <div className="md:m-none p-none -mx-4 max-w-[100vw] overflow-x-scroll px-4 scrollbar-hide">
          <TabsList>
            <TabsTrigger value="credits">{dictionary.tabs.credits}</TabsTrigger>
            <TabsTrigger value="images">{dictionary.tabs.images}</TabsTrigger>
            <TabsTrigger value="videos">{dictionary.tabs.videos}</TabsTrigger>
            <TabsTrigger value="similar">{dictionary.tabs.similar}</TabsTrigger>
            <TabsTrigger value="recommended">
              {dictionary.tabs.recommendations}
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="credits" className="mt-4">
          <Suspense>
            <Credits id={Number(id)} variant="movie" language={lang} />
          </Suspense>
        </TabsContent>
        <TabsContent value="images" className="mt-4">
          <Suspense>
            <Images
              tmdbId={Number(id)}
              variant="movie"
              dictionary={dictionary}
            />
          </Suspense>
        </TabsContent>
        <TabsContent value="videos" className="mt-4">
          <Suspense>
            <Videos
              tmdbId={Number(id)}
              variant="movie"
              dictionary={dictionary}
            />
          </Suspense>
        </TabsContent>
        <TabsContent value="similar" className="mt-4">
          <Suspense>
            <div className="mx-auto max-w-6xl px-4 pb-8">
              <h1 className="mt-10 mb-6 text-xl sm:text-2xl font-bold">
                Similar Movies
              </h1>
              <Carousel className="w-full">
                <CarouselContent className="-ml-1">
                  {similar.results.map((movie) => (
                    <CarouselItem
                      key={movie.id}
                      className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6"
                    >
                      <a href={`/movie/${movie.id}`}>
                        <PosterCard.Root>
                          <PosterCard.Image
                            src={tmdbImage(movie.poster_path, "w500")}
                            alt={movie.title}
                          />
                        </PosterCard.Root>
                      </a>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          </Suspense>
        </TabsContent>
        <TabsContent value="recommended" className="mt-4">
          <Suspense>
            <div className="mx-auto max-w-6xl px-4 pb-8">
              <h1 className="mt-10 mb-6 text-xl sm:text-2xl font-bold">
                Recommended Movies
              </h1>
              <Carousel className="w-full">
                <CarouselContent className="-ml-1">
                  {recommendations.results.map((movie) => (
                    <CarouselItem
                      key={movie.id}
                      className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6"
                    >
                      <a href={`/movie/${movie.id}`}>
                        <PosterCard.Root>
                          <PosterCard.Image
                            src={tmdbImage(movie.poster_path, "w500")}
                            alt={movie.title}
                          />
                        </PosterCard.Root>
                      </a>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          </Suspense>
        </TabsContent>
      </Tabs>
    </Container>
  );
}
