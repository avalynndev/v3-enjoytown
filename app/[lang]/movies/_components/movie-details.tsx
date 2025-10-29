import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import { PosterCard } from "@/components/ui/poster-card";
import { tmdbImage } from "@/utils/tmdb/image";
import { tmdb } from "@/services/tmdb";
import type { MovieDetails } from "@/tmdb";
import { Language } from "@/types/languages";
type MovieDetailsProps = {
  id: number;
  language: Language;
};
export async function MovieDetails({ id, language }: MovieDetailsProps) {
  const movieDetails = await tmdb.movies.details(id, language);

  const progress = {
    current: 20,
    total: movieDetails.runtime,
    formatted: `20m / ${Math.floor(movieDetails.runtime / 60)}h ${
      movieDetails.runtime % 60
    }m`,
  };

  const similar = await tmdb.movies.related(id, "similar", language);
  const recommendations = await tmdb.movies.related(
    id,
    "recommendations",
    language
  );

  return (
    <>
      <header className="sticky top-0 z-50 flex h-14 items-center gap-2 border-b backdrop-blur px-3 sm:px-6 rounded-t-2xl overflow-hidden">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-sm sm:text-base font-medium truncate">
          {movieDetails.title}
        </h1>
      </header>
      <div className="relative w-full h-[60vh] sm:h-[70vh] lg:h-[774px]">
        <div className="relative w-full h-[774px]">
          <div
            style={{
              backgroundSize: "cover",
              backgroundPosition: "center top",
              maskImage:
                "linear-gradient(to top, rgba(0, 0, 0, 0), rgb(0, 0, 0) 700px)",
              WebkitMaskImage:
                "linear-gradient(to top, rgba(0, 0, 0, 0), rgb(0, 0, 0) 700px)",
            }}
            className="blur-xs"
          >
            <img
              className="w-full h-full object-cover rounded-t-2xl"
              alt={movieDetails.title}
              src={tmdbImage(movieDetails.backdrop_path, "original")}
            />
          </div>
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          {movieDetails.poster_path && (
            <img
              className="mb-4 w-[140px] sm:w-[180px] lg:w-[220px] rounded-md shadow-lg"
              alt={`${movieDetails.title} title`}
              src={tmdbImage(movieDetails.poster_path, "w500")}
            />
          )}
          <div className="flex flex-col sm:flex-row gap-3 mb-6 mx-auto bg-card backdrop-blur-xl rounded-2xl p-3">
            <Button className="border">▶ Resume</Button>
            <Button variant="outline" className="">
              ℹ Info
            </Button>
            <Button variant="secondary" className="items-center gap-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M5 3L19 12L5 21V3Z" fill="currentColor" />
              </svg>
              Watch Trailer
            </Button>
          </div>

          <div className="w-full max-w-xs sm:max-w-md flex flex-col items-center gap-2 bg-card backdrop-blur-xl rounded-2xl p-4">
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              ⏱ Watch Progress
            </div>
            <Progress
              value={(progress.current / progress.total) * 100}
              className="h-1 w-full"
            />
            <div className="flex justify-between w-full text-xs">
              <span>{progress.formatted}</span>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-none">
                  {movieDetails.vote_average.toFixed(1)}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">About</h2>
        <p className="text-muted-foreground leading-relaxed mb-6">
          {movieDetails.overview}
        </p>

        {movieDetails.tagline && (
          <blockquote className="italic text-lg text-gray-400 border-l-4 border-gray-600 pl-4 mb-6">
            “{movieDetails.tagline}”
          </blockquote>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-semibold">Release Date:</span>{" "}
            {movieDetails.release_date}
          </div>
          <div>
            <span className="font-semibold">Runtime:</span>{" "}
            {Math.floor(movieDetails.runtime / 60)}h {movieDetails.runtime % 60}
            m
          </div>
          <div>
            <span className="font-semibold">Status:</span> {movieDetails.status}
          </div>
          <div>
            <span className="font-semibold">Budget:</span> $
            {movieDetails.budget.toLocaleString()}
          </div>
          <div>
            <span className="font-semibold">Revenue:</span> $
            {movieDetails.revenue.toLocaleString()}
          </div>
          <div>
            <span className="font-semibold">Languages:</span>{" "}
            {movieDetails.spoken_languages.map((l) => l.name).join(", ")}
          </div>
          <div className="col-span-2">
            <span className="font-semibold">Genres:</span>{" "}
            {movieDetails.genres.map((g) => (
              <Badge key={g.id} className="mr-2">
                {g.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>
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
    </>
  );
}
