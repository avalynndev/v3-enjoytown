"use client";

import { AuthUIProvider } from "@daveyplate/better-auth-ui";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";

import type { ReactNode } from "react";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: ReactNode }) {
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
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </AuthUIProvider>
  );
}
