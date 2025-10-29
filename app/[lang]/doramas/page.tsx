import { DoramaListContent } from "@/components/dorama-list";
import type { PageProps } from "@/types/languages";
import { getDictionary } from "@/utils/dictionaries";
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { lang } = await props.params;
  const { doramas, doramas_description } = await getDictionary(lang);

  const title = doramas;
  const description = doramas_description;

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

export default async function Doramas(props: PageProps) {
  const { lang } = await props.params;
  const dictionary = await getDictionary(lang);

  return (
    <Container>
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold">{dictionary.doramas}</h1>

          <p className="text-muted-foreground">
            {dictionary.doramas_description}
          </p>
        </div>
      </div>

      <DoramaListContent />
    </Container>
  );
}
