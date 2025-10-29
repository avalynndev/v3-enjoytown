"use client";

import { useLanguage } from "@/context/language";
import {
  Keerthi,
  KeerthiBody,
  KeerthiContent,
  KeerthiHeader,
  KeerthiTitle,
} from "@/components/ui/keerthi";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

type BiographyProps = {
  content: string;
  title: string;
};

export function Biography({ content, title }: BiographyProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { dictionary } = useLanguage();

  if (!content.length) return <></>;

  return (
    <>
      <div>
        <p className="text-muted-foreground leading-6 text-sm line-clamp-3">
          {content}
        </p>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="mt-2  hover:underline text-xs"
          type="button"
        >
          {dictionary.text_actions.expand}
        </button>
      </div>

      <Keerthi open={isOpen} onOpenChange={setIsOpen}>
        <KeerthiContent>
          <KeerthiHeader>
            <KeerthiTitle>{title}</KeerthiTitle>
          </KeerthiHeader>
          <KeerthiBody>
            <ScrollArea className="h-[500px]">
              <p className="text-muted-foreground leading-6 text-sm">
                {content}
              </p>
            </ScrollArea>
          </KeerthiBody>
        </KeerthiContent>
      </Keerthi>
    </>
  );
}
