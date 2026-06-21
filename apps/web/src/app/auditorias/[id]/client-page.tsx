"use client";

import nextDynamic from "next/dynamic";

const AuditoriaDetalhesPage = nextDynamic(() => import("@/views/AuditoriaDetalhes"), {
  ssr: false,
});

export default function ClientPage() {
  return <AuditoriaDetalhesPage />;
}
