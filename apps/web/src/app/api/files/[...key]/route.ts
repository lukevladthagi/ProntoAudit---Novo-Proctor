import { NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3, s3Bucket } from "@/app/api/_helpers/s3";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string[] }> },
) {
  const { key: keyParts } = await params;
  const key = (keyParts ?? []).join("/");

  if (!key) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  try {
    const result = await s3.send(
      new GetObjectCommand({
        Bucket: s3Bucket,
        Key: key,
      }),
    );

    const body = result.Body;
    if (!body) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const stream = body.transformToWebStream();
    const headers = new Headers();
    if (result.ContentType) headers.set("content-type", result.ContentType);
    if (result.ETag) headers.set("etag", result.ETag);
    if (result.ContentLength != null) {
      headers.set("content-length", String(result.ContentLength));
    }
    headers.set("cache-control", "public, max-age=31536000");

    return new Response(stream, { headers });
  } catch (error) {
    const code = (error as { name?: string; Code?: string })?.name
      ?? (error as { Code?: string })?.Code;
    if (code === "NoSuchKey" || code === "NotFound") {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
    console.error("Error downloading file:", error);
    return NextResponse.json({ error: "Failed to download file" }, { status: 500 });
  }
}
