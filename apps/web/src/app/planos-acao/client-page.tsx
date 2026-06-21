"use client";

import nextDynamic from "next/dynamic";


const PlanosAcaoPage = nextDynamic(() => import("@/views/PlanosAcao"), {
  ssr: false,
});

export default function ClientPage() {
  return <PlanosAcaoPage />;
}
