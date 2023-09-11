import React from 'react'
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="description" content="February Labs" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </Head>
      <body>
        <div
          id="titlebar"
          className="titlebar"
          style={{
            zIndex: 1000,
            background: "#2D3748",
            height: "38px",
            width: "100%",
            position: "fixed",
            top: 0,
            // @ts-ignore
            "-webkit-app-region": "drag",
          }}
        />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}