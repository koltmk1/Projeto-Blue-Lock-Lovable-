import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Projeto Blue Lock — Monte seu time" },
      { name: "description", content: "Colecione jogadores, monte sua escalação Blue Lock e dispute partidas." },
      { property: "og:title", content: "Projeto Blue Lock — Monte seu time" },
      { property: "og:description", content: "Colecione jogadores, monte sua escalação Blue Lock e dispute partidas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  useEffect(() => {
    window.location.replace("/Inicial.html");
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
      Carregando Blue Lock…
    </div>
  );
}
