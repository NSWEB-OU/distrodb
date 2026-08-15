import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

// Called by apps/cms collection hooks (Distros/Roadmap/Changelog) right after
// a save/delete, so edits show up immediately instead of waiting out the 1h
// `revalidate` window on the corresponding lib/*.ts fetch calls.
const VALID_TAGS = ["distros", "roadmap", "changelog"] as const;
type ValidTag = (typeof VALID_TAGS)[number];

function isValidTag(tag: string | null): tag is ValidTag {
  return !!tag && (VALID_TAGS as readonly string[]).includes(tag);
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const secret = request.nextUrl.searchParams.get("secret");
  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  const tag = request.nextUrl.searchParams.get("tag");
  if (!isValidTag(tag)) {
    return NextResponse.json(
      {
        message: `Missing or invalid "tag" query param (expected one of: ${VALID_TAGS.join(", ")})`,
      },
      { status: 400 }
    );
  }

  revalidateTag(tag, "max");
  return NextResponse.json({ revalidated: true, tag });
}
