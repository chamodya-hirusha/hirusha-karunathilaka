"use client";

import React from "react";
import Link from "next/link";
import {
  Github,
  ExternalLink,
  Smartphone,
  Globe,
  FolderGit2,
  ArrowRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface ProjectDescription {
  desc: string[];
  features: string[];
  footer?: string;
}

export interface ProjectType {
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
  category?: string;
}

interface ProjectCardProps {
  project: ProjectType;
  onProjectClick?: (projectId?: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onProjectClick,
}) => {
  const title = project.title;
  const shortDescription = project.short_description;
  const techList = project.tech || [];
  const githubUrl = project.github_url || "";
  const demoUrl = project.demo_url || "";
  const playstoreUrl = project.playstore_url || "";
  const sortKey = project.sort_key || "web";

  const hasDemo = demoUrl && demoUrl !== "#";
  const hasPlaystore = playstoreUrl && playstoreUrl !== "#";
  const hasGithub = githubUrl && githubUrl !== "#" && githubUrl.trim() !== "";

  // Extract the first image if available
  const imageUrl = project.imageUrls && project.imageUrls.length > 0 ? project.imageUrls[0] : null;

  const handleRegisterClick = () => {
    if (onProjectClick) {
      onProjectClick(project._id);
    }
  };

  return (
    <Card className="glass-card p-6 h-full flex flex-col hover:border-primary/30 transition-all duration-300 bg-[#07080c]/60 group relative overflow-hidden">
      {/* Thumbnail Area */}
      {imageUrl ? (
        <div className="aspect-video rounded-lg mb-5 relative overflow-hidden bg-[#0d0e12] border border-neutral-800/40 group-hover:border-primary/20 transition-all duration-500">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={title}
            className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07080c] via-transparent to-transparent opacity-60" />
          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/60 border border-neutral-800/40 text-[8px] font-mono tracking-wider uppercase text-neutral-400 flex items-center gap-1">
            {sortKey === "mobile" ? (
              <Smartphone className="h-2.5 w-2.5 text-cyan-400" />
            ) : sortKey === "web" ? (
              <Globe className="h-2.5 w-2.5 text-purple-400" />
            ) : (
              <FolderGit2 className="h-2.5 w-2.5 text-neutral-400" />
            )}
            {sortKey}
          </div>
        </div>
      ) : (
        /* Luxury Minimalist Graphic Placeholder / Dark Glassmorphic Skeleton Frame */
        <div className="aspect-video rounded-lg mb-5 flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#0d0e12] via-[#090a0f] to-[#131520] border border-neutral-800/40 group-hover:border-cyan-500/20 transition-all duration-500 shadow-inner">
          {/* Ambient glassmorphic glowing particles */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-cyan-500/5 blur-2xl group-hover:bg-cyan-500/10 transition-colors duration-500" />
          <div className="absolute bottom-1/4 left-1/4 w-24 h-24 rounded-full bg-purple-500/5 blur-2xl group-hover:bg-purple-500/10 transition-colors duration-500" />
          
          {/* Geometric Grid Overlay */}
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]" />
          
          <div className="relative z-10 p-4 bg-[#111318]/40 backdrop-blur-md rounded-2xl border border-white/5 shadow-2xl group-hover:scale-110 group-hover:border-cyan-500/10 transition-all duration-500">
            {sortKey === "mobile" ? (
              <Smartphone className="h-7 w-7 text-cyan-400/80 drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]" />
            ) : sortKey === "web" ? (
              <Globe className="h-7 w-7 text-purple-400/80 drop-shadow-[0_0_8px_rgba(192,132,252,0.3)]" />
            ) : (
              <FolderGit2 className="h-7 w-7 text-neutral-400/80" />
            )}
          </div>
          <span className="relative z-10 text-[9px] uppercase tracking-[0.2em] font-mono text-neutral-500 group-hover:text-neutral-400 transition-colors duration-500 font-semibold mt-3">
            {sortKey} architecture
          </span>
        </div>
      )}

      {/* Project Info */}
      <h3 className="text-xl font-bold mb-2 glow-text">{title}</h3>
      <p className="text-muted-foreground text-sm mb-4 flex-grow line-clamp-3 leading-relaxed">
        {shortDescription}
      </p>

      {/* Tech Badges */}
      <div className="flex flex-wrap gap-1.5 mb-6">
        {techList.map((t) => (
          <span
            key={t}
            className="px-2 py-0.5 text-[10px] rounded border border-border/60 bg-muted/30 text-muted-foreground/90 font-medium"
          >
            {t}
          </span>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2.5 mt-auto">
        <Button
          className="w-full group flex items-center justify-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 px-6 py-2.5 text-xs font-medium tracking-widest text-zinc-400 uppercase backdrop-blur-sm transition-all duration-300 hover:border-zinc-600 hover:text-white hover:shadow-[0_0_15px_rgba(255,255,255,0.05)] h-auto"
          asChild
        >
          <Link href={`/projects/${project._id}`} onClick={handleRegisterClick}>
            View Details
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </Button>

        {/* Secondary Buttons Row */}
        {(hasGithub || hasDemo || hasPlaystore) && (
          <div className="flex gap-2 w-full">
            {hasGithub && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1 border-neutral-800/80 hover:border-neutral-700 bg-[#0d0e12]/60 text-neutral-400 hover:text-neutral-200 text-xs h-9 transition-colors"
                asChild
              >
                <a href={githubUrl} target="_blank" rel="noopener noreferrer" onClick={handleRegisterClick}>
                  <Github className="h-3.5 w-3.5 mr-1.5" />
                  Code
                </a>
              </Button>
            )}
            
            {hasDemo && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1 border-neutral-800/80 hover:border-neutral-700 bg-[#0d0e12]/60 text-neutral-400 hover:text-neutral-200 text-xs h-9 transition-colors"
                asChild
              >
                <a href={demoUrl} target="_blank" rel="noopener noreferrer" onClick={handleRegisterClick}>
                  <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                  Demo
                </a>
              </Button>
            )}

            {hasPlaystore && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1 border-neutral-800/80 hover:border-neutral-700 bg-[#0d0e12]/60 text-neutral-400 hover:text-neutral-200 text-xs h-9 transition-colors"
                asChild
              >
                <a href={playstoreUrl} target="_blank" rel="noopener noreferrer" onClick={handleRegisterClick}>
                  <Smartphone className="h-3.5 w-3.5 mr-1.5" />
                  App
                </a>
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};
