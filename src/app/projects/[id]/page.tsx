import dbConnect from "@/lib/mongodb";
import Project from "@/lib/models/Project";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import {
  ArrowLeft,
  Github,
  ExternalLink,
  Smartphone,
  Globe,
  FolderGit2,
  Calendar,
  Eye,
  Layers,
  CheckCircle2,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Generate Dynamic SEO Metadata on the Server
export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  
  try {
    await dbConnect();
    const project = await Project.findById(id);
    if (!project) {
      return {
        title: "Project Not Found | Portfolio",
        description: "The requested portfolio project could not be found.",
      };
    }
    return {
      title: `${project.title} | Case Study`,
      description: project.short_description,
    };
  } catch (e) {
    return {
      title: "Project Details | Portfolio",
      description: "Explore detailed software engineering case studies.",
    };
  }
}

export default async function ProjectDetailsPage({ params }: PageProps) {
  const { id } = await params;
  
  await dbConnect();
  
  let project;
  try {
    project = await Project.findById(id);
  } catch (err) {
    // Cast errors or invalid IDs
    notFound();
  }

  if (!project) {
    notFound();
  }

  const title = project.title;
  const shortDescription = project.short_description;
  const description = project.description || { desc: [], features: [], footer: "" };
  const techList = project.tech || [];
  const githubUrl = project.github_url || "";
  const demoUrl = project.demo_url || "";
  const playstoreUrl = project.playstore_url || "";
  const sortKey = project.sort_key || "web";
  const views = project.views || 0;
  const createdAt = project.createdAt ? new Date(project.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  }) : "Recent";

  const hasDemo = demoUrl && demoUrl !== "#";
  const hasPlaystore = playstoreUrl && playstoreUrl !== "#";
  const hasGithub = githubUrl && githubUrl !== "#" && githubUrl.trim() !== "";
  
  const imageUrls = project.imageUrls || [];

  return (
    <>
      <SEO
        title={`${title} | Case Study`}
        description={shortDescription}
        keywords={[title, sortKey, ...techList]}
      />
      
      <main className="min-h-screen bg-[#07080c] text-[#f4f4f6] relative overflow-hidden">
        {/* Deep luxury ambient lighting glows */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full bg-cyan-500/5 blur-[160px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-purple-500/5 blur-[160px] pointer-events-none" />
        <div className="absolute bottom-10 right-1/3 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[180px] pointer-events-none" />

        <Navbar />

        <div className="max-w-7xl mx-auto px-4 pt-32 pb-24 relative z-10">
          
          {/* Back Navigation */}
          <div className="mb-10">
            <Button
              variant="ghost"
              className="text-xs uppercase tracking-widest font-semibold text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900/40 p-0 flex items-center gap-2 group transition-all"
              asChild
            >
              <Link href="/projects">
                <ArrowLeft className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform duration-300" />
                Back to projects
              </Link>
            </Button>
          </div>

          {/* Project Title Header */}
          <header className="mb-12 space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 text-[10px] uppercase tracking-widest font-mono font-bold rounded-full bg-[#111318]/90 border border-neutral-800/80 text-neutral-300 flex items-center gap-1.5 shadow-md">
                {sortKey === "mobile" ? (
                  <Smartphone className="h-3 w-3 text-cyan-400" />
                ) : sortKey === "web" ? (
                  <Globe className="h-3 w-3 text-purple-400" />
                ) : (
                  <FolderGit2 className="h-3 w-3 text-neutral-400" />
                )}
                {sortKey} project
              </span>
              <span className="px-3 py-1 text-[10px] uppercase tracking-widest font-mono font-semibold rounded-full bg-neutral-900/60 text-neutral-500 border border-neutral-900 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {createdAt}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight glow-text leading-tight text-white max-w-4xl">
              {title}
            </h1>
            
            <p className="text-lg md:text-xl text-neutral-400 max-w-3xl leading-relaxed font-light">
              {shortDescription}
            </p>
          </header>

          {/* Two-Column Canvas Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Left Column (Content, Paragraphs, Gallery) */}
            <div className="lg:col-span-2 space-y-12">
              
              {/* Image Gallery */}
              {imageUrls.length > 0 ? (
                <div className="space-y-4">
                  <div className="aspect-video w-full rounded-xl overflow-hidden bg-[#0d0e12] border border-neutral-800/60 shadow-2xl relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageUrls[0]}
                      alt={`${title} case study screenshot`}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#07080c]/80 via-transparent to-transparent opacity-60" />
                  </div>
                  
                  {/* Thumbnails row if multiple images exist */}
                  {imageUrls.length > 1 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                      {imageUrls.slice(1).map((url, i) => (
                        <div key={i} className="aspect-video rounded-lg overflow-hidden border border-neutral-800 bg-[#0d0e12] shadow-md hover:border-cyan-500/40 transition-colors duration-300">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={url}
                            alt={`${title} thumbnail ${i + 2}`}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* Luxury Glassmorphic Graphic Placeholder (Larger scale for Canvas) */
                <div className="aspect-video w-full rounded-xl flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#0d0e12] via-[#090a0f] to-[#131520] border border-neutral-800/60 shadow-2xl p-8">
                  <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-cyan-500/5 blur-3xl" />
                  <div className="absolute bottom-1/4 left-1/4 w-36 h-36 rounded-full bg-purple-500/5 blur-3xl" />
                  <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:20px_35px]" />
                  
                  <div className="p-5 bg-[#111318]/50 backdrop-blur-lg rounded-2xl border border-white/5 shadow-2xl scale-110 mb-4">
                    {sortKey === "mobile" ? (
                      <Smartphone className="h-10 w-10 text-cyan-400/80 drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]" />
                    ) : sortKey === "web" ? (
                      <Globe className="h-10 w-10 text-purple-400/80 drop-shadow-[0_0_10px_rgba(192,132,252,0.3)]" />
                    ) : (
                      <FolderGit2 className="h-10 w-10 text-neutral-400/80" />
                    )}
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.35em] font-mono text-neutral-500 font-bold">
                    {sortKey} systems architecture
                  </span>
                  <span className="text-xs text-neutral-600 font-sans mt-2">No screenshots uploaded to database</span>
                </div>
              )}

              {/* Detailed Narrative Paragraphs */}
              <section className="space-y-6">
                <h2 className="text-xs uppercase tracking-widest font-bold text-neutral-400 border-b border-neutral-800/40 pb-3 mb-6">
                  Project Narrative
                </h2>
                <div className="text-neutral-300 text-[15px] md:text-[16px] leading-relaxed font-light space-y-6">
                  {description.desc && description.desc.length > 0 ? (
                    description.desc.map((para, i) => (
                      <p key={i} className="text-justify">
                        {para}
                      </p>
                    ))
                  ) : (
                    <p className="italic text-neutral-500">No detailed project narrative available.</p>
                  )}
                </div>
              </section>

              {/* Engineering Features */}
              {description.features && description.features.length > 0 && (
                <section className="space-y-6">
                  <h2 className="text-xs uppercase tracking-widest font-bold text-neutral-400 border-b border-neutral-800/40 pb-3 mb-6">
                    Key Features & Implementations
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {description.features.map((feature, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 p-4 rounded-lg border border-neutral-900 bg-neutral-950/20 backdrop-blur-sm shadow-inner"
                      >
                        <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span className="text-sm text-neutral-300 font-light leading-snug">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Description Footer Notice */}
              {description.footer && (
                <div className="flex items-start gap-4 p-5 rounded-lg border border-cyan-900/30 bg-cyan-950/5 text-cyan-400/95 shadow-lg">
                  <Info className="h-5 w-5 shrink-0 mt-0.5" />
                  <p className="text-xs font-light leading-relaxed">
                    {description.footer}
                  </p>
                </div>
              )}

            </div>

            {/* Right Column (Sidebar, Tech, Links, Stats) */}
            <div className="space-y-8">
              
              {/* Action Hub Glassmorphic Card */}
              <Card className="border-neutral-800/80 bg-[#090a0f]/85 backdrop-blur-lg shadow-xl p-6 rounded-xl">
                <CardContent className="p-0 space-y-6">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-200">
                    Project Resources
                  </h3>
                  
                  <div className="space-y-3.5">
                    {hasDemo && (
                      <Button
                        className="w-full bg-cyan-600 hover:bg-cyan-500 text-neutral-950 text-xs font-bold uppercase tracking-wider h-11 flex items-center justify-center gap-2 rounded-lg shadow-md hover:shadow-cyan-500/10 transition-all"
                        asChild
                      >
                        <a href={demoUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                          Launch Application
                        </a>
                      </Button>
                    )}

                    {hasPlaystore && (
                      <Button
                        className="w-full bg-[#111318] hover:bg-neutral-900 text-neutral-100 border border-neutral-800/80 hover:border-neutral-700 text-xs font-bold uppercase tracking-wider h-11 flex items-center justify-center gap-2 rounded-lg transition-all"
                        asChild
                      >
                        <a href={playstoreUrl} target="_blank" rel="noopener noreferrer">
                          <Smartphone className="h-4 w-4 text-cyan-400" />
                          Download App
                        </a>
                      </Button>
                    )}

                    {hasGithub && (
                      <Button
                        variant="outline"
                        className="w-full border-neutral-850 hover:border-neutral-700 bg-neutral-950/20 text-neutral-300 hover:text-neutral-100 text-xs font-bold uppercase tracking-wider h-11 flex items-center justify-center gap-2 rounded-lg transition-all"
                        asChild
                      >
                        <a href={githubUrl} target="_blank" rel="noopener noreferrer">
                          <Github className="h-4 w-4" />
                          Inspect Codebase
                        </a>
                      </Button>
                    )}

                    {!hasDemo && !hasPlaystore && !hasGithub && (
                      <p className="text-xs text-neutral-500 italic">No public resource links are available for this project.</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Technologies List */}
              <Card className="border-neutral-800/80 bg-[#090a0f]/85 backdrop-blur-lg shadow-xl p-6 rounded-xl">
                <CardContent className="p-0 space-y-4">
                  <div className="flex items-center gap-2 border-b border-neutral-800/30 pb-3">
                    <Layers className="h-4 w-4 text-purple-400" />
                    <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-200">
                      Technology Stack
                    </h3>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 pt-2">
                    {techList.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 text-xs font-light rounded border border-neutral-800/60 bg-[#111318]/55 text-neutral-300 font-mono shadow-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Engagement Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-neutral-900 bg-neutral-950/10 backdrop-blur-sm flex flex-col justify-center">
                  <span className="text-[9px] uppercase tracking-widest font-mono text-neutral-500 font-bold mb-1">
                    System category
                  </span>
                  <span className="text-sm font-semibold text-neutral-300 capitalize">
                    {sortKey}
                  </span>
                </div>

                <div className="p-4 rounded-xl border border-neutral-900 bg-neutral-950/10 backdrop-blur-sm flex flex-col justify-center">
                  <div className="flex items-center gap-1 mb-1">
                    <Eye className="h-3.5 w-3.5 text-neutral-500" />
                    <span className="text-[9px] uppercase tracking-widest font-mono text-neutral-500 font-bold">
                      Impressions
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-neutral-350 font-mono">
                    {views} view{views !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

            </div>

          </div>

        </div>

        <Footer />
      </main>
    </>
  );
}
