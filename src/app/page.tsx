"use client";
import dynamic from "next/dynamic";

const DynamicHome = dynamic(() => import("@/Gsap tests/PinnedTest"), {
  ssr: false,
});

export default function Page() {
  return <DynamicHome />;
}