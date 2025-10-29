import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import CarouselCard from "@/components/card";
import { tmdb } from "@/services/tmdb";

export default async function CarouselComponent() {
  const trending = await tmdb.movies.trending("day", "en-US");

  if (!trending) return <div>None Found</div>;

  return (
    <div className="flex items-center w-full mb-10">
      <Carousel className="w-full max-w-7xl">
        <CarouselContent>
          {trending.results?.map((movie) => (
            <CarouselItem key={movie.id}>
              <CarouselCard show={movie} type="movie" />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
