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
  params: Promise<{ lang: Language }>;
};

export default async function RootLayout({
  params,
  children,
}: RootLayoutProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  return (
    <SonnerProvider>
      <LanguageContextProvider language={lang} dictionary={dictionary}>
        {children}
      </LanguageContextProvider>
    </SonnerProvider>
  );
}
