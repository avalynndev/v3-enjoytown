"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import NextTopLoader from "nextjs-toploader";
import nProgress from "nprogress";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { useEffect } from "react";
import { Toaster } from "sonner";
import { AuthUIProvider } from "@daveyplate/better-auth-ui";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";

const queryClient = new QueryClient();
export const APP_QUERY_CLIENT = queryClient;

import type { ReactNode } from "react";

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <AuthUIProvider
      authClient={authClient}
      navigate={router.push}
      replace={router.replace}
      onSessionChange={() => {
        router.refresh();
      }}
      credentials={{
        username: true,
      }}
      avatar
      signUp={{
        fields: [],
      }}
      nameRequired={false}
      Link={Link}
      deleteUser
    >
      {children}
    </AuthUIProvider>
  );
}

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    nProgress.done();
  }, [pathname, router]);

  return (
    <NextThemesProvider {...props}>
      <QueryClientProvider client={queryClient}>
        <NuqsAdapter>
          <NextTopLoader color="#ccc" showSpinner={false} />
          {children}
        </NuqsAdapter>
      </QueryClientProvider>
    </NextThemesProvider>
  );
}

export function SonnerProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  return (
    <>
      <Toaster
        theme={theme as "light" | "dark" | "system"}
        className="toaster group"
        toastOptions={{
          classNames: {
            toast:
              "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
            description: "group-[.toast]:text-muted-foreground",
            actionButton:
              "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
            cancelButton:
              "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          },
        }}
      />
      {children}
    </>
  );
}
