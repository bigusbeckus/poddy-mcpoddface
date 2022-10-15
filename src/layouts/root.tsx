import Head from "next/head";
import React from "react";
import { ThemeContext, useThemeContextState } from "../context/theme";

type RootLayoutProps = {
  children?: React.ReactNode;
  title?: string;
  description?: string;
};

const defaultTitle = "Poddy McPodface | Podcasts Everywhere";
const defaultDescription = "Cross-platform podcasts for free";

export const RootLayout: React.FC<RootLayoutProps> = ({
  children,
  title,
  description,
}) => {
  const [darkMode, setDarkMode] = useThemeContextState(true);

  return (
    <>
      <Head>
        <title>{title ?? defaultTitle}</title>
        <meta name="description" content={description ?? defaultDescription} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ThemeContext.Provider value={[darkMode, setDarkMode]}>
        {/* <div className={"h-full" + (darkMode ? " dark" : "")}> */}
        <div className="bg-primary_light-300 dark:bg-primary_dark-900 dark:text-white h-full overflow-y-scroll">
          {children}
          {/* </div> */}
        </div>
      </ThemeContext.Provider>
    </>
  );
};
