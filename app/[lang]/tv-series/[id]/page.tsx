import type { Metadata } from "next";
import { Suspense } from "react";

import type { PageProps } from "@/types/languages";
import { getTvMetadata } from "@/utils/seo/get-tv-metadata";
import { getTvSeriesIds } from "@/utils/seo/get-tv-series-ids";
import { TvSerieDetails } from "../_components/tv-serie-details";
import { Spinner } from "@/components/ui/spinner";

export type TvSeriePageProps = PageProps<{ id: string }>;

export async function generateStaticParams() {
  const tvSeriesIds = await getTvSeriesIds();
  return tvSeriesIds.map((id) => ({ id: String(id) }));
}

export async function generateMetadata(
  props: TvSeriePageProps
): Promise<Metadata> {
  const { lang, id } = await props.params;
  const metadata = await getTvMetadata(Number(id), lang);

  return metadata;
}

export default async function TvSeriePage(props: TvSeriePageProps) {
  const { id, lang } = await props.params;

  return (
    <Suspense
      fallback={
        <div className="flex h-[80vh] items-center justify-center">
          <Spinner size="large" className="text-muted-foreground" />
        </div>
      }
    >
      <TvSerieDetails id={Number(id)} language={lang} />
    </Suspense>
  );
}
