"use client";

import nextDynamic from "next/dynamic";


const VerificacaoPage = nextDynamic(() => import("@/views/Verificacao"), {
  ssr: false,
});

export default function ClientPage() {
  return <VerificacaoPage />;
}
