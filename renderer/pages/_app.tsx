import React from "react";
import Head from "next/head";
import PageWrapper from "@/src/components/global/PageWrapper";
import type { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/react";
import "./index.css";
import PlatformLayout from "@/layout/platform";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <PageWrapper>
      <Head>
        <title>DevGPT</title>
      </Head>
          <PlatformLayout>
            <Component {...pageProps} />
          </PlatformLayout>
      <Analytics />
    </PageWrapper>
  );
}