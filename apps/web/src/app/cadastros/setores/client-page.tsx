"use client";

import nextDynamic from "next/dynamic";


const SetoresPage = nextDynamic(() => import("@/views/Setores"), {
  ssr: false,
});

export default function ClientPage() {
  return <SetoresPage />;
}
