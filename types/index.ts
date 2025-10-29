import { Genre } from "@/tmdb/utils/common";

export interface Show {
  id: number;
  poster_path: string;
  overview: string;
  genre_ids: number[];
  original_language: string;
  popularity: number;
  vote_count: number;
  vote_average: number;
  backdrop_path?: string;
  // Movie-specific properties
  adult?: boolean;
  video?: boolean;
  title?: string;
  original_title?: string;
  release_date?: string;
  // TvSerie-specific properties
  name?: string;
  original_name?: string;
  first_air_date?: string;
  origin_country?: string[];
  genres?: Genre[];
}
