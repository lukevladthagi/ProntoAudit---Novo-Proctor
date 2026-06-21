'use client';

import nextDynamic from 'next/dynamic';

const ChecklistsPage = nextDynamic(() => import('@/views/Checklists'), {
  ssr: false,
});

export default function ClientPage() {
  return <ChecklistsPage />;
}
