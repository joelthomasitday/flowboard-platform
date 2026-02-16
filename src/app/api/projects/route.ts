import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get('workspaceId');

    if (!workspaceId) {
       return NextResponse.json({ error: 'Workspace ID required' }, { status: 400 });
    }

    const projects = await db.project.findMany({
      where: { workspaceId },
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json(projects);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
