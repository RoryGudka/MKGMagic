import "../styles/head.css";
import "../styles/image_browser.css";
import "../styles/home.css";

import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
