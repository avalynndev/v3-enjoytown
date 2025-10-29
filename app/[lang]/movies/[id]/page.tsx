import type { Metadata } from "next";
import { Suspense } from "react";

import { MovieDetails } from "../_components/movie-details";
import { getMovieMetadata } from "@/utils/seo/get-movie-metadata";
import { getMoviesIds } from "@/utils/seo/get-movies-ids";
import type { PageProps } from "@/types/languages";
import { Spinner } from "@/components/ui/spinner";

type MoviePageProps = PageProps<{ id: string }>;

export async function generateStaticParams() {
  const moviesIds = await getMoviesIds();
  return moviesIds.map((id) => ({ id: String(id) }));
}

export async function generateMetadata(
  props: MoviePageProps,
): Promise<Metadata> {
  const { lang, id } = await props.params;
  const metadata = await getMovieMetadata(Number(id), lang);

  return metadata;
}

export default async function MoviePage(props: MoviePageProps) {
  const { id, lang } = await props.params;

  return (
    <Suspense
      fallback={
        <div className="flex h-[80vh] items-center justify-center">
          <Spinner size="large" className="text-muted-foreground" />
        </div>
      }
    >
      <MovieDetails id={Number(id)} language={lang} />
    </Suspense>
  );
}
