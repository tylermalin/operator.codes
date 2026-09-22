// Essay figures for Your Agent Can Sign. Rendered as light plates on
// the dark page, matching the hero-illustration treatment. SVG markup
// is static trusted content authored for this essay; injected raw to
// avoid a lossy hand-conversion to JSX attributes.

function FigurePlate({
  label,
  badge,
  svg,
}: {
  label: string;
  badge: string;
  svg: string;
}) {
  return (
    <figure className="my-10 rounded-2xl bg-[#f4f2ed] p-5 sm:p-6">
      <figcaption className="flex items-center justify-between gap-3 border-b border-stone-300/70 pb-3 mb-4">
        <span className="font-mono text-xs font-medium text-stone-500">
          {label}
        </span>
        <span className="font-mono text-[11px] bg-stone-200 text-stone-600 px-2 py-0.5 rounded whitespace-nowrap">
          {badge}
        </span>
      </figcaption>
      <div
        className="flex justify-center [&_svg]:w-full [&_svg]:h-auto [&_svg]:max-w-2xl"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </figure>
  );
}

const containmentMeshSvg = `<svg viewBox="0 0 700 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Diagram: one master Delaware LLC above three protected series, each holding its own wallet, limits, and scope, each with firewalled liabilities">
  <rect x="150" y="10" width="400" height="48" rx="8" fill="#18181b" stroke="#27272a" stroke-width="1.5"/>
  <text x="350" y="32" fill="#ffffff" font-size="13" font-weight="600" text-anchor="middle" font-family="sans-serif">Master Delaware LLC</text>
  <text x="350" y="47" fill="#a1a1aa" font-size="11" text-anchor="middle" font-family="sans-serif">Single Public Filing &#8226; Master Operating Agreement</text>

  <line x1="350" y1="58" x2="350" y2="85" stroke="#71717a" stroke-width="1.5" stroke-dasharray="3 3"/>
  <line x1="120" y1="85" x2="580" y2="85" stroke="#71717a" stroke-width="1.5"/>
  <line x1="120" y1="85" x2="120" y2="105" stroke="#71717a" stroke-width="1.5"/>
  <line x1="350" y1="85" x2="350" y2="105" stroke="#71717a" stroke-width="1.5"/>
  <line x1="580" y1="85" x2="580" y2="105" stroke="#71717a" stroke-width="1.5"/>

  <g transform="translate(30, 105)" font-family="sans-serif">
    <rect width="180" height="170" rx="8" fill="#ffffff" stroke="#d6d3d1" stroke-width="1.5"/>
    <rect width="180" height="32" rx="8" fill="#f4f4f5"/>
    <text x="90" y="21" fill="#09090b" font-size="12" font-weight="600" text-anchor="middle">Series A: Data Broker</text>
    <text x="14" y="55" fill="#52525b" font-size="11">Wallet: 0x9f1a...4B2c</text>
    <text x="14" y="75" fill="#52525b" font-size="11">Limit: $10,000 / day</text>
    <text x="14" y="95" fill="#52525b" font-size="11">Scope: Data Licensing</text>
    <rect x="12" y="125" width="156" height="30" rx="5" fill="#ecfdf5" stroke="#a7f3d0"/>
    <text x="90" y="144" fill="#065f46" font-size="10" font-weight="600" text-anchor="middle">Firewalled Liabilities</text>
  </g>

  <g transform="translate(260, 105)" font-family="sans-serif">
    <rect width="180" height="170" rx="8" fill="#ffffff" stroke="#d6d3d1" stroke-width="1.5"/>
    <rect width="180" height="32" rx="8" fill="#f4f4f5"/>
    <text x="90" y="21" fill="#09090b" font-size="12" font-weight="600" text-anchor="middle">Series B: Trading Bot</text>
    <text x="14" y="55" fill="#52525b" font-size="11">Wallet: 0x3d08...E91a</text>
    <text x="14" y="75" fill="#52525b" font-size="11">Limit: $50,000 drawdown</text>
    <text x="14" y="95" fill="#52525b" font-size="11">Scope: Liquidity Provision</text>
    <rect x="12" y="125" width="156" height="30" rx="5" fill="#ecfdf5" stroke="#a7f3d0"/>
    <text x="90" y="144" fill="#065f46" font-size="10" font-weight="600" text-anchor="middle">Firewalled Liabilities</text>
  </g>

  <g transform="translate(490, 105)" font-family="sans-serif">
    <rect width="180" height="170" rx="8" fill="#ffffff" stroke="#d6d3d1" stroke-width="1.5"/>
    <rect width="180" height="32" rx="8" fill="#f4f4f5"/>
    <text x="90" y="21" fill="#09090b" font-size="12" font-weight="600" text-anchor="middle">Series C: Ephemeral Agent</text>
    <text x="14" y="55" fill="#52525b" font-size="11">Wallet: 0x8a24...10ec</text>
    <text x="14" y="75" fill="#52525b" font-size="11">Limit: Single-Task SLA</text>
    <text x="14" y="95" fill="#52525b" font-size="11">Scope: Cloud Compute Ops</text>
    <rect x="12" y="125" width="156" height="30" rx="5" fill="#ecfdf5" stroke="#a7f3d0"/>
    <text x="90" y="144" fill="#065f46" font-size="10" font-weight="600" text-anchor="middle">Firewalled Liabilities</text>
  </g>
</svg>`;

