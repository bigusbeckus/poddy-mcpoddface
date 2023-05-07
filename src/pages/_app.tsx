import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { RootLayout } from "@/layouts/root";
import { type ReactElement, type ReactNode, useState } from "react";
import {
  type DehydratedState,
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useSystemThemeChangeListener } from "@/hooks/theme";
import { AnimatePresence, LazyMotion, domAnimation } from "framer-motion";
import { Player } from "@/components/player";
import { type NextPage } from "next";

export type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithRootLayout = AppProps<{
  dehydratedState?: DehydratedState;
}> & {
  Component: NextPageWithLayout;
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
          <div className="flex h-full flex-col">
            <div className="h-full flex-1 overflow-y-hidden">
              <LazyMotion features={domAnimation}>
                <AnimatePresence mode="wait" initial={false}>
                  {getLayout(<Component {...pageProps} key={router.asPath} />)}
                </AnimatePresence>
              </LazyMotion>
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
