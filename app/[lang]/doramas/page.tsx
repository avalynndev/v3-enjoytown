import { DoramaListContent } from "@/components/dorama-list";
import type { PageProps } from "@/types/languages";
import { getDictionary } from "@/utils/dictionaries";
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

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
    <>
      <header className="sticky top-0 z-50 flex h-14 items-center gap-2 border-b backdrop-blur rounded-t-2xl px-3 sm:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-sm sm:text-base font-medium truncate">Doramas</h1>
      </header>
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
    </>
  );
}
