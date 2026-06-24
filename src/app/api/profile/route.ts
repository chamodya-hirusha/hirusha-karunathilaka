import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Profile from "@/lib/models/Profile";

// Helper to get or create the single profile document
async function getOrCreateProfile() {
  let profile = await Profile.findOne({});
  if (!profile) {
    profile = await Profile.create({
      aboutTitle: "Full-Stack Developer",
      storyParagraphs: [
        "I am a passionate software engineer dedicated to crafting beautiful, high-performance web and mobile applications. With expertise across the entire stack, I build user-centric solutions from initial concepts to final deployment.",
        "I focus on writing clean, maintainable code, optimizing performance, and designing intuitive user interfaces. I love learning new technologies and solving complex problems that deliver real value to clients."
      ],
      experienceYears: 1,
      projectsCount: 15,
      clientsCount: 5,
      cvUrl: "",
      githubUrl: "https://github.com/chamodya-hirusha",
      linkedinUrl: "https://linkedin.com/in/chamodya-hirusha",
      whatsappUrl: "",
      email: "hiruniru99@gmail.com"
    });
  }
  return profile;
}

export async function GET() {
  try {
    await dbConnect();
    const profile = await getOrCreateProfile();
    return NextResponse.json(profile);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Database connection failed";
    return NextResponse.json(
      { error: "Failed to fetch profile", details: errorMessage },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const currentProfile = await getOrCreateProfile();

    const {
      aboutTitle,
      storyParagraphs,
      experienceYears,
      projectsCount,
      clientsCount,
      cvUrl,
      githubUrl,
      linkedinUrl,
      whatsappUrl,
      email
    } = body;

    // Update fields
    if (typeof aboutTitle === "string") currentProfile.aboutTitle = aboutTitle;
    if (Array.isArray(storyParagraphs)) currentProfile.storyParagraphs = storyParagraphs;
    if (typeof experienceYears !== "undefined") currentProfile.experienceYears = Number(experienceYears) || 0;
    if (typeof projectsCount !== "undefined") currentProfile.projectsCount = Number(projectsCount) || 0;
    if (typeof clientsCount !== "undefined") currentProfile.clientsCount = Number(clientsCount) || 0;
    
    if (typeof cvUrl === "string") currentProfile.cvUrl = cvUrl;
    if (typeof githubUrl === "string") currentProfile.githubUrl = githubUrl;
    if (typeof linkedinUrl === "string") currentProfile.linkedinUrl = linkedinUrl;
    if (typeof whatsappUrl === "string") currentProfile.whatsappUrl = whatsappUrl;
    if (typeof email === "string") currentProfile.email = email;

    const savedProfile = await currentProfile.save();

    return NextResponse.json(savedProfile);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Update failed";
    return NextResponse.json(
      { error: "Failed to update profile", details: errorMessage },
      { status: 500 }
    );
  }
}
