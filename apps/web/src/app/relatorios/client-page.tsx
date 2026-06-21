"use client";

import nextDynamic from "next/dynamic";


const RelatoriosPage = nextDynamic(() => import("@/views/Relatorios"), {
  ssr: false,
});

export default function ClientPage() {
  return <RelatoriosPage />;
}
