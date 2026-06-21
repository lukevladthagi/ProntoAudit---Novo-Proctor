"use client";

import nextDynamic from "next/dynamic";


const UsuariosPage = nextDynamic(() => import("@/views/Usuarios"), {
  ssr: false,
});

export default function ClientPage() {
  return <UsuariosPage />;
}
