import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import CarouselCard from "@/components/card";
import { tmdb } from "@/services/tmdb";
import { Language } from "@/types/languages";

export default async function CarouselComponent({
  language,
  type,
}: {
  language: Language;
  type: "tv-series" | "movies" | "anime";
}) {
  const trending =
    type === "movies"
      ? await tmdb.movies.trending("day", language)
      : await tmdb.tv.trending("day", language);

  if (!trending) return <div>None Found</div>;

  return (
    <div className="flex items-center w-full mb-10">
      <Carousel className="w-full max-w-7xl">
        <CarouselContent>
          {trending.results?.map((movie) => (
            <CarouselItem key={movie.id}>
              <CarouselCard show={movie} type={type} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
