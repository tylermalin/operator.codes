import type { Metadata } from "next";
import { getAllEssays } from "@/lib/essays";
import EssayCard from "@/components/essay-card";

export const metadata: Metadata = { title: "Essays" };

export default function EssaysPage() {
  const essays = getAllEssays();

  return (
    <div className="max-w-5xl mx-auto px-6 py-24">
      <h1 className="text-4xl font-normal tracking-tight mb-4">Essays</h1>
      <p className="text-muted mb-16 max-w-lg leading-relaxed">
        AI systems, climate infrastructure, legal engineering, protocol
        design.
      </p>
      <div className="flex flex-col gap-16">
        {essays.map((essay) => (
          <EssayCard key={essay.slug} essay={essay} headingLevel="h2" />
        ))}
      </div>
    </div>
  );
}
