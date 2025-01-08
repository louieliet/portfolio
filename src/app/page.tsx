"use client";
import dynamic from "next/dynamic";

// Cargamos el componente Home dinámicamente, deshabilitando SSR
const DynamicHome = dynamic(() => import("@/app/pages/Home"), {
  ssr: false,
});

export default function Page() {
  return <DynamicHome />;
}