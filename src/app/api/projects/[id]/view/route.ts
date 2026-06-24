import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Project from "@/lib/models/Project";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();

    // Atomic increment of the views field
    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!updatedProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ views: updatedProject.views });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Increment failed";
    return NextResponse.json(
      { error: "Failed to increment views", details: errorMessage },
      { status: 500 }
    );
  }
}
