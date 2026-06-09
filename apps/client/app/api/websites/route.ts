import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { callBackend } from "@/lib/backend";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { status, data } = await callBackend("/websites", {
      userId: session.user.id,
    });

    return NextResponse.json(data, { status });
  } catch (error) {
    console.error("GET /api/websites error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
