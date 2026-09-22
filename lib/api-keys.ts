import { randomBytes, createHash } from "crypto";

// Raw key is shown to the user exactly once, at creation. Only the
// hash is ever persisted, matching the PRD's `hashed_key` column.
export function generateApiKey(): { rawKey: string; hashedKey: string; prefix: string } {
  const rawKey = `op_${randomBytes(24).toString("hex")}`;
  const hashedKey = createHash("sha256").update(rawKey).digest("hex");
  const prefix = rawKey.slice(0, 11); // "op_" + 8 chars, enough to recognize in a list
  return { rawKey, hashedKey, prefix };
}

export function hashApiKey(rawKey: string): string {
  return createHash("sha256").update(rawKey).digest("hex");
}
