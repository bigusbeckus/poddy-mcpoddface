import { Head, Html, Main, NextScript } from "next/document";

const CustomDocument = () => {
  return (
    <Html style={{ colorScheme: "dark" }}>
      <Head />
      <Main />
      <NextScript />
    </Html>
  );
};

export default CustomDocument;
