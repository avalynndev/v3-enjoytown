"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PosterCard } from "@/components/ui/poster-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import { Spinner } from "@/components/ui/spinner";
import { tmdbImage } from "@/utils/tmdb/image";
import { tmdb } from "@/services/tmdb";
import type { Language } from "@/types/languages";
import type { MovieDetails, MovieWithMediaType } from "@/tmdb/models";

interface MoviePageProps {
  params: Promise<{
    id: number;
    language: Language;
  }>;
}

export default function MovieDetailPage({ params }: MoviePageProps) {
const [movieData, setMovieData] = useState<
  MovieDetails & {
    similar?: MovieWithMediaType[];
    recommendations?: MovieWithMediaType[];
    videos?: {
      id: string;
      key: string;
      name: string;
      site: string;
      type: string;
    }[];
  }
>();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        setLoading(true);
        const resolvedParams = await params;
        const response = await tmdb.movies.details(
          resolvedParams.id,
          resolvedParams.language
        );
        setMovieData(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch movie");
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [params]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (error || !movieData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p className="text-muted-foreground">{error || "Movie not found"}</p>
        </div>
      </div>
    );
  }

  const progress = {
    current: 20,
    total: movieData.runtime,
    formatted: `20m / ${Math.floor(movieData.runtime / 60)}h ${
      movieData.runtime % 60
    }m`,
  };

  const trailer = movieData.videos?.find(
    (video) => video.type === "Trailer" && video.site === "YouTube"
  );

  return (
    <>
      <header className="sticky top-0 z-50 flex h-14 items-center gap-2 border-b backdrop-blur px-3 sm:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-sm sm:text-base font-medium truncate">
          {movieData.title}
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
              alt={movieData.title}
              src={`https://image.tmdb.org/t/p/original${movieData.backdrop_path}`}
            />
          </div>
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <img
            className="mb-6 w-[250px] sm:w-[350px] lg:w-[450px]"
            alt={movieData.title}
            src={`https://image.tmdb.org/t/p/original${movieData.poster_path}`}
          />

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <Button
              variant="secondary"
              className="bg-white/20 backdrop-blur-sm border border-white/30"
              onClick={() => {
                const params = new URLSearchParams({
                  id: movieData.id.toString(),
                  title: movieData.title,
                });
                window.location.href = `/movie/${movieData.id}/watch?${params.toString()}`;
              }}
            >
              ▶ Play
            </Button>
            <Button variant="outline" className="backdrop-blur-sm border">
              ℹ Info
            </Button>
          </div>

          <div className="w-full max-w-xs sm:max-w-md flex flex-col items-center gap-2">
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
                  {movieData.vote_average.toFixed(1)}
                </Badge>
                <Badge>You liked this!</Badge>
              </div>
            </div>
            {trailer && (
              <Button
                variant="secondary"
                className="items-center gap-2 absolute bottom-24 left-12 md:flex hidden"
                onClick={() =>
                  window.open(
                    `https://www.youtube.com/watch?v=${trailer.key}`,
                    "_blank"
                  )
                }
              >
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
            )}
          </div>
        </div>
      </div>

      {/* ABOUT */}
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">About</h2>
        <p className="text-muted-foreground leading-relaxed mb-6">
          {movieData.overview}
        </p>

        {movieData.tagline && (
          <blockquote className="italic text-lg text-gray-400 border-l-4 border-gray-600 pl-4 mb-6">
            &ldquo;{movieData.tagline}&rdquo;
          </blockquote>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-semibold">Release Date:</span>{" "}
            {new Date(movieData.release_date).toLocaleDateString()}
          </div>
          <div>
            <span className="font-semibold">Runtime:</span>{" "}
            {Math.floor(movieData.runtime / 60)}h {movieData.runtime % 60}m
          </div>
          <div>
            <span className="font-semibold">Status:</span> {movieData.status}
          </div>
          <div>
            <span className="font-semibold">Budget:</span> $
            {movieData.budget.toLocaleString()}
          </div>
          <div>
            <span className="font-semibold">Revenue:</span> $
            {movieData.revenue.toLocaleString()}
          </div>
          <div>
            <span className="font-semibold">Languages:</span>{" "}
            {movieData.spoken_languages.map((l) => l.name).join(", ")}
          </div>
          <div className="col-span-2">
            <span className="font-semibold">Genres:</span>{" "}
            {movieData.genres.map((g) => (
              <Badge key={g.id} className="mr-2">
                {g.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* SIMILAR MOVIES */}
      <div className="mx-auto max-w-6xl px-4 pb-8">
        <h1 className="mt-10 mb-6 text-xl sm:text-2xl font-bold">
          Similar Movies
        </h1>
        <Carousel className="w-full">
          <CarouselContent className="-ml-1">
            {movieData.similar?.map((movie) => (
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

      {/* RECOMMENDED MOVIES */}
      <div className="mx-auto max-w-6xl px-4 pb-8">
        <h1 className="mt-10 mb-6 text-xl sm:text-2xl font-bold">
          Recommended Movies
        </h1>
        <Carousel className="w-full">
          <CarouselContent className="-ml-1">
            {movieData.recommendations?.map((movie) => (
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
