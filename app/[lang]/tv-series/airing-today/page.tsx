import type { PageProps } from "@/types/languages";
import { getDictionary } from "@/utils/dictionaries";
import type { Metadata } from "next";
import TvLayout from "../_components/layout";
import { TvSeriesList } from "@/components/tv-series-list";

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const {
    tv_serie_pages: {
      airing_today: { title, description },
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

const AiringTodayTvSeriesPage = async (props: PageProps) => {
  const params = await props.params;
  const { lang } = params;
  const dictionary = await getDictionary(lang);

  return (
    <TvLayout title="Top Rated" language={lang}>
      <div>
        <h1 className="text-2xl font-bold">
          {dictionary.tv_serie_pages.airing_today.title}
        </h1>
        <p className="text-muted-foreground">
          {dictionary.tv_serie_pages.airing_today.description}
        </p>
      </div>
      <TvSeriesList variant="airing_today" />
    </TvLayout>
  );
};

export default AiringTodayTvSeriesPage;
