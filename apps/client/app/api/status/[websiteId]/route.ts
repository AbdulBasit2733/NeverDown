import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { callBackend } from "@/lib/backend";

type RouteContext = {
  params: Promise<{ websiteId: string }>;
};

export async function GET(_req: Request, context: RouteContext) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { websiteId } = await context.params;
    const { status, data } = await callBackend(`/status/${websiteId}`, {
      userId: session.user.id,
    });

    return NextResponse.json(data, { status });
  } catch (error) {
    console.error("GET /api/status/[websiteId] error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
