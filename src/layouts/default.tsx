import React from "react";
import { NavBar } from "@/components/nav";
import { AnimatedLayout } from "./animated";
import { AnimatePresence } from "framer-motion";

type DefaultLayoutProps = {
  children?: React.ReactNode;
};

export const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
  return (
    <AnimatedLayout containerType="div" className="flex h-full flex-col overflow-hidden">
      <NavBar />
      <AnimatePresence mode="wait" initial={false}>
        {children}
      </AnimatePresence>
    </AnimatedLayout>
  );
};
