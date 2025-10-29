import { MovieList } from "@/components/movie-list";
import type { PageProps } from "@/types/languages";
import { getDictionary } from "@/utils/dictionaries";
import type { Metadata } from "next";
import MovieLayout from "../_components/layout";

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const {
    movie_pages: {
      top_rated: { title, description },
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

const TopRatedMoviesPage = async (props: PageProps) => {
  const params = await props.params;
  const { lang } = params;
  const dictionary = await getDictionary(lang);

  return (
    <MovieLayout title="Top Rated" language={lang}>
      <div>
        <h1 className="text-2xl font-bold">
          {dictionary.movie_pages.top_rated.title}
        </h1>
        <p className="text-muted-foreground">
          {dictionary.movie_pages.top_rated.description}
        </p>
      </div>
      <MovieList variant="top_rated" />
    </MovieLayout>
  );
};

export default TopRatedMoviesPage;
