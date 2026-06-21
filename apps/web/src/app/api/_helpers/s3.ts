import { S3Client } from "@aws-sdk/client-s3";

export const s3Bucket = process.env.S3_BUCKET ?? "";
export const s3Prefix = process.env.S3_PREFIX ?? "";

export const s3 = new S3Client({
  region: process.env.AWS_REGION ?? process.env.S3_REGION ?? "us-east-1",
});

export function s3Key(key: string): string {
  const trimmed = key.replace(/^\/+/, "");
  if (!s3Prefix) return trimmed;
  const prefix = s3Prefix.replace(/\/+$/, "");
  return `${prefix}/${trimmed}`;
}
