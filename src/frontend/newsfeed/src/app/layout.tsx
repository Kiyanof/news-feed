import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Body from "./Body";
import StoreProvider from "./StoreProvider";

export const metadata: Metadata = {
  title: "News Feed",
  description: "News Feed is a social media platform for sharing news articles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <StoreProvider>
          <link rel="icon" href="/favicon.ico" sizes="any" />
          <Body>
            {children}
          </Body>
      </StoreProvider>
    </html>
  );
}
