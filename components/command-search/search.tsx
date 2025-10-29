"use client";

import {
  type MovieWithMediaType,
  type PersonWithMediaType,
  type TvSerieWithMediaType,
  tmdb,
} from "@/services/tmdb";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";

import { useLanguage } from "@/context/language";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
} from "@/components/ui/command";

import { Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { v4 } from "uuid";
import {
  CommandSearchMovie,
  CommandSearchPerson,
  CommandSearchSkeleton,
  CommandSearchTvSerie,
} from "./command-search-items";
import { CommandSearchGroup } from "./command-search-group";
import { CommandSearchIcon } from "./command-search-icon";
import { getDictionary } from "@/utils/dictionaries";

export const CommandSearch = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [dictionary, setDictionary] =
    useState<Awaited<ReturnType<typeof getDictionary>>>();

  const debouncedSearch = useDebounce(search, 500);
  const { language } = useLanguage();
  const pathname = usePathname();

  useEffect(() => {
    const loadDict = async () => {
      const dict = await getDictionary(language);
      setDictionary(dict);
    };
    loadDict();
  }, [language]);

  const { data, isLoading } = useQuery({
    queryKey: ["search", debouncedSearch, language],
    queryFn: async () => await tmdb.search.multi(debouncedSearch, language),
    enabled: !!debouncedSearch,
    staleTime: 1000,
  });

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    if (open) setOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const [movies, tvSeries, people] = [
    data?.results.filter(
      (result) => result.media_type === "movie"
    ) as MovieWithMediaType[],
    data?.results.filter(
      (result) => result.media_type === "tv"
    ) as TvSerieWithMediaType[],
    data?.results.filter(
      (result) => result.media_type === "person"
    ) as PersonWithMediaType[],
  ];

  const hasMovies = Boolean(movies?.length);
  const hasTvSeries = Boolean(tvSeries?.length);
  const hasPeople = Boolean(people?.length);
  const hasResults = hasMovies || hasTvSeries || hasPeople;

  if (!dictionary) {
    return (
      <Button
        variant="outline"
        className="flex lg:flex-1 justify-between gap-2 px-3 text-sm text-muted-foreground max-w-[350px]"
        disabled
      >
        <Search size={16} />
        Loading…
        <CommandSearchIcon />
      </Button>
    );
  }

  return (
    <>
      <Button
        variant="outline"
        className="flex lg:flex-1 justify-between gap-2 px-3 text-sm text-muted-foreground max-w-[350px]"
        onClick={() => setOpen(true)}
      >
        <Search size={16} />
        {dictionary.sidebar_search.search_everything}
        <CommandSearchIcon />
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput
            placeholder={dictionary.sidebar_search.placeholder}
            value={search}
            onValueChange={setSearch}
          />

          <CommandList>
            {isLoading && (
              <div className="space-y-8">
                <CommandSearchGroup heading={dictionary.movies}>
                  {Array.from({ length: 5 }).map(() => (
                    <CommandSearchSkeleton key={v4()} />
                  ))}
                </CommandSearchGroup>

                <CommandSearchGroup
                  heading={dictionary.sidebar_search.tv_series}
                >
                  {Array.from({ length: 5 }).map(() => (
                    <CommandSearchSkeleton key={v4()} />
                  ))}
                </CommandSearchGroup>
              </div>
            )}

            {!isLoading && hasResults ? (
              <div>
                {hasMovies && (
                  <CommandSearchGroup heading={dictionary.movies}>
                    {movies?.map((movie) => (
                      <CommandSearchMovie
                        item={movie}
                        language={language}
                        key={movie.id}
                      />
                    ))}
                  </CommandSearchGroup>
                )}

                {hasTvSeries && (
                  <CommandSearchGroup
                    heading={dictionary.sidebar_search.tv_series}
                  >
                    {tvSeries?.map((tvSerie) => (
                      <CommandSearchTvSerie
                        item={tvSerie}
                        language={language}
                        key={tvSerie.id}
                      />
                    ))}
                  </CommandSearchGroup>
                )}

                {hasPeople && (
                  <CommandSearchGroup heading={dictionary.people}>
                    {people?.map((person) => (
                      <CommandSearchPerson
                        item={person}
                        language={language}
                        key={person.id}
                      />
                    ))}
                  </CommandSearchGroup>
                )}
              </div>
            ) : (
              !isLoading && (
                <p className="p-8 text-center">
                  {dictionary.list_command.no_results}
                </p>
              )
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
};
