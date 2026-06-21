"use client";

import nextDynamic from "next/dynamic";


const NovaAuditoriaPage = nextDynamic(() => import("@/views/NovaAuditoria"), {
  ssr: false,
});

export default function ClientPage() {
  return <NovaAuditoriaPage />;
}
