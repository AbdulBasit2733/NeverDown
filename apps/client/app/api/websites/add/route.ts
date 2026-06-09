import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { callBackend } from "@/lib/backend";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { status, data } = await callBackend("/add-website", {
      method: "POST",
      body,
      userId: session.user.id,
    });

    return NextResponse.json(data, { status });
  } catch (error) {
    console.error("POST /api/websites/add error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
