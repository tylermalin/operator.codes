import type { SourceRegistry } from "./types";

// Sources for "The Fence Line" (companion to the essay Own What You Host).
// Every entry was opened and checked on 2026-11-09. Order sets numbering.

export const SOURCES = {
  "lbnl-2024": {
    title: "Berkeley Lab report evaluates increase in electricity demand from data centers",
    publisher: "Lawrence Berkeley National Laboratory",
    date: "2025-01-17",
    url: "https://energyanalysis.lbl.gov/news/berkeley-lab-report-evaluates-increase-electricity-demand-data-centers",
    kind: "research",
  },
  "pjm-bra-2728": {
    title: "PJM auction procures 134,479 MW of generation resources (2027/2028 BRA)",
    publisher: "PJM Interconnection",
    date: "2025-12-17",
    url: "https://www.pjm.com/-/media/DotCom/about-pjm/newsroom/2025-releases/20251217-pjm-auction-procures-134479-mw-of-generation-resources.pdf",
    kind: "primary",
  },
  "icprb-water": {
    title: "Data centers and water use in the Potomac River basin",
    publisher: "Interstate Commission on the Potomac River Basin",
    date: "2026-03",
    url: "https://www.potomacriver.org/focus-areas/water-resources-and-drinking-water/water-resources/planning/data-centers-and-water-use-in-the-potomac-river-basin/",
    kind: "research",
  },
  "comar-noise": {
    title: "COMAR 26.02.03.02, Environmental noise standards, Table 1",
    publisher: "Maryland Department of the Environment",
    date: "current",
    url: "https://mde.maryland.gov/programs/regulations/air/documents/26.02.03_noise_pollution_control_in_md_reg_11-02-2012.pdf",
    kind: "regulator",
  },
  "pg-banner": {
    title: "Prince George's council votes to pause new data centers",
    publisher: "The Baltimore Banner",
    date: "2026-07-08",
    url: "https://www.thebanner.com/politics-power/local-government/prince-georges-county-council-data-center-moratorium-CKGTDP5ZNFBFRNF3NGTTA5UARI/",
    kind: "reporting",
  },
  "pg-wtop": {
    title: "Prince George's Co. extends pause on hyperscale data center development",
    publisher: "WTOP",
    date: "2026-07",
    url: "https://wtop.com/prince-georges-county/2026/07/prince-georges-co-extends-pause-on-hyperscale-data-center-development/",
    kind: "reporting",
  },
  "pg-wunc": {
    title: "An unexpected activist emerged to help block a $5 billion data center in Maryland",
    publisher: "WUNC / NPR",
    date: "2026-11-07",
    url: "https://www.wunc.org/2026-11-07/an-unexpected-activist-emerged-to-help-block-a-5-billion-data-center-in-maryland",
    kind: "reporting",
  },
  "moco-wtop": {
    title: "Montgomery Co. considers 18-month pause on data centers",
    publisher: "WTOP",
    date: "2026-07",
    url: "https://wtop.com/montgomery-county/2026/07/possible-18-month-pause-on-data-centers-considered-in-montgomery-county/",
    kind: "reporting",
  },
  "pwdg-wtop": {
    title: "Developers drop appeal of zoning decision on Digital Gateway project",
    publisher: "WTOP",
    date: "2026-04",
    url: "https://wtop.com/prince-william-county/2026/04/developers-drop-appeal-of-zoning-decision-on-digital-gateway-project/",
    kind: "reporting",
  },
  "tucson-luminaria": {
    title: "Tucson City Council rejects Project Blue amid intense community pressure",
    publisher: "Arizona Luminaria",
    date: "2025-08-06",
    url: "https://azluminaria.org/2025/08/06/tucson-city-council-rejects-project-blue-amid-intense-community-pressure/",
    kind: "reporting",
  },
  "cru-leu": {
    title: "New Irish large energy users connection policy (CRU2025236)",
    publisher: "DLA Piper",
    date: "2026-01",
    url: "https://www.dlapiper.com/insights/publications/2026/01/new-irish-large-energy-users-connection-policy",
    kind: "reporting",
  },
  "dgcl-151": {
    title: "Delaware General Corporation Law § 151, Classes and series of stock",
    publisher: "State of Delaware",
    date: "current",
    url: "https://delcode.delaware.gov/title8/c001/sc05/index.html",
    kind: "primary",
  },
} satisfies SourceRegistry;

export type SourceId = keyof typeof SOURCES;

export type Lever = "Water" | "Power" | "Process" | "Noise" | "Tax";

export type Case = {
  place: string;
  what: string;
  status: "Paused" | "Blocked" | "Conditioned" | "Proposed";
  date: string;
  levers: Lever[];
  facts: { text: string; source: SourceId }[];
};

// Resistance radar. Only cases with a checked source; status as of the
// most recent source date.
export const CASES: Case[] = [
  {
    place: "Prince George's County, Maryland",
    what: "Council paused new hyperscale data centers",
    status: "Paused",
    date: "Jul 2026",
    levers: ["Water", "Power", "Noise"],
    facts: [
      {
        text: "Resolution bars the planning department from considering data center applications for up to two years, or until the council passes regulating legislation.",
        source: "pg-banner",
      },
      {
        text: "Residents cited utility rates, water, health, grid strain, and proximity to homes.",
        source: "pg-wtop",
      },
      {
        text: "The $5 billion Landover Mall campus, approved by planners in 2024, is now on hold after a petition passed 25,000 signatures.",
        source: "pg-wunc",
      },
    ],
  },
  {
    place: "Prince William County, Virginia",
    what: "Digital Gateway rezoning voided; developers dropped appeal",
    status: "Blocked",
    date: "Apr 2026",
    levers: ["Process"],
    facts: [
      {
        text: "About 2,000 acres and 37 data centers, over 22 million square feet at full build-out.",
        source: "pwdg-wtop",
      },
      {
        text: "Circuit court voided the rezonings in August 2025 for improper public notice; the Court of Appeals upheld that on March 31, 2026, and Compass did not contest it.",
        source: "pwdg-wtop",
      },
    ],
  },
  {
    place: "Tucson, Arizona",
    what: "City council ended Project Blue",
    status: "Blocked",
    date: "Aug 2025",
    levers: ["Water"],
    facts: [
      {
        text: "Unanimous vote to end negotiations on annexing the 290-acre site, cutting off the developer's proposed access to city water.",
        source: "tucson-luminaria",
      },
    ],
  },
  {
    place: "Montgomery County, Maryland",
    what: "Committee recommended an 18-month pause",
    status: "Proposed",
    date: "Jul 2026",
    levers: ["Tax", "Process"],
    facts: [
      {
        text: "Economic Development Committee voted unanimously to recommend an 18-month pause; a separate committee defined a large data center as 25 MW or more.",
        source: "moco-wtop",
      },
    ],
  },
  {
    place: "Ireland",
    what: "New connections conditioned on matching generation",
    status: "Conditioned",
    date: "Dec 2025",
    levers: ["Power"],
    facts: [
      {
        text: "Data centers at 10 MVA or more must bring dispatchable generation or storage matching 100% of import capacity, and source at least 80% of annual demand from new Irish renewables.",
        source: "cru-leu",
      },
    ],
  },
];
