import { NextResponse, type NextRequest } from "next/server";

// AI search measurement, server-side only.
//
// Emits one structured log line when a documented AI crawler fetches a
// page, or when a human arrives from an AI answer engine. Filter Vercel
// runtime logs for `"aiseo"` to see both layers. No cookies, no client
// script, no IP or user identifiers logged: only bot name or referrer
// host, and the path. Covered by the privacy policy's server-logs line.
//
// Apart from the old topic-filter redirect below, it never blocks or
// alters a request.

const AI_BOTS: [RegExp, string][] = [
  [/OAI-SearchBot/i, "OAI-SearchBot"],
  [/ChatGPT-User/i, "ChatGPT-User"],
  [/GPTBot/i, "GPTBot"],
  [/Claude-SearchBot/i, "Claude-SearchBot"],
  [/Claude-User/i, "Claude-User"],
  [/ClaudeBot/i, "ClaudeBot"],
  [/PerplexityBot/i, "PerplexityBot"],
  [/Perplexity-User/i, "Perplexity-User"],
  [/Google-Extended/i, "Google-Extended"],
  [/Applebot/i, "Applebot"],
  [/bingbot/i, "bingbot"],
  [/Googlebot/i, "Googlebot"],
  [/CCBot/i, "CCBot"],
];

const AI_REFERRERS: [RegExp, string][] = [
  [/(^|\.)chatgpt\.com$|(^|\.)chat\.openai\.com$/i, "chatgpt"],
  [/(^|\.)perplexity\.ai$/i, "perplexity"],
  [/(^|\.)claude\.ai$/i, "claude"],
  [/(^|\.)gemini\.google\.com$/i, "gemini"],
  [/(^|\.)copilot\.microsoft\.com$/i, "copilot"],
];

export function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Topic filters used to live at /essays?topic=<slug>, sharing the
  // archive's canonical. Each topic now has its own hub. Redirected here
  // rather than in next.config so the old query string isn't carried
  // onto the new URL.
  const topic = path === "/essays" ? req.nextUrl.searchParams.get("topic") : null;
  if (topic && /^[a-z0-9-]+$/.test(topic)) {
    return NextResponse.redirect(new URL(`/topics/${topic}`, req.url), 308);
  }
  const ua = req.headers.get("user-agent") ?? "";

  const bot = AI_BOTS.find(([re]) => re.test(ua))?.[1];
  if (bot) {
    console.log(JSON.stringify({ aiseo: "bot", bot, path }));
    return NextResponse.next();
  }

  // Referer header first; fall back to utm_source=chatgpt.com and
  // similar, which some engines append when the referer is stripped.
  let source: string | undefined;
  const ref = req.headers.get("referer");
  if (ref) {
    try {
      const host = new URL(ref).hostname;
      source = AI_REFERRERS.find(([re]) => re.test(host))?.[1];
    } catch {
      // malformed referer: ignore
    }
  }
  if (!source) {
    const utm = req.nextUrl.searchParams.get("utm_source");
    if (utm) source = AI_REFERRERS.find(([re]) => re.test(utm))?.[1];
  }
  if (source) {
    console.log(JSON.stringify({ aiseo: "referral", source, path }));
  }

  return NextResponse.next();
}

export const config = {
  // Pages only: skip framework assets, images, and API routes.
  matcher: ["/((?!_next/|api/|images/|brand/|favicon).*)"],
};
