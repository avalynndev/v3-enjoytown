import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import { tmdbImage } from "@/utils/tmdb/image";
import { tmdb } from "@/services/tmdb";
import type { TvSerieDetails } from "@/tmdb";
import { Language } from "@/types/languages";
import { Container } from "@/components/ui/container";
import { TvDetailsTabs } from "./tv-serie-details-tab";
import Image from "next/image";

type TvDetailsProps = {
  id: number;
  language: Language;
};

export async function TvSerieDetails({ id, language }: TvDetailsProps) {
  const TvDetails = await tmdb.tv.details(id, language);

  return (
    <>
      <header className="sticky top-0 z-50 flex h-14 items-center gap-2 border-b backdrop-blur px-3 sm:px-6 rounded-t-2xl overflow-hidden">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-sm sm:text-base font-medium truncate">
          {TvDetails.name}
        </h1>
      </header>

      <div className="relative w-full h-[60vh] sm:h-[70vh] lg:h-[774px] rounded-t-2xl overflow-hidden">
        <div
          className="absolute inset-0 blur-xs"
          style={{
            backgroundSize: "cover",
            backgroundPosition: "center top",
            maskImage:
              "linear-gradient(to top, rgba(0, 0, 0, 0), rgb(0, 0, 0) 700px)",
            WebkitMaskImage:
              "linear-gradient(to top, rgba(0, 0, 0, 0), rgb(0, 0, 0) 700px)",
          }}
        >
          <Image
            src={tmdbImage(TvDetails.backdrop_path, "original")}
            alt={TvDetails.name}
            fill
            priority
            className="object-cover"
          />
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          {TvDetails.poster_path && (
            <div className="relative mb-4 w-[140px] sm:w-[180px] lg:w-[220px] aspect-poster rounded-md shadow-lg overflow-hidden">
              <Image
                src={tmdbImage(TvDetails.poster_path, "w500")}
                alt={`${TvDetails.name} poster`}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 mb-6 mx-auto bg-card/50 backdrop-blur-2xl rounded-2xl p-3">
            <Button className="border">▶ Resume</Button>
            <Button variant="outline">ℹ Info</Button>
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
        </div>
      </div>

      <Container>
        <h2 className="text-2xl font-bold mb-4">About</h2>
        <p className="text-muted-foreground leading-relaxed mb-6">
          {TvDetails.overview}
        </p>

        {TvDetails.tagline && (
          <blockquote className="italic text-lg text-gray-400 border-l-4 border-gray-600 pl-4 mb-6">
            “{TvDetails.tagline}”
          </blockquote>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-semibold">First air Date:</span>{" "}
            {TvDetails.first_air_date}
          </div>
          <div>
            <span className="font-semibold">Status:</span> {TvDetails.status}
          </div>
          <div>
            <span className="font-semibold">Languages:</span>{" "}
            {TvDetails.spoken_languages.map((l) => l.name).join(", ")}
          </div>
          <div className="col-span-2">
            <span className="font-semibold">Genres:</span>{" "}
            {TvDetails.genres.map((g) => (
              <Badge key={g.id} className="mr-2">
                {g.name}
              </Badge>
            ))}
          </div>
        </div>
      </Container>

      <TvDetailsTabs
        seasons={TvDetails.seasons}
        lang={language}
        id={TvDetails.id}
      />
    </>
  );
}
