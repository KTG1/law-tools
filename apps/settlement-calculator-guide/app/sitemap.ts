import type { MetadataRoute } from "next";
import { states } from "@/lib/states";

const siteUrl = "https://settlementcalculator.guide";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    ...states.map((state) => ({
      url: `${siteUrl}/states/${state.slug}/`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
