import { TMDB } from "@/tmdb";

export const tmdb = TMDB(process.env.NEXT_PUBLIC_TMDB_API_KEY || "");
export * from "@/tmdb";
