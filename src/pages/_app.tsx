import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { type NextPageWithRootLayout, RootLayout } from "@/layouts/root";
import { useState } from "react";
import {
  type DehydratedState,
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useSystemThemeChangeListener } from "@/hooks/theme";
import { AnimatePresence, LazyMotion, domAnimation } from "framer-motion";
import { Player } from "@/components/player";

type AppPropsWithRootLayout = AppProps<{
  dehydratedState?: DehydratedState;
}> & {
  Component: NextPageWithRootLayout;
};

function MyApp({ Component, pageProps, router }: AppPropsWithRootLayout) {
  useSystemThemeChangeListener();

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 300000,
          },
        },
      })
  );
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <RootLayout>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <div className="flex h-full flex-col pb-1">
            <div className="h-full flex-1 overflow-y-hidden">
              {getLayout(
                <LazyMotion features={domAnimation}>
                  <AnimatePresence mode="wait" initial={false}>
                    <Component {...pageProps} key={router.asPath} />
                  </AnimatePresence>
                </LazyMotion>
              )}
            </div>
            <Player />
          </div>
        </Hydrate>
      </QueryClientProvider>
    </RootLayout>
  );
}

// MyApp.getLayout = function getLayout(page: ReactElement) {
//   return <RootLayout>{page}</RootLayout>;
// };

export default MyApp;
