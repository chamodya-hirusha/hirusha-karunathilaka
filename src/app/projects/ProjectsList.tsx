"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Globe, Smartphone, Monitor, ShoppingCart, Layers, LayoutGrid } from "lucide-react";
import { ProjectCard } from "@/components/ProjectCard";

interface ProjectDescription {
  desc: string[];
  features: string[];
  footer?: string;
}

interface ProjectType {
  _id: string;
  title: string;
  short_description: string;
  description: ProjectDescription;
  tech: string[];
  demo_url?: string;
  playstore_url?: string;
  github_url?: string;
  sort_key?: string;
  sort_order: number;
  is_featured: boolean;
  imageUrls?: string[];
  views?: number;
  category?: string;
}

const CATEGORIES = [
  { label: "All",          value: "all",         icon: LayoutGrid },
  { label: "Web Site",     value: "Web Site",     icon: Globe },
  { label: "Mobile App",   value: "Mobile App",   icon: Smartphone },
  { label: "Demo Project", value: "Demo Project", icon: Monitor },
  { label: "POS System",   value: "POS System",   icon: ShoppingCart },
  { label: "Other",        value: "Other",        icon: Layers },
];

export default function ProjectsList() {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setProjects(data);
          } else {
            setProjects([]);
          }
        } else {
          setProjects([]);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleProjectClick = async (projectId?: string) => {
    if (!projectId) return;
    try {
      await fetch(`/api/projects/${projectId}/view`, { method: "PATCH" });
    } catch (err) {
      console.error("Failed to register view click:", err);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  // Apply category filter
  const filteredProjects =
    activeCategory === "all"
      ? projects
      : projects.filter(
          (p) => (p.category || "Other").toLowerCase() === activeCategory.toLowerCase()
        );

  // Derive which categories actually have projects
  const availableCategories = CATEGORIES.filter((cat) => {
    if (cat.value === "all") return true;
    return projects.some(
      (p) => (p.category || "Other").toLowerCase() === cat.value.toLowerCase()
    );
  });

  return (
    <div className="space-y-8">
      {/* Top Controls & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Button
          asChild
          variant="ghost"
          className="w-fit border border-neutral-800/60 bg-neutral-950/20 text-neutral-400 hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
        >
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>
        <span className="text-xs font-mono text-neutral-500">
          Showing {filteredProjects.length} of {projects.length} project{projects.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Page Header */}
      <div className="space-y-4">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          <span className="gradient-text">All Projects</span>
        </h1>
        <p className="text-muted-foreground text-base max-w-2xl leading-relaxed">
          A complete showcase of my software engineering work, contributions, and open-source packages.
          Use the links below to inspect source codes on GitHub or interact with active production demos.
        </p>
        <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary" />
      </div>

      {/* ── Category Filter Buttons ── */}
      {!loading && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-wrap gap-2"
        >
          {availableCategories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`relative flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
                  isActive
                    ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/30 scale-105"
                    : "bg-card/60 text-muted-foreground border-border/50 hover:border-primary/50 hover:text-foreground hover:bg-card hover:scale-105"
                }`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                {cat.label}
              </button>
            );
          })}
        </motion.div>
      )}

      {/* Projects Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">Retrieving full catalogue...</p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            variants={container}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, y: -10 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2"
          >
            {filteredProjects.map((project, index) => (
              <motion.div key={`${project.title}-${index}`} variants={item} className="group">
                <ProjectCard
                  project={project as any}
                  onProjectClick={handleProjectClick}
                />
              </motion.div>
            ))}
            {filteredProjects.length === 0 && (
              <motion.div
                variants={item}
                className="col-span-full text-center py-24 text-muted-foreground"
              >
                <Layers className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No projects in this category yet.</p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
