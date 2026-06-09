import { NextRequest, NextResponse } from "next/server";
import { callBackendPublic } from "@/lib/backend";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { status, data } = await callBackendPublic("/signup", {
      method: "POST",
      body,
    });

    return NextResponse.json(data, { status });
  } catch (error) {
    console.error("POST /api/signup error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
