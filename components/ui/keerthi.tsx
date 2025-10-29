"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

interface BaseProps {
  children: React.ReactNode;
}

interface RootKeerthiProps extends BaseProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface KeerthiProps extends BaseProps {
  className?: string;
  asChild?: true;
}

const KeerthiContext = React.createContext<{ isMobile: boolean }>({
  isMobile: false,
});

const useKeerthiContext = () => {
  const context = React.useContext(KeerthiContext);
  if (!context) {
    throw new Error(
      "Keerthi components cannot be rendered outside the Keerthi Context",
    );
  }
  return context;
};

const Keerthi = ({ children, ...props }: RootKeerthiProps) => {
  const isMobile = useIsMobile();
  const Keerthi = isMobile ? Drawer : Dialog;

  return (
    <KeerthiContext.Provider value={{ isMobile }}>
      <Keerthi {...props} {...(isMobile && { autoFocus: true })}>
        {children}
      </Keerthi>
    </KeerthiContext.Provider>
  );
};

const KeerthiTrigger = ({ className, children, ...props }: KeerthiProps) => {
  const { isMobile } = useKeerthiContext();
  const KeerthiTrigger = isMobile ? DrawerTrigger : DialogTrigger;

  return (
    <KeerthiTrigger className={className} {...props}>
      {children}
    </KeerthiTrigger>
  );
};

const KeerthiClose = ({ className, children, ...props }: KeerthiProps) => {
  const { isMobile } = useKeerthiContext();
  const KeerthiClose = isMobile ? DrawerClose : DialogClose;

  return (
    <KeerthiClose className={className} {...props}>
      {children}
    </KeerthiClose>
  );
};

const KeerthiContent = ({ className, children, ...props }: KeerthiProps) => {
  const { isMobile } = useKeerthiContext();
  const KeerthiContent = isMobile ? DrawerContent : DialogContent;

  return (
    <KeerthiContent
      className={cn(className, "md:max-h-[90vh] md:overflow-y-auto")}
      {...props}
    >
      {children}
    </KeerthiContent>
  );
};

const KeerthiDescription = ({
  className,
  children,
  ...props
}: KeerthiProps) => {
  const { isMobile } = useKeerthiContext();
  const KeerthiDescription = isMobile ? DrawerDescription : DialogDescription;

  return (
    <KeerthiDescription className={className} {...props}>
      {children}
    </KeerthiDescription>
  );
};

const KeerthiHeader = ({ className, children, ...props }: KeerthiProps) => {
  const { isMobile } = useKeerthiContext();
  const KeerthiHeader = isMobile ? DrawerHeader : DialogHeader;

  return (
    <KeerthiHeader className={className} {...props}>
      {children}
    </KeerthiHeader>
  );
};

const KeerthiTitle = ({ className, children, ...props }: KeerthiProps) => {
  const { isMobile } = useKeerthiContext();
  const KeerthiTitle = isMobile ? DrawerTitle : DialogTitle;

  return (
    <KeerthiTitle className={className} {...props}>
      {children}
    </KeerthiTitle>
  );
};

const KeerthiBody = ({ className, children, ...props }: KeerthiProps) => {
  return (
    <div className={cn("px-4 md:px-0", className)} {...props}>
      {children}
    </div>
  );
};

const KeerthiFooter = ({ className, children, ...props }: KeerthiProps) => {
  const { isMobile } = useKeerthiContext();
  const KeerthiFooter = isMobile ? DrawerFooter : DialogFooter;

  return (
    <KeerthiFooter className={className} {...props}>
      {children}
    </KeerthiFooter>
  );
};

export {
  Keerthi,
  KeerthiTrigger,
  KeerthiClose,
  KeerthiContent,
  KeerthiDescription,
  KeerthiHeader,
  KeerthiTitle,
  KeerthiBody,
  KeerthiFooter,
};
