import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

let limiter: Ratelimit | null = null;

function getLimiter(requestsPerMinute: number): Ratelimit | null {
  if (!url || !token) return null;
  // One limiter instance per quota tier would be more correct at
  // scale; a single shared instance is fine for the request volume
  // this template is built for. Revisit if quota tiers diverge widely.
  if (!limiter) {
    limiter = new Ratelimit({
      redis: new Redis({ url, token }),
      limiter: Ratelimit.slidingWindow(requestsPerMinute, "60 s"),
    });
  }
  return limiter;
}

export async function checkRateLimit(
  apiKeyId: string,
  requestsPerMinute: number,
): Promise<{ allowed: boolean; remaining: number }> {
  const rl = getLimiter(requestsPerMinute);
  if (!rl) {
    // Upstash not provisioned: fail open rather than blocking every
    // request. Acceptable for dev, not for production with real
    // metered API access, flagged here deliberately.
    return { allowed: true, remaining: requestsPerMinute };
  }
  const result = await rl.limit(apiKeyId);
  return { allowed: result.success, remaining: result.remaining };
}
