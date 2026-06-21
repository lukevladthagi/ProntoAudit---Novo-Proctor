"use client";

import nextDynamic from "next/dynamic";


const AuditoriasPage = nextDynamic(() => import("@/views/Auditorias"), {
  ssr: false,
});

export default function ClientPage() {
  return <AuditoriasPage />;
}
