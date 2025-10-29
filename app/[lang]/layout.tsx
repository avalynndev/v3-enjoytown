import { LanguageContextProvider } from "@/context/language";
import type { Language } from "@/types/languages";
import { getDictionary } from "@/utils/dictionaries";

import { SonnerProvider } from "@/components/providers";
import { SUPPORTED_LANGUAGES } from "@/languages";

export async function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((lang) => ({ lang: lang.value }));
}

export const dynamic = "force-dynamic";

type RootLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
};

export default async function RootLayout(props: RootLayoutProps) {
  const { params, children } = props;
  const { lang: langValue } = await params;
  const lang = langValue as Language;
  const dictionary = await getDictionary(lang);

  return (
    <SonnerProvider>
      <LanguageContextProvider language={lang} dictionary={dictionary}>
        {children}
      </LanguageContextProvider>
    </SonnerProvider>
  );
}
