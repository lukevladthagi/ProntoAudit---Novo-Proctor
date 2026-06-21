"use client";

import nextDynamic from "next/dynamic";


const DashboardPage = nextDynamic(() => import("@/views/Dashboard"), {
  ssr: false,
});

export default function ClientPage() {
  return <DashboardPage />;
}
