import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import { tmdb } from "@/services/tmdb";
import { Language } from "@/types/languages";
import { MovieDetailsTabs } from "./movie-details-tabs";
import { Container } from "@/components/ui/container";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { MoviePlayer } from "./movie-watch";

type MovieDetailsProps = {
  id: number;
  language: Language;
};

export async function MovieWatchDetails({ id, language }: MovieDetailsProps) {
  const movieDetails = await tmdb.movies.details(id, language);
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
      <div className="flex justify-center items-center pt-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link href={`/${language}/movies/${movieDetails.id}`}>
                {movieDetails.title}
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>Watch</BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="max-w-5xl mx-auto space-y-6 pt-4 px-4 pb-6 lg:px-0 lg:pt-4">
        <MoviePlayer id={movieDetails.id} /> 
      </div>

      <Container>
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
      </Container>

      <MovieDetailsTabs lang={language} id={movieDetails.id} />
    </>
  );
}
