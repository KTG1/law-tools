import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://settlementcalculator.guide"),
  title: "Personal Injury Settlement Calculator | Estimate Claim Value",
  description: "Build a transparent personal injury settlement planning range from documented losses, injury impact, and possible fault—without a lead form.",
  applicationName: "Settlement Calculator Guide",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Personal Injury Settlement Calculator",
    description: "A transparent settlement planning tool that shows its formula and assumptions.",
    url: "/",
    siteName: "Settlement Calculator Guide",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Settlement Calculator Guide — estimate the range and inspect the assumptions" }],
  },
  twitter: { card: "summary_large_image", title: "Settlement Calculator Guide", description: "Estimate a claim range. Inspect every assumption.", images: ["/og.png"] },
  icons: { icon: "/favicon.png", shortcut: "/favicon.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
