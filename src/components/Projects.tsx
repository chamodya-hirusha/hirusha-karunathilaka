"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader2, ExternalLink } from "lucide-react";
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
}

const Projects = () => {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [loading, setLoading] = useState(true);

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Fetch projects from the API on mount
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
        console.error("Error fetching portfolio projects:", err);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Increment views count on user click
  const handleProjectClick = async (projectId?: string) => {
    if (!projectId) return;
    try {
      await fetch(`/api/projects/${projectId}/view`, {
        method: "PATCH",
      });
    } catch (err) {
      console.error("Failed to register project click:", err);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 },
  };

  // Filter projects that are marked as featured for the landing page
  const featuredProjects = projects.filter((p) => p.is_featured);
  const displayProjects = featuredProjects.length > 0 ? featuredProjects : projects;

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
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-16" />

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground text-sm">Loading dynamic projects...</p>
            </div>
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              animate={inView ? "show" : "hidden"}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto"
            >
              {displayProjects.slice(0, 3).map((project, index) => (
                <motion.div key={`${project.title}-${index}`} variants={item} className="group">
                  <ProjectCard
                    project={project as any}
                    onProjectClick={handleProjectClick}
                  />
                </motion.div>
              ))}
            </motion.div>
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
