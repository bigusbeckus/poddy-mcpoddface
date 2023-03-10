import { AnimatedLayout } from "layouts/animated";
import { NextPage } from "next/types";
import Head from "next/head";
import { DefaultFooter } from "components/footer";
import { useSystemThemeChangeListener } from "hooks/theme";

type CustomErrorPageProps = {
  statusCode: number;
};

type CustomErrorMessage = {
  title: string;
  description: string;
};

function getErrorMessages(statusCode: number): CustomErrorMessage {
  let title = "Application error.",
    description = "Oh sorry, bud. Looks like I managed to break her, eh?";

  if (statusCode >= 400 && statusCode <= 499) {
    description =
      "Looks like you lost your way there, bud. How's about you mosey on over to the home page and get yourself reacquainted with that there search bar, eh?";

    if (statusCode === 404) {
      title = "Page not found.";
    } else if (statusCode === 403) {
      title = "Unauthorized access.";
    }
  } else if (statusCode >= 500 && statusCode <= 599) {
    title = "Server-side error occured.";
  }

  return {
    title,
    description,
  };
}

const CustomErrorPage: NextPage<CustomErrorPageProps> = ({ statusCode }) => {
  useSystemThemeChangeListener();

  const errorMessage = getErrorMessages(statusCode);

  return (
    <>
      <Head>
        <title>
          {statusCode}: {errorMessage.title} - Poddy McPodface
        </title>
      </Head>
      <AnimatedLayout>
        <div className="flex h-full w-full flex-col">
          <div className="flex flex-1 flex-col items-center justify-center p-8">
            <h3 className="text-6xl text-gray-400 dark:text-gray-500">¯\_(ツ)_/¯</h3>
            <div className="py-8"></div>
            <div className="flex items-center justify-center">
              <h1 className="text-3xl font-medium">{statusCode}</h1>
              <div className="px-6">
                <hr className="h-16 border border-r-0 border-solid border-black/30 dark:border-white/30" />
              </div>
              <h2 className="text-3xl font-extralight">{errorMessage.title}</h2>
            </div>
            <div className="py-8"></div>
            <div className="w-96">
              <h3 className="text-center text-lg text-gray-500 dark:text-gray-600">
                {errorMessage.description.split(". ").map((sentence, index, full) => (
                  <div key={sentence} className={index > 0 ? "pt-2" : ""}>
                    {sentence}
                    {index !== full.length - 1 ? "." : ""}
                  </div>
                ))}
              </h3>
              {/*   {errorMessage.description} */}
            </div>
          </div>
          <DefaultFooter />
        </div>
      </AnimatedLayout>
    </>
  );
};

CustomErrorPage.getInitialProps = ({ res, err }) => {
  const statusCode = res?.statusCode ?? err?.statusCode ?? 404;
  return { statusCode };
};

export default CustomErrorPage;
