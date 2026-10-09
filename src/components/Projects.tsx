"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader2, ExternalLink, Globe, Smartphone, Monitor, ShoppingCart, Layers, LayoutGrid } from "lucide-react";
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

const Projects = () => {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setProjects(data);
          } else {
            console.warn("API returned empty array or invalid data format.");
            setProjects([]);
          }
        } else {
          const errorText = await res.text();
          console.error(`API Error (${res.status}):`, errorText);
          setProjects([]);
        }
      } catch (err) {
        console.error("Network or parsing error fetching portfolio projects:", err);
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
      console.error("Failed to register project click:", err);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 },
  };

  // Base pool: featured projects (fall back to all if none marked featured)
  const featuredProjects = projects.filter((p) => p.is_featured);
  const basePool = featuredProjects.length > 0 ? featuredProjects : projects;

  // Apply category filter on top of the base pool
  const filteredProjects =
    activeCategory === "all"
      ? basePool
      : basePool.filter((p) =>
          (p.category || "Other").toLowerCase() === activeCategory.toLowerCase()
        );

  // Derive which categories actually have projects in the base pool
  const availableCategories = CATEGORIES.filter((cat) => {
    if (cat.value === "all") return true;
    return basePool.some(
      (p) => (p.category || "Other").toLowerCase() === cat.value.toLowerCase()
    );
  });

  return (
    <section id="projects" className="py-20 relative">
      {/* Visual ambient lighting decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="container px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            <span className="gradient-text">Featured Projects</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-10" />

          {/* ── Category Filter Buttons ── */}
          {!loading && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap justify-center gap-2 mb-10"
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
                    {isActive && (
                      <motion.span
                        layoutId="fp-active-pill"
                        className="absolute inset-0 rounded-full bg-primary -z-10"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </motion.div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground text-sm">Loading dynamic projects...</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                variants={container}
                initial="hidden"
                animate={inView ? "show" : "hidden"}
                exit={{ opacity: 0, y: -10 }}
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto"
              >
                {filteredProjects.slice(0, 3).map((project, index) => (
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
                    className="col-span-full text-center py-16 text-muted-foreground"
                  >
                    <Layers className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No projects in this category yet.</p>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          )}

          {projects.length > 3 && (
            <div className="flex justify-center mt-12">
              <Button
                asChild
                variant="outline"
                className="border-primary/40 hover:border-primary text-sm font-semibold px-8 py-5 h-auto rounded-lg flex items-center gap-2 shadow-md hover:shadow-primary/5 transition-all"
              >
                <Link href="/projects">
                  See More Projects
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
