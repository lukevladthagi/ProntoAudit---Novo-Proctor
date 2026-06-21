"use client";

import nextDynamic from "next/dynamic";


const UnidadesPage = nextDynamic(() => import("@/views/Unidades"), {
  ssr: false,
});

export default function ClientPage() {
  return <UnidadesPage />;
}
