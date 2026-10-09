import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Project from "@/lib/models/Project";

// No helper needed as description is now natively a nested object in the schema


export async function GET() {
  try {
    await dbConnect();
    
    // Programmatically synchronize and drop stale unique index constraints from older schemas
    try {
      await Project.syncIndexes();
    } catch (indexError) {
      console.warn("Stale index synchronization warning:", indexError);
    }

    // Programmatically migrate and normalize older documents in the collection to match the new nested schema
    try {
      const rawCollection = Project.collection;
      
      // 1. Migrate documents where description is still stored as a String
      const cursor = rawCollection.find({ description: { $type: "string" } });
      while (await cursor.hasNext()) {
        const doc = await cursor.next();
        if (doc) {
          const oldDesc = doc.description;
          let parsedDesc = { desc: [] as string[], features: [] as string[], footer: "" };
          try {
            const parsed = JSON.parse(oldDesc);
            parsedDesc = {
              desc: Array.isArray(parsed?.desc) ? parsed.desc : [],
              features: Array.isArray(parsed?.features) ? parsed.features : [],
              footer: parsed?.footer || ""
            };
          } catch (e) {
            parsedDesc = {
              desc: oldDesc ? [oldDesc] : [],
              features: [],
              footer: ""
            };
          }
          await rawCollection.updateOne({ _id: doc._id }, { $set: { description: parsedDesc } });
        }
      }

      // 2. Add defaults for missing arrays or fields, renaming legacy 'images' to 'imageUrls'
      await rawCollection.updateMany(
        { images: { $exists: true } },
        { $rename: { images: "imageUrls" } }
      );
      await rawCollection.updateMany(
        { imageUrls: { $exists: false } },
        { $set: { imageUrls: [] } }
      );
      await rawCollection.updateMany(
        { "description.desc": { $exists: false } },
        { $set: { "description.desc": [] } }
      );
      await rawCollection.updateMany(
        { "description.features": { $exists: false } },
        { $set: { "description.features": [] } }
      );
      await rawCollection.updateMany(
        { "description.footer": { $exists: false } },
        { $set: { "description.footer": "" } }
      );
    } catch (migrationError) {
      console.warn("Database schema migration warning:", migrationError);
    }

    const projects = await Project.find({}).sort({ sort_order: 1, createdAt: -1 });

    return NextResponse.json(projects);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Database connection failed";
    return NextResponse.json(
      { error: "Failed to fetch projects", details: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    // Programmatically synchronize and drop stale unique index constraints from older schemas
    try {
      await Project.syncIndexes();
    } catch (indexError) {
      console.warn("Stale index synchronization warning during POST:", indexError);
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

    // Validate required root inputs
    if (!title || !short_description) {
      return NextResponse.json(
        { error: "Title and short description are required" },
        { status: 400 }
      );
    }

    const project = await Project.create({
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
      views: 0,
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error: unknown) {
    console.error("POST ERROR DETAILS:", error);
    try {
      const fs = require('fs');
      const path = require('path');
      const logDir = path.join(process.cwd(), 'scratch');
      if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
      fs.writeFileSync(
        path.join(logDir, 'api_error.log'),
        JSON.stringify({
          timestamp: new Date().toISOString(),
          type: 'POST',
          error: error instanceof Error ? { message: error.message, name: error.name, stack: error.stack } : error
        }, null, 2)
      );
    } catch (e) {}

    const errorMessage = error instanceof Error ? error.message : "Creation failed";
    return NextResponse.json(
      { error: "Failed to create project", details: errorMessage },
      { status: 500 }
    );
  }
}
