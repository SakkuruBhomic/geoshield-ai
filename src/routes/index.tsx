import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "GeoShield AI | Disaster Management & Hazard Intelligence Platform",
      },
      {
        name: "description",
        content:
          "AI-powered multi-hazard early warning, GIS risk mapping and evacuation intelligence for citizens and disaster authorities.",
      },
      {
        property: "og:title",
        content: "GeoShield AI | Disaster Management & Hazard Intelligence",
      },
      {
        property: "og:description",
        content:
          "Real-time multi-hazard monitoring, predictive risk mapping and evacuation intelligence for communities and authorities.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  useEffect(() => {
    window.location.replace("/app/index.html");
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <p className="text-sm text-muted-foreground">Loading GeoShield AI…</p>
    </div>
  );
}
