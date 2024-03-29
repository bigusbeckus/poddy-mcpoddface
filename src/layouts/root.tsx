import Head from "next/head";
import type { NextPage } from "next/types";
import type { ReactElement, ReactNode } from "react";
import { RouterProgres } from "@/components/router-progress";

type RootLayoutProps = {
  children?: React.ReactNode;
  title?: string;
  description?: string;
};

const defaultTitle = "Poddy McPodface - Podcasts Everywhere";
const defaultDescription = "Cross-platform podcasts for free";

export const RootLayout: React.FC<RootLayoutProps> = ({ children, title, description }) => {
  return (
    <>
      <Head>
        <title>{title ?? defaultTitle}</title>
        <meta name="description" content={description ?? defaultDescription} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="h-full overflow-hidden bg-white text-black dark:bg-black/40 dark:text-inherit dark:text-white">
        <RouterProgres />
        {children}
      </div>
    </>
  );
};

export type NextPageWithRootLayout<P = Record<string, unknown>, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};
