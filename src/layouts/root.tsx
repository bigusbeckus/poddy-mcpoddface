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
        <div className="h-full overflow-y-scroll dark:bg-transparent dark:text-inherit bg-white text-black">
          {children}
          {/* </div> */}
        </div>
      </ThemeContext.Provider>
    </>
  );
};