const pipelineSvg = `<svg viewBox="0 0 700 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Diagram: agent runtime flows through AgentCorp middleware into a Series LLC container, from software tier through enforcement boundary to legal tier">
  <defs>
    <marker id="fig2arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#71717a"/>
    </marker>
  </defs>

  <g font-family="sans-serif">
    <rect x="30" y="20" width="190" height="200" rx="8" fill="#ffffff" stroke="#d6d3d1" stroke-width="1.5"/>
    <rect x="30" y="20" width="190" height="34" rx="8" fill="#f4f4f5"/>
    <text x="125" y="42" fill="#18181b" font-size="12" font-weight="600" text-anchor="middle">Agent Runtime</text>
    <text x="45" y="80" fill="#52525b" font-size="11">&#8226; LLM Inference Engine</text>
    <text x="45" y="105" fill="#52525b" font-size="11">&#8226; Autonomous Planning</text>
    <text x="45" y="130" fill="#52525b" font-size="11">&#8226; Tool &#38; Function Calling</text>
    <text x="45" y="155" fill="#52525b" font-size="11">&#8226; Dynamic Memory</text>
    <text x="125" y="195" fill="#71717a" font-size="10" font-style="italic" text-anchor="middle">Software Tier</text>

    <path d="M220 120 L250 120" stroke="#71717a" stroke-width="2" marker-end="url(#fig2arrow)"/>

    <rect x="255" y="20" width="190" height="200" rx="8" fill="#ffffff" stroke="#2563eb" stroke-width="1.5"/>
    <rect x="255" y="20" width="190" height="34" rx="8" fill="#eff6ff"/>
    <text x="350" y="42" fill="#1d4ed8" font-size="12" font-weight="600" text-anchor="middle">AgentCorp Middleware</text>
    <text x="270" y="80" fill="#334155" font-size="11">&#8226; Spending Guardrails</text>
    <text x="270" y="105" fill="#334155" font-size="11">&#8226; Authority Proof Service</text>
    <text x="270" y="130" fill="#334155" font-size="11">&#8226; SLA Attestation Keys</text>
    <text x="270" y="155" fill="#334155" font-size="11">&#8226; Pre-execution Notice</text>
    <text x="350" y="195" fill="#2563eb" font-size="10" font-weight="600" text-anchor="middle">Enforcement Boundary</text>

    <path d="M445 120 L475 120" stroke="#71717a" stroke-width="2" marker-end="url(#fig2arrow)"/>

    <rect x="480" y="20" width="190" height="200" rx="8" fill="#ffffff" stroke="#d6d3d1" stroke-width="1.5"/>
    <rect x="480" y="20" width="190" height="34" rx="8" fill="#f4f4f5"/>
    <text x="575" y="42" fill="#18181b" font-size="12" font-weight="600" text-anchor="middle">Series LLC Container</text>
    <text x="495" y="80" fill="#52525b" font-size="11">&#8226; Segregated Bank / Escrow</text>
    <text x="495" y="105" fill="#52525b" font-size="11">&#8226; Discrete Entity EIN</text>
    <text x="495" y="130" fill="#52525b" font-size="11">&#8226; Statutory Firewall</text>
    <text x="495" y="155" fill="#52525b" font-size="11">&#8226; Delaware &#167; 18-215 Shield</text>
    <text x="575" y="195" fill="#059669" font-size="10" font-weight="600" text-anchor="middle">Legal Tier</text>
  </g>
</svg>`;

export function SeriesContainmentMesh() {
  return (
    <FigurePlate
      label="Figure 1.0 // Delaware Series Containment Mesh"
      badge="Delaware LLC Act &sect; 18-215"
      svg={containmentMeshSvg}
    />
  );
}

export function AgentCorpPipeline() {
  return (
    <FigurePlate
      label="Figure 2.0 // AgentCorp Architectural Pipeline"
      badge="Runtime to Legal Wrapper"
      svg={pipelineSvg}
    />
  );
}
