export type Language =
  | "en-US"
  | "es-ES"
  | "fr-FR"
  | "de-DE"
  | "te-IN"
  | "it-IT"
  | "pt-BR"
  | "ja-JP";

export type PageProps<T = unknown> = {
  params: Promise<
    {
      lang: Language;
    } & T
  >;
};
