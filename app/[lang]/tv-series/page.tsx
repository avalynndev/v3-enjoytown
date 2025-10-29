import { TvSeriesList } from "@/components/tv-series-list";
import { TvSeriesListFilters } from "@/components/tv-series-list-filters";
import type { PageProps } from "@/types/languages";
import { getDictionary } from "@/utils/dictionaries";
import type { Metadata } from "next";
import TvLayout from "./_components/layout";

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const {
    tv_serie_pages: {
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

const DiscoverTvPage = async (props: PageProps) => {
  const params = await props.params;
  const { lang } = params;
  const dictionary = await getDictionary(lang);

  return (
    <TvLayout title="Discover" language={lang}>
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold">
            {dictionary.tv_serie_pages.discover.title}
          </h1>
          <p className="text-muted-foreground">
            {dictionary.tv_serie_pages.discover.description}
          </p>
        </div>
        <TvSeriesListFilters />
      </div>
      <TvSeriesList variant="discover" />
    </TvLayout>
  );
};

export default DiscoverTvPage;
