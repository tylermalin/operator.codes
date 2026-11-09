import Image from "next/image";
import {
  SeriesContainmentMesh,
  AgentCorpPipeline,
} from "@/components/figures/agent-can-sign";
import { ControlBoundary } from "@/components/figures/own-what-you-host";
import { GuideCallout } from "@/components/guide-callout";
import { WhoIsBound, AuthorityCheck, SeriesCost } from "@/components/figures/agent-interactives";
import { SeedPosition, TermSheetCheck, RunwayToA, SeedChecklist } from "@/components/figures/seed-interactives";
import { HopCounter, WallFilter, PilotPlan } from "@/components/figures/lkg-interactives";

// The registration point for anything an essay embeds beyond prose:
// illustrations, figures, charts, interactives. Add a component here,
// then use it directly inside any .mdx file. Server components work
// as-is; interactive pieces need "use client" in their own file and
// get registered here the same way.

export function Figure({
  src,
  alt,
  caption,
  width = 1024,
  height = 559,
}: {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}) {
  return (
    <figure className="my-10">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="rounded-2xl w-full h-auto"
      />
      {caption && (
        <figcaption className="font-mono text-xs text-muted mt-3">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export const mdxComponents = {
  Figure,
  SeriesContainmentMesh,
  AgentCorpPipeline,
  ControlBoundary,
  GuideCallout,
  WhoIsBound,
  AuthorityCheck,
  SeriesCost,
  SeedPosition,
  TermSheetCheck,
  RunwayToA,
  SeedChecklist,
  HopCounter,
  WallFilter,
  PilotPlan,
};
