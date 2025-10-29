"use client";
import { Clapperboard, User } from "lucide-react";
import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { usePathname, useRouter } from "next/navigation";
import {
  SUPPORTED_LANGUAGES,
  languages as supportedLanguageValues,
} from "@/languages";
import type { Language } from "@/types/languages";
import ReactCountryFlag from "react-country-flag";
import { useSession } from "@/lib/auth-client";
import { UserButton } from "@daveyplate/better-auth-ui";
import { CommandSearch } from "./command-search/search";
import { useEffect } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const additionalLinks = session?.user
    ? [
        {
          href: `/user/profile`,
          label: "My Profile",
          icon: <User className="w-4 h-4" />,
        },
        ...(session.user.username
          ? [
              {
                href: `/user/${session.user.username}`,
                label: "Public Profile",
                icon: <User className="w-4 h-4" />,
              },
            ]
          : []),
      ]
    : [];

  const currentLangFromPath = (() => {
    const parts = (pathname || "/").split("/");
    const candidate = parts[1] as Language | undefined;
    return supportedLanguageValues.includes(candidate as Language)
      ? (candidate as Language)
      : undefined;
  })();

  const currentLang = currentLangFromPath ?? ("en-US" as Language);
  const currentLangOption = SUPPORTED_LANGUAGES.find(
    (l) => l.value === currentLang,
  );

  const replaceLanguageInPath = (nextLang: Language) => {
    localStorage.setItem("language", nextLang);
    const parts = (pathname || "/").split("/");
    if (supportedLanguageValues.includes(parts[1] as Language)) {
      parts[1] = nextLang;
      router.replace(parts.join("/"));
    } else {
      const nextPath = `/${nextLang}${pathname === "/" ? "" : pathname}`;
      router.replace(nextPath);
    }
  };

  useEffect(() => {
    const savedLang = localStorage.getItem("language") as Language | null;
    if (savedLang && savedLang !== currentLang) {
      replaceLanguageInPath(savedLang);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <header className="flex h-11 shrink-0 items-center justify-between gap-3 px-3 py-2 sm:px-2 pt-4">
      <div className="flex min-w-0 flex-1 items-center">
        <div className="mr-1 flex">
          <Link
            className="flex items-center gap-1.5 px-1 text-sm size-8 w-auto rounded-md py-1.5 border-0"
            href="/"
          >
            <Clapperboard />
            <span className="sr-only">Enjoytown</span>
          </Link>
        </div>

        <span className="text-alpha-400 w-4 min-w-4 select-none text-center text-lg block">
          /
        </span>

        <div className="flex min-w-0 flex-1 items-center truncate text-start text-sm font-medium leading-[20px] pl-4">
          <div className="max-w-64 truncate pr-2">Enjoytown</div>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-end gap-2">
        <CommandSearch />
        <div className="flex items-center gap-2">
          <div className="hidden [@media(min-width:512px)]:flex items-center gap-2">
            <Select
              value={currentLang}
              onValueChange={(value) =>
                replaceLanguageInPath(value as Language)
              }
            >
              <SelectTrigger>
                <div className="flex items-center">
                  {currentLangOption && (
                    <ReactCountryFlag
                      countryCode={currentLangOption.country}
                      svg
                      className="mr-2"
                    />
                  )}
                  {currentLangOption?.label ?? currentLang}
                </div>
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_LANGUAGES.filter((l) => l.enabled).map(
                  ({ value, label, country }) => (
                    <SelectItem
                      key={value}
                      value={value}
                      className={
                        value === currentLang
                          ? "space-x-2 bg-muted"
                          : "space-x-2"
                      }
                    >
                      <ReactCountryFlag
                        countryCode={country}
                        svg
                        className="mr-2"
                      />
                      {label}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        <ModeToggle />
        <UserButton
          className="rounded-sm"
          size="icon"
          additionalLinks={additionalLinks}
          classNames={{
            content: {
              base: "min-w-[200px] text-base",
            },
          }}
        />
      </div>
    </header>
  );
}
