import type { Metadata } from "next";

import type { PageProps } from "@/types/languages";
import { getDictionary } from "@/utils/dictionaries";

import { APP_URL } from "@/constants";

import { SUPPORTED_LANGUAGES } from "@/languages";
import { Hero } from "@/components/hero";
import { SidebarTrigger } from "@/components/ui/sidebar";

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { lang } = await props.params;
  const dictionary = await getDictionary(lang);

  const image = `${APP_URL}/images/landing-page.jpg`;
  const canonicalUrl = `${APP_URL}/${lang}`;

  const languageAlternates = SUPPORTED_LANGUAGES.reduce(
    (acc, lang) => {
      if (lang.enabled) {
        acc[lang.hreflang] = `${APP_URL}/${lang.value}`;
      }
      return acc;
    },
    {} as Record<string, string>
  );

  const title = `${dictionary.perfect_place_for_watching} ${dictionary.everything}`;
  const description = dictionary.manage_rate_discover;

  return {
    title,
    description,
    keywords: dictionary.home.keywords,
    openGraph: {
      title: `Enjoytown • ${title}`,
      description,
      siteName: "Enjoytown",
      url: APP_URL,
      images: [
        {
          url: image,
          width: 1280,
          height: 720,
          alt: title,
        },
      ],
    },
    twitter: {
      title,
      description,
      card: "summary_large_image",
    },
    alternates: {
      canonical: canonicalUrl,
      languages: languageAlternates,
    },
  };
}

export default async function Home(props: PageProps) {
  const { lang } = await props.params;
  const dictionary = await getDictionary(lang);

  return (
    <>
      <header className="sticky top-0 z-50 flex h-14 items-center gap-2 backdrop-blur rounded-t-2xl px-3 sm:px-6">
        <SidebarTrigger className="-ml-1" />
      </header>
      <Hero dictionary={dictionary} />
    </>
  );
}
