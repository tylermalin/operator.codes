import { issueSignedToken, presignUrl } from "@vercel/blob";

// Vercel Blob (private store) replaces Cloudflare R2. Same contract as
// the old lib/r2.ts: hand back a time-limited download URL or null when
// storage isn't configured, so the route can 503 cleanly.
//
// Auth is ambient: on Vercel, a connected store injects
// BLOB_READ_WRITE_TOKEN (or OIDC via BLOB_STORE_ID). Locally, set
// BLOB_READ_WRITE_TOKEN in .env.local if you need downloads in dev.

const configured = Boolean(
  process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID,
);

// 15-minute expiry per the PRD's stated requirement: enough time to
// start a download, short enough that a leaked link doesn't become a
// permanent public mirror.
const EXPIRY_MS = 15 * 60 * 1000;

export async function getPresignedDownloadUrl(
  pathname: string,
): Promise<string | null> {
  if (!configured) return null;

  const token = await issueSignedToken({
    pathname,
    operations: ["get"],
    validUntil: Date.now() + EXPIRY_MS,
  });

  const { presignedUrl } = await presignUrl(token, {
    operation: "get",
    pathname,
    access: "private",
  });

  return presignedUrl;
}
