"use client";
import dynamic from "next/dynamic";

const DynamicHome = dynamic(() => import("@/app/pages/Home"), {
  ssr: false,
});

export default function Page() {
  return <DynamicHome />;
}