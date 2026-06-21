"use client";

import nextDynamic from "next/dynamic";


const ExecucaoAuditoriaPage = nextDynamic(() => import("@/views/ExecucaoAuditoria"), {
  ssr: false,
});

export default function ClientPage() {
  return <ExecucaoAuditoriaPage />;
}
