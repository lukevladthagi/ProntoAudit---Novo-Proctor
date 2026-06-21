"use client";

import nextDynamic from "next/dynamic";


const ExecucaoPage = nextDynamic(() => import("@/views/Execucao"), {
  ssr: false,
});

export default function ClientPage() {
  return <ExecucaoPage />;
}
