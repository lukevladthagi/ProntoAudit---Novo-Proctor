"use client";

import nextDynamic from "next/dynamic";


const AchadosPage = nextDynamic(() => import("@/views/Achados"), {
  ssr: false,
});

export default function ClientPage() {
  return <AchadosPage />;
}
