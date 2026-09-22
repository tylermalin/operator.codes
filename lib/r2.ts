import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.env.R2_BUCKET_NAME;

function getClient(): S3Client | null {
  if (!accountId || !accessKeyId || !secretAccessKey) return null;
  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });
}

// 15-minute expiry per the PRD's stated requirement: enough time to
// start a download, short enough that a leaked link doesn't become a
// permanent public mirror.
const EXPIRY_SECONDS = 15 * 60;

export async function getPresignedDownloadUrl(
  objectKey: string,
): Promise<string | null> {
  const client = getClient();
  if (!client || !bucketName) return null;

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: objectKey,
  });

  return getSignedUrl(client, command, { expiresIn: EXPIRY_SECONDS });
}
