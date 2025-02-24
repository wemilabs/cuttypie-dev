import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();

    // Set cache control headers
    const response = NextResponse.json({ session });
    response.headers.set("Cache-Control", "no-store, max-age=0");
    response.headers.set("Pragma", "no-cache");

    return response;
  } catch (error) {
    console.error("Session error:", error);
    return NextResponse.json(
      { session: null },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
          Pragma: "no-cache",
        },
      }
    );
  }
}
