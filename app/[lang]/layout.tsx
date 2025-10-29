import { LanguageContextProvider } from "@/context/language";
import type { Language } from "@/types/languages";
import { getDictionary } from "@/utils/dictionaries";

import { SUPPORTED_LANGUAGES } from "@/languages";

export async function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((lang) => ({ lang: lang.value }));
}

export const dynamic = "force-dynamic";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: Language | string }>;
}) {
  const { lang } = await params;
  const Lang = lang as Language;
  const dictionary = await getDictionary(Lang);

  return (
    <LanguageContextProvider language={Lang} dictionary={dictionary}>
      {children}
    </LanguageContextProvider>
  );
}
