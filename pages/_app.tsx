import "@/styles/globals.css";
import Header from "./Header";
import Footer from "./Footer";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { Router } from "next/router";

type CustomAppProps = AppProps & {
  Component: AppProps["Component"] & { noLayout?: boolean };
};

export default function App({ Component, pageProps }: CustomAppProps) {
  const useLayout = !Component.noLayout;

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
      const saveScrollPosition = () => {
        sessionStorage.setItem("scrollPosition", JSON.stringify({ x: window.scrollX, y: window.scrollY }));
      };
      const restoreScrollPosition = () => {
        const scrollPosition = JSON.parse(sessionStorage.getItem("scrollPosition") || "null");
        if (scrollPosition) {
          window.scrollTo(scrollPosition.x, scrollPosition.y);
        }
      };

      Router.events.on("routeChangeStart", saveScrollPosition);
      Router.events.on("routeChangeComplete", restoreScrollPosition);
      Router.events.on("beforeHistoryChange", saveScrollPosition);

      return () => {
        Router.events.off("routeChangeStart", saveScrollPosition);
        Router.events.off("routeChangeComplete", restoreScrollPosition);
        Router.events.off("beforeHistoryChange", saveScrollPosition);
      };
    }
  }, []);

  if (!useLayout) {
    return <Component {...pageProps} />;
  }

  return (
    <>
      <Header />
      <Component {...pageProps} />
      <Footer />
    </>
  );
}
