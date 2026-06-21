'use client';

import nextDynamic from 'next/dynamic';

const ProcessosPage = nextDynamic(() => import('@/views/Processos'), {
  ssr: false,
});

export default function ClientPage() {
  return <ProcessosPage />;
}
