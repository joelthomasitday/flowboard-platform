import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get('workspaceId');

    if (!workspaceId) {
      return NextResponse.json({ error: "Workspace ID is required" }, { status: 400 });
    }

    const tasks = await db.task.findMany({
      where: {
        project: {
          workspaceId: workspaceId
        }
      },
      include: {
        project: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(tasks.map(t => ({
      id: t.id,
      title: t.title,
      description: t.description || "",
      status: t.status,
      priority: t.priority,
      dueDate: t.dueDate ? new Date(t.dueDate).toISOString().split('T')[0] : "No date",
      assignee: "You", // Hardcoded for simplified view
      project: t.project.name,
      projectId: t.projectId
    })));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, status, priority, dueDate, projectId } = body;

    // Default to the first project if not provided
    let targetProjectId = projectId;
    if (!targetProjectId) {
      const firstProject = await db.project.findFirst();
      if (!firstProject) throw new Error("No projects found to add task to.");
      targetProjectId = firstProject.id;
    }

    const task = await db.task.create({
      data: {
        title,
        description: description || "Added from dashboard",
        status: status || "TODO",
        priority: priority || "MEDIUM",
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId: targetProjectId,
      }
    });

    return NextResponse.json(task);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, title, description, status, priority, dueDate, projectId } = body;

    if (!id) throw new Error("Task ID is required for updates");

    const task = await db.task.update({
      where: { id },
      data: {
        title,
        description,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId
      }
    });

    return NextResponse.json(task);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
    }

    await db.task.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
