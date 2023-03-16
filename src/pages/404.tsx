import Head from "next/head";
import { AnimatedLayout } from "@/layouts/animated";
import { DefaultFooter } from "@/components/footer";
import { getErrorMessages } from "@/utils/get-app-error-message";
import { useSystemThemeChangeListener } from "@/hooks/theme";

const Custom404Page = () => {
  useSystemThemeChangeListener();

  const errorMessage = getErrorMessages(404);

  return (
    <>
      <Head>
        <title>404: {errorMessage.title} - Poddy McPodface</title>
      </Head>
      <AnimatedLayout>
        <div className="flex h-full w-full flex-col">
          <div className="flex flex-1 flex-col items-center justify-center p-8">
            <h3 className="text-6xl text-gray-400 dark:text-gray-500">¯\_(ツ)_/¯</h3>
            <div className="py-8"></div>
            <div className="flex items-center justify-center">
              <h1 className="text-3xl font-medium">404</h1>
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

export default Custom404Page;
