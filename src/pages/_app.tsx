import "../styles/globals.css";
import type { AppProps } from "next/app";
import { RootLayout } from "../layouts/root";
import { NextPage } from "next";
import { ReactElement, ReactNode, useState } from "react";
import {
  DehydratedState,
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

export type NextPageWithRootLayout<
  P = Record<string, unknown>,
  IP = P
> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithRootLayout = AppProps<{
  dehydratedState?: DehydratedState;
}> & {
  Component: NextPageWithRootLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithRootLayout) {
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
          {getLayout(<Component {...pageProps} />)}
        </Hydrate>
      </QueryClientProvider>
    </RootLayout>
  );
}

// MyApp.getLayout = function getLayout(page: ReactElement) {
//   return <RootLayout>{page}</RootLayout>;
// };

export default MyApp;
