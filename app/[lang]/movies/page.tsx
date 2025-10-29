import { MovieList } from "@/components/movie-list";
import { MoviesListFilters } from "@/components/movies-list-filters";
import type { PageProps } from "@/types/languages";
import { getDictionary } from "@/utils/dictionaries";
import type { Metadata } from "next";
import MovieLayout from "./_components/layout";

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const {
    movie_pages: {
      discover: { title, description },
    },
  } = await getDictionary(params.lang);

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

const DiscoverMoviesPage = async (props: PageProps) => {
  const params = await props.params;
  const { lang } = params;
  const dictionary = await getDictionary(lang);

  return (
    <MovieLayout title="Discover" language={lang}>
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold">
            {dictionary.movie_pages.discover.title}
          </h1>
          <p className="text-muted-foreground">
            {dictionary.movie_pages.discover.description}
          </p>
        </div>
        <MoviesListFilters />
      </div>
      <MovieList variant="discover" />
    </MovieLayout>
  );
};

export default DiscoverMoviesPage;
