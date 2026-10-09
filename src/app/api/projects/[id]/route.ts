import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Project from "@/lib/models/Project";

// No helper needed as description is now natively a nested object in the schema

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();
    
    // Programmatically synchronize and drop stale unique index constraints from older schemas
    try {
      await Project.syncIndexes();
    } catch (indexError) {
      console.warn("Stale index synchronization warning during PUT:", indexError);
    }

    const body = await request.json();

    const {
      title,
      short_description,
      description,
      tech,
      demo_url,
      playstore_url,
      github_url,
      sort_key,
      sort_order,
      is_featured,
      imageUrls,
      category,
    } = body;

    if (!title || !short_description) {
      return NextResponse.json(
        { error: "Title and short description are required" },
        { status: 400 }
      );
    }

    const updatedProject = await Project.findByIdAndUpdate(
      id,
      {
        title,
        short_description,
        description: {
          desc: Array.isArray(description?.desc) ? description.desc : [],
          features: Array.isArray(description?.features) ? description.features : [],
          footer: description?.footer || "",
        },
        tech: Array.isArray(tech) ? tech : [],
        demo_url: demo_url || "",
        playstore_url: playstore_url || "",
        github_url: github_url || "",
        sort_key: sort_key || "",
        sort_order: typeof sort_order !== "undefined" ? Number(sort_order) || 0 : 0,
        is_featured: typeof is_featured === "boolean" ? is_featured : false,
        imageUrls: Array.isArray(imageUrls) ? imageUrls : [],
        category: category || "",
      },
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(updatedProject);
  } catch (error: unknown) {
    console.error("PUT ERROR DETAILS:", error);
    try {
      const fs = require('fs');
      const path = require('path');
      const logDir = path.join(process.cwd(), 'scratch');
      if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
      fs.writeFileSync(
        path.join(logDir, 'api_error.log'),
        JSON.stringify({
          timestamp: new Date().toISOString(),
          type: 'PUT',
          error: error instanceof Error ? { message: error.message, name: error.name, stack: error.stack } : error
        }, null, 2)
      );
    } catch (e) {}

    const errorMessage = error instanceof Error ? error.message : "Update failed";
    return NextResponse.json(
      { error: "Failed to update project", details: errorMessage },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();

    const deletedProject = await Project.findByIdAndDelete(id);

    if (!deletedProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Deletion failed";
    return NextResponse.json(
      { error: "Failed to delete project", details: errorMessage },
      { status: 500 }
    );
  }
}
