"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  LogOut,
  FolderGit2,
  ExternalLink,
  Loader2,
  BarChart3,
  Copy,
  Clipboard,
  Star,
  Globe,
  Smartphone,
  User,
  Share2,
  FileText,
  Save,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ProjectDescription {
  desc: string[];
  features: string[];
  footer?: string;
}

interface ProjectData {
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
  views: number;
  createdAt: string;
  imageUrls?: string[];
  category?: string;
}

export default function AdminDashboard() {
  const router = useRouter();

  // Active Tab state
  const [activeTab, setActiveTab] = useState<"projects" | "profile" | "socials">("projects");

  // Projects states
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Project Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectData | null>(null);
  const [showPasteArea, setShowPasteArea] = useState(false);
  const [pasteText, setPasteText] = useState("");

  // Project Form input states
  const [formData, setFormData] = useState({
    title: "",
    short_description: "",
    desc: "", // maps to description.desc (split by newline)
    features: "", // maps to description.features (split by comma/newline)
    footer: "", // maps to description.footer
    tech: "", // maps to tech array (split by comma)
    demo_url: "",
    playstore_url: "",
    github_url: "",
    sort_key: "web",
    sort_order: "0",
    is_featured: false,
    imageUrls: [] as string[],
    category: "",
  });

  // Profile & Socials states
  const [profileData, setProfileData] = useState({
    aboutTitle: "",
    storyParagraphs: [] as string[],
    experienceYears: 1,
    projectsCount: 15,
    clientsCount: 5,
    cvUrl: "",
    githubUrl: "",
    linkedinUrl: "",
    whatsappUrl: "",
    email: "",
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSubmitting, setProfileSubmitting] = useState(false);

  // Fetch data on mount
  useEffect(() => {
    fetchProjects();
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Retrieve projects from the API
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      } else if (res.status === 401) {
        toast.error("Session expired. Please log in again.");
        router.push("/admin/login");
      } else {
        toast.error("Failed to load project database");
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
      toast.error("Failed to connect to the database");
    } finally {
      setLoading(false);
    }
  };

  // Retrieve profile details from the API
  const fetchProfile = async () => {
    setProfileLoading(true);
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        setProfileData({
          aboutTitle: data.aboutTitle || "",
          storyParagraphs: data.storyParagraphs || [],
          experienceYears: data.experienceYears || 0,
          projectsCount: data.projectsCount || 0,
          clientsCount: data.clientsCount || 0,
          cvUrl: data.cvUrl || "",
          githubUrl: data.githubUrl || "",
          linkedinUrl: data.linkedinUrl || "",
          whatsappUrl: data.whatsappUrl || "",
          email: data.email || "",
        });
      } else if (res.status === 401) {
        router.push("/admin/login");
      } else {
        toast.error("Failed to load profile parameters");
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      toast.error("Failed to connect to profile server");
    } finally {
      setProfileLoading(false);
    }
  };

  // Trigger Logout API and redirect to login page
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (res.ok) {
        toast.success("Logged out successfully");
        router.push("/admin/login");
        router.refresh();
      } else {
        toast.error("Logout request failed");
      }
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Failed to contact logout server");
    }
  };

  // Open Dialog for creating new project
  const handleCreateOpen = () => {
    setEditingProject(null);
    setShowPasteArea(false);
    setPasteText("");
    setFormData({
      title: "",
      short_description: "",
      desc: "",
      features: "",
      footer: "",
      tech: "",
      demo_url: "",
      playstore_url: "",
      github_url: "",
      sort_key: "web",
      sort_order: "0",
      is_featured: false,
      imageUrls: [],
      category: "",
    });
    setModalOpen(true);
  };

  // Open Dialog for editing an existing project
  const handleEditOpen = (project: ProjectData) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      short_description: project.short_description || "",
      desc: Array.isArray(project.description?.desc) ? project.description.desc.join("\n") : "",
      features: Array.isArray(project.description?.features) ? project.description.features.join("\n") : "",
      footer: project.description?.footer || "",
      tech: Array.isArray(project.tech) ? project.tech.join(", ") : "",
      demo_url: project.demo_url || "",
      playstore_url: project.playstore_url || "",
      github_url: project.github_url || "",
      sort_key: project.sort_key || "web",
      sort_order: String(project.sort_order || 0),
      is_featured: !!project.is_featured,
      imageUrls: Array.isArray(project.imageUrls) ? project.imageUrls : [],
      category: project.category || "",
    });
    setModalOpen(true);
  };

  // Open Dialog for duplicating/copying an existing project as a template for a new one
  const handleDuplicate = (project: ProjectData) => {
    setEditingProject(null); // This is a new project, not an edit of the existing one
    setShowPasteArea(false);
    setPasteText("");
    setFormData({
      title: `${project.title} (Copy)`,
      short_description: project.short_description || "",
      desc: Array.isArray(project.description?.desc) ? project.description.desc.join("\n") : "",
      features: Array.isArray(project.description?.features) ? project.description.features.join("\n") : "",
      footer: project.description?.footer || "",
      tech: Array.isArray(project.tech) ? project.tech.join(", ") : "",
      demo_url: project.demo_url || "",
      playstore_url: project.playstore_url || "",
      github_url: project.github_url || "",
      sort_key: project.sort_key || "web",
      sort_order: String(project.sort_order || 0),
      is_featured: !!project.is_featured,
      imageUrls: Array.isArray(project.imageUrls) ? project.imageUrls : [],
      category: project.category || "",
    });
    setModalOpen(true);
    toast.info("Project details copied. Modify and save to create a duplicate.");
  };

  // Parse and apply pasted JSON project details into form inputs
  const handleApplyPaste = () => {
    if (!pasteText.trim()) {
      toast.error("Please paste JSON text first");
      return;
    }

    try {
      const data = JSON.parse(pasteText);
      
      setFormData({
        title: data.title || "",
        short_description: data.short_description || "",
        desc: Array.isArray(data.description?.desc)
          ? data.description.desc.join("\n")
          : typeof data.description?.desc === "string"
          ? data.description.desc
          : "",
        features: Array.isArray(data.description?.features)
          ? data.description.features.join("\n")
          : typeof data.description?.features === "string"
          ? data.description.features
          : "",
        footer: data.description?.footer || "",
        tech: Array.isArray(data.tech)
          ? data.tech.join(", ")
          : typeof data.tech === "string"
          ? data.tech
          : "",
        demo_url: data.demo_url || "",
        playstore_url: data.playstore_url || "",
        github_url: data.github_url || "",
        sort_key: data.sort_key || "web",
        sort_order: typeof data.sort_order !== "undefined" ? String(data.sort_order) : "0",
        is_featured: typeof data.is_featured === "boolean" ? data.is_featured : false,
        imageUrls: Array.isArray(data.imageUrls) ? data.imageUrls : [],
        category: data.category || "",
      });

      setShowPasteArea(false);
      setPasteText("");
      toast.success("Project details pasted and applied successfully");
    } catch (err) {
      console.error("JSON parse error:", err);
      toast.error("Invalid JSON format. Please verify the structure.");
    }
  };

  const [uploadingImages, setUploadingImages] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const data = new FormData();
        data.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: data,
        });

        if (res.ok) {
          const result = await res.json();
          if (result.url) {
            uploadedUrls.push(result.url);
          }
        } else {
          toast.error(`Failed to upload ${file.name}`);
        }
      }

      if (uploadedUrls.length > 0) {
        setFormData((prev) => ({
          ...prev,
          imageUrls: [...prev.imageUrls, ...uploadedUrls],
        }));
        toast.success(`Successfully uploaded ${uploadedUrls.length} image(s)`);
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("An error occurred during file upload.");
    } finally {
      setUploadingImages(false);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  // Handle input values changing for project forms
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target;
    const name = target.name;
    
    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: target.checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: target.value }));
    }
  };

  // Handle profile input changes
  const handleProfileInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle biography story changes (split by double newline for paragraph arrays)
  const handleProfileStoryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setProfileData((prev) => ({
      ...prev,
      storyParagraphs: text.split("\n\n").map((p) => p.trim()).filter((p) => p.length > 0),
    }));
  };

  // Handle Project Form Submission (Create or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.short_description.trim()) {
      toast.error("Title and short description are required");
      return;
    }

    setSubmitting(true);

    // Parse tech stack list into an array
    const techArray = formData.tech
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    // Parse nested descriptions (split by newline)
    const descArray = formData.desc
      .split("\n")
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    // Parse features list (split by comma or newline)
    const featuresArray = formData.features
      .split(/[,\n]/)
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    const payload = {
      title: formData.title.trim(),
      short_description: formData.short_description.trim(),
      description: {
        desc: descArray,
        features: featuresArray,
        footer: formData.footer.trim(),
      },
      tech: techArray,
      demo_url: formData.demo_url.trim(),
      playstore_url: formData.playstore_url.trim(),
      github_url: formData.github_url.trim(),
      sort_key: formData.sort_key,
      sort_order: Number(formData.sort_order) || 0,
      is_featured: formData.is_featured,
      imageUrls: formData.imageUrls,
      category: formData.category,
    };

    try {
      const url = editingProject ? `/api/projects/${editingProject._id}` : "/api/projects";
      const method = editingProject ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(editingProject ? "Project updated successfully" : "New project added successfully");
        setModalOpen(false);
        fetchProjects();
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || "Request failed. Verify details and try again.");
      }
    } catch (err) {
      console.error("Save project error:", err);
      toast.error("An error occurred during save processing.");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Project Deletion
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this project? This action is irreversible.")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Project deleted successfully");
        fetchProjects();
      } else {
        toast.error("Deletion request failed");
      }
    } catch (err) {
      console.error("Delete project error:", err);
      toast.error("Failed to connect to deletion endpoint");
    } finally {
      setDeletingId(null);
    }
  };

  // Handle Profile Update Submission
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSubmitting(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      if (res.ok) {
        toast.success("Profile parameters updated successfully");
        const updated = await res.json();
        setProfileData(updated);
      } else {
        toast.error("Failed to update profile parameters");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("An error occurred during profile update");
    } finally {
      setProfileSubmitting(false);
    }
  };

  // Statistics summaries
  const totalProjects = projects.length;
  const totalViews = projects.reduce((sum, p) => sum + (p.views || 0), 0);

  return (
    <div className="flex h-screen bg-[#07080c] overflow-hidden text-neutral-100 font-sans">
      
      {/* 1. Sidebar Navigation - Luxury Dark Glassmorphic Design */}
      <aside className="w-64 border-r border-neutral-850 bg-zinc-950/50 backdrop-blur-md flex flex-col justify-between h-full z-20 shrink-0 shadow-xl">
        <div className="p-6">
          {/* Brand/CMS Identity */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 bg-cyan-950/30 border border-cyan-850/40 rounded-xl">
              <FolderGit2 className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="font-bold text-xs text-neutral-150 tracking-wider uppercase">CMS Panel</h2>
              <span className="text-[9px] text-neutral-500 font-semibold uppercase tracking-widest block">Dashboard CMS</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab("projects")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                activeTab === "projects"
                  ? "bg-cyan-950/30 border border-cyan-800/40 text-cyan-400 shadow-md"
                  : "border border-transparent text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/30"
              }`}
            >
              <FolderGit2 className="h-4 w-4" />
              Projects
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                activeTab === "profile"
                  ? "bg-cyan-950/30 border border-cyan-800/40 text-cyan-400 shadow-md"
                  : "border border-transparent text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/30"
              }`}
            >
              <User className="h-4 w-4" />
              Profile Info
            </button>

            <button
              onClick={() => setActiveTab("socials")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                activeTab === "socials"
                  ? "bg-cyan-950/30 border border-cyan-800/40 text-cyan-400 shadow-md"
                  : "border border-transparent text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/30"
              }`}
            >
              <Share2 className="h-4 w-4" />
              Links & Socials
            </button>
          </nav>
        </div>

        {/* Sidebar Footer Logout button */}
        <div className="p-6 border-t border-neutral-900/80 bg-neutral-950/15">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start text-xs font-semibold uppercase tracking-wider text-red-400 hover:text-red-300 hover:bg-red-950/15 p-3 h-11 border border-transparent hover:border-red-900/30 rounded-lg flex items-center gap-3 transition-all"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* 2. Layout Structure - Smooth Scrolling Right Side Canvas */}
      <main className="flex-1 h-screen overflow-y-auto bg-[#090a0f] relative flex flex-col">
        {/* Visual ambient lighting glows */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-cyan-500/5 blur-[160px] pointer-events-none" />
        <div className="absolute bottom-10 left-1/4 w-[400px] h-[400px] rounded-full bg-purple-500/5 blur-[160px] pointer-events-none" />
        
        {/* Dynamic Canvas Header */}
        <header className="border-b border-neutral-900/80 px-8 py-6 bg-[#090a0f]/40 backdrop-blur-sm flex items-center justify-between sticky top-0 z-10">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-neutral-500">Workspace Dashboard</span>
            <h1 className="text-xl font-extrabold text-white tracking-tight capitalize">
              {activeTab === "projects"
                ? "Active Projects Catalogue"
                : activeTab === "profile"
                ? "Configure Profile parameters"
                : "Manage Social Endpoints"}
            </h1>
          </div>
          
          {activeTab === "projects" && (
            <Button
              onClick={handleCreateOpen}
              className="bg-cyan-655 hover:bg-cyan-500 bg-cyan-600 text-neutral-950 text-xs font-bold uppercase tracking-wider flex items-center gap-2 h-10 px-5 transition-all rounded-lg shadow-md hover:shadow-cyan-500/10"
            >
              <Plus className="h-4 w-4" />
              Add Project
            </Button>
          )}
        </header>

        {/* Smooth Scrolling Content Canvas */}
        <div className="flex-1 p-8 relative z-10 max-w-7xl w-full mx-auto space-y-8">
          
          {/* TAB 1: PROJECTS LIST MANAGEMENT */}
          {activeTab === "projects" && (
            <>
              {/* Projects Statistics Section */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="glass-card border-border/40 shadow-md bg-[#07080c]/60">
                  <CardContent className="pt-6 flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Total Published Projects
                      </p>
                      <h3 className="text-4xl font-bold tracking-tight glow-text text-primary">
                        {totalProjects}
                      </h3>
                    </div>
                    <div className="p-3 bg-primary/10 rounded-xl border border-primary/20">
                      <FolderGit2 className="h-6 w-6 text-primary" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card border-border/40 shadow-md bg-[#07080c]/60">
                  <CardContent className="pt-6 flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Total Project Clicks
                      </p>
                      <h3 className="text-4xl font-bold tracking-tight glow-text text-secondary">
                        {totalViews}
                      </h3>
                    </div>
                    <div className="p-3 bg-secondary/10 rounded-xl border border-secondary/20">
                      <BarChart3 className="h-6 w-6 text-secondary" />
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Projects List Table */}
              <section className="glass-card border-border/40 rounded-xl overflow-hidden shadow-lg bg-[#07080c]/60">
                <div className="p-6 border-b border-border/40 flex items-center justify-between">
                  <h2 className="text-md font-bold uppercase tracking-wider text-neutral-200">Active Catalogued Projects</h2>
                  {loading && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow className="hover:bg-transparent border-border/40">
                        <TableHead className="w-[80px] text-center">Category</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead className="text-center w-[90px]">Order</TableHead>
                        <TableHead className="text-center w-[120px]">Featured</TableHead>
                        <TableHead className="hidden md:table-cell">Tech Stack</TableHead>
                        <TableHead className="text-center w-[120px]">Views</TableHead>
                        <TableHead className="text-right w-[150px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {projects.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-12 text-muted-foreground text-sm">
                            {loading ? (
                              <span className="flex items-center justify-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                Loading project data...
                              </span>
                            ) : (
                              "No projects found in the repository. Click Add Project to get started."
                            )}
                          </TableCell>
                        </TableRow>
                      ) : (
                        projects.map((project) => (
                          <TableRow key={project._id} className="hover:bg-muted/20 border-border/30">
                            <TableCell className="align-middle text-center">
                              <div className="w-12 h-12 rounded-lg border border-neutral-800/80 bg-neutral-950 overflow-hidden flex items-center justify-center text-xs mx-auto shadow-inner">
                                {project.imageUrls && project.imageUrls.length > 0 ? (
                                  /* eslint-disable-next-line @next/next/no-img-element */
                                  <img
                                    src={project.imageUrls[0]}
                                    alt={project.title}
                                    className="object-cover w-full h-full"
                                  />
                                ) : (
                                  project.sort_key === "mobile" ? (
                                    <Smartphone className="h-5 w-5 text-cyan-400" />
                                  ) : project.sort_key === "web" ? (
                                    <Globe className="h-5 w-5 text-purple-400" />
                                  ) : (
                                    <FolderGit2 className="h-5 w-5 text-neutral-400" />
                                  )
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="align-middle font-medium max-w-[200px] truncate">
                              <div>
                                <p className="font-bold text-foreground text-sm">{project.title}</p>
                                <p className="text-xs text-muted-foreground max-w-[250px] truncate hidden sm:block">
                                  {project.short_description}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="align-middle text-center font-semibold text-muted-foreground text-sm font-mono">
                              {project.sort_order ?? 0}
                            </TableCell>
                            <TableCell className="align-middle text-center">
                              {project.is_featured ? (
                                <span className="inline-flex items-center text-cyan-400 font-semibold text-xs justify-center mx-auto">
                                  <Star className="h-4 w-4 fill-cyan-400 mr-1" />
                                  Featured
                                </span>
                              ) : (
                                <span className="text-neutral-600 text-xs font-mono">-</span>
                              )}
                            </TableCell>
                            <TableCell className="align-middle hidden md:table-cell">
                              <div className="flex flex-wrap gap-1">
                                {(project.tech || []).map((t) => (
                                  <span
                                    key={t}
                                    className="px-2 py-0.5 text-[10px] rounded border border-border bg-muted/50 text-muted-foreground font-medium"
                                  >
                                    {t}
                                  </span>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell className="align-middle text-center">
                              <div className="inline-flex items-center gap-1 text-sm font-semibold">
                                <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                                <span>{project.views}</span>
                              </div>
                            </TableCell>
                            <TableCell className="align-middle text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleEditOpen(project)}
                                  className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent hover:border-border"
                                  title="Edit Project"
                                >
                                  <Edit className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleDuplicate(project)}
                                  className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent hover:border-border"
                                  title="Duplicate Project"
                                >
                                  <Copy className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleDelete(project._id)}
                                  className="h-8 w-8 text-destructive hover:bg-destructive/10 border border-transparent hover:border-destructive/25"
                                  disabled={deletingId === project._id}
                                  title="Delete Project"
                                >
                                  {deletingId === project._id ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  ) : (
                                    <Trash2 className="h-3.5 w-3.5" />
                                  )}
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </section>
            </>
          )}

          {/* TAB 2: PROFILE INFO MANAGEMENT */}
          {activeTab === "profile" && (
            <Card className="border-neutral-800/80 bg-[#07080c]/60 shadow-xl p-8 rounded-xl max-w-4xl">
              <CardHeader className="p-0 pb-6 border-b border-neutral-800/40 mb-6">
                <CardTitle className="text-md font-bold uppercase tracking-wider text-neutral-200">Personal Biography & Statistics</CardTitle>
                <CardDescription className="text-neutral-500 text-xs mt-1">Configure your public-facing titles, bio paragraphs, and accomplishments metrics.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {profileLoading ? (
                  <div className="flex flex-col items-center justify-center py-16 space-y-3">
                    <Loader2 className="h-6 w-6 animate-spin text-cyan-455 text-cyan-555 text-cyan-400" />
                    <span className="text-xs text-neutral-500">Loading profile data from MongoDB...</span>
                  </div>
                ) : (
                  <form onSubmit={handleProfileSubmit} className="space-y-6">
                    {/* Title */}
                    <div className="space-y-2">
                      <Label htmlFor="aboutTitle" className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400">
                        Professional Title *
                      </Label>
                      <Input
                        id="aboutTitle"
                        name="aboutTitle"
                        value={profileData.aboutTitle}
                        onChange={handleProfileInputChange}
                        placeholder="e.g., Full-Stack Software Engineer & App Architect"
                        className="bg-[#111318] border-neutral-800/60 text-neutral-150 placeholder:text-neutral-600 focus-visible:ring-offset-0 focus-visible:ring-cyan-500/20 focus-visible:border-cyan-500 focus-visible:ring-1 transition-all h-11"
                        required
                      />
                    </div>

                    {/* Biography text - joined by double newline */}
                    <div className="space-y-2">
                      <Label htmlFor="storyParagraphs" className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400">
                        Biography paragraphs (Separate Paragraphs with double Newline / blank line)
                      </Label>
                      <Textarea
                        id="storyParagraphs"
                        name="storyParagraphs"
                        value={profileData.storyParagraphs.join("\n\n")}
                        onChange={handleProfileStoryChange}
                        placeholder="Paragraph 1 describing your engineering background...&#10;&#10;Paragraph 2 describing your client approaches and specializations..."
                        className="bg-[#111318] border-neutral-800/60 text-neutral-150 placeholder:text-neutral-600 focus-visible:ring-offset-0 focus-visible:ring-cyan-500/20 focus-visible:border-cyan-500 focus-visible:ring-1 transition-all min-h-[200px] resize-y leading-relaxed"
                        required
                      />
                    </div>

                    {/* Stats metrics */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
                      <div className="space-y-2">
                        <Label htmlFor="experienceYears" className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400">
                          Years of Experience
                        </Label>
                        <Input
                          id="experienceYears"
                          name="experienceYears"
                          type="number"
                          value={profileData.experienceYears}
                          onChange={handleProfileInputChange}
                          className="bg-[#111318] border-neutral-800/60 text-neutral-150 focus-visible:ring-offset-0 focus-visible:ring-cyan-500/20 focus-visible:border-cyan-500 focus-visible:ring-1 transition-all h-11"
                          min="0"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="projectsCount" className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400">
                          Completed Projects
                        </Label>
                        <Input
                          id="projectsCount"
                          name="projectsCount"
                          type="number"
                          value={profileData.projectsCount}
                          onChange={handleProfileInputChange}
                          className="bg-[#111318] border-neutral-800/60 text-neutral-150 focus-visible:ring-offset-0 focus-visible:ring-cyan-500/20 focus-visible:border-cyan-500 focus-visible:ring-1 transition-all h-11"
                          min="0"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="clientsCount" className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400">
                          Happy Clients
                        </Label>
                        <Input
                          id="clientsCount"
                          name="clientsCount"
                          type="number"
                          value={profileData.clientsCount}
                          onChange={handleProfileInputChange}
                          className="bg-[#111318] border-neutral-800/60 text-neutral-150 focus-visible:ring-offset-0 focus-visible:ring-cyan-500/20 focus-visible:border-cyan-500 focus-visible:ring-1 transition-all h-11"
                          min="0"
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4 border-t border-neutral-850 flex justify-end">
                      <Button
                        type="submit"
                        disabled={profileSubmitting}
                        className="bg-cyan-600 hover:bg-cyan-500 text-neutral-950 text-xs font-bold uppercase tracking-wider flex items-center gap-2 h-11 px-6 rounded-lg transition-all shadow-md hover:shadow-cyan-500/10"
                      >
                        {profileSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4" />
                            Save Profile
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          )}

          {/* TAB 3: LINKS & SOCIALS MANAGEMENT */}
          {activeTab === "socials" && (
            <Card className="border-neutral-800/80 bg-[#07080c]/60 shadow-xl p-8 rounded-xl max-w-4xl">
              <CardHeader className="p-0 pb-6 border-b border-neutral-800/40 mb-6">
                <CardTitle className="text-md font-bold uppercase tracking-wider text-neutral-200">CV Link & Social Endpoints</CardTitle>
                <CardDescription className="text-neutral-500 text-xs mt-1">Configure external communication channels, CV download attachments, and social accounts.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {profileLoading ? (
                  <div className="flex flex-col items-center justify-center py-16 space-y-3">
                    <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
                    <span className="text-xs text-neutral-500">Loading social parameters...</span>
                  </div>
                ) : (
                  <form onSubmit={handleProfileSubmit} className="space-y-6">
                    {/* CV URL */}
                    <div className="space-y-2">
                      <Label htmlFor="cvUrl" className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400">
                        CV / Resume Document URL
                      </Label>
                      <Input
                        id="cvUrl"
                        name="cvUrl"
                        value={profileData.cvUrl}
                        onChange={handleProfileInputChange}
                        placeholder="e.g., https://drive.google.com/file/d/... or a Cloudinary document link"
                        className="bg-[#111318] border-neutral-800/60 text-neutral-150 placeholder:text-neutral-600 focus-visible:ring-offset-0 focus-visible:ring-cyan-500/20 focus-visible:border-cyan-500 focus-visible:ring-1 transition-all h-11"
                      />
                    </div>

                    {/* Social links row 1 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* GitHub */}
                      <div className="space-y-2">
                        <Label htmlFor="githubUrl" className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400">
                          GitHub Profile URL
                        </Label>
                        <Input
                          id="githubUrl"
                          name="githubUrl"
                          value={profileData.githubUrl}
                          onChange={handleProfileInputChange}
                          placeholder="https://github.com/username"
                          className="bg-[#111318] border-neutral-800/60 text-neutral-150 placeholder:text-neutral-600 focus-visible:ring-offset-0 focus-visible:ring-cyan-500/20 focus-visible:border-cyan-500 focus-visible:ring-1 transition-all h-11"
                        />
                      </div>

                      {/* LinkedIn */}
                      <div className="space-y-2">
                        <Label htmlFor="linkedinUrl" className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400">
                          LinkedIn Profile URL
                        </Label>
                        <Input
                          id="linkedinUrl"
                          name="linkedinUrl"
                          value={profileData.linkedinUrl}
                          onChange={handleProfileInputChange}
                          placeholder="https://linkedin.com/in/username"
                          className="bg-[#111318] border-neutral-800/60 text-neutral-150 placeholder:text-neutral-600 focus-visible:ring-offset-0 focus-visible:ring-cyan-500/20 focus-visible:border-cyan-500 focus-visible:ring-1 transition-all h-11"
                        />
                      </div>
                    </div>

                    {/* Social links row 2 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* WhatsApp */}
                      <div className="space-y-2">
                        <Label htmlFor="whatsappUrl" className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400">
                          WhatsApp API Link / Number
                        </Label>
                        <Input
                          id="whatsappUrl"
                          name="whatsappUrl"
                          value={profileData.whatsappUrl}
                          onChange={handleProfileInputChange}
                          placeholder="e.g., https://wa.me/94771234567"
                          className="bg-[#111318] border-neutral-800/60 text-neutral-150 placeholder:text-neutral-600 focus-visible:ring-offset-0 focus-visible:ring-cyan-500/20 focus-visible:border-cyan-500 focus-visible:ring-1 transition-all h-11"
                        />
                      </div>

                      {/* Email */}
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400">
                          Professional Email Address
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={profileData.email}
                          onChange={handleProfileInputChange}
                          placeholder="example@domain.com"
                          className="bg-[#111318] border-neutral-800/60 text-neutral-150 placeholder:text-neutral-600 focus-visible:ring-offset-0 focus-visible:ring-cyan-500/20 focus-visible:border-cyan-500 focus-visible:ring-1 transition-all h-11"
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4 border-t border-neutral-850 flex justify-end">
                      <Button
                        type="submit"
                        disabled={profileSubmitting}
                        className="bg-cyan-600 hover:bg-cyan-500 text-neutral-950 text-xs font-bold uppercase tracking-wider flex items-center gap-2 h-11 px-6 rounded-lg transition-all shadow-md hover:shadow-cyan-500/10"
                      >
                        {profileSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4" />
                            Save Socials
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          )}

        </div>
      </main>

      {/* Add / Edit Project Dialog Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="w-full max-w-2xl bg-[#090a0f] border border-neutral-800/80 text-foreground shadow-2xl p-8 rounded-xl">
          <DialogHeader className="pb-5 border-b border-neutral-800/40">
            <DialogTitle className="text-xl font-bold tracking-wide text-neutral-100">
              {editingProject ? "Modify Project" : "Create New Project"}
            </DialogTitle>
            <DialogDescription className="text-neutral-400 text-xs mt-1">
              {editingProject
                ? "Update the details and metadata of an existing portfolio project."
                : "Fill out the fields to publish a new project to your portfolio landing page."}
            </DialogDescription>
          </DialogHeader>

          {!editingProject && (
            <div className="py-3 border-b border-neutral-800/20">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase tracking-widest font-semibold text-neutral-500">JSON Import Option</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPasteArea(!showPasteArea)}
                  className="h-7 text-[10px] uppercase tracking-widest font-semibold text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/25 flex items-center gap-1.5 transition-all"
                >
                  <Clipboard className="h-3 w-3" />
                  {showPasteArea ? "Hide Quick Paste" : "Quick Paste JSON"}
                </Button>
              </div>
              {showPasteArea && (
                <div className="mt-3 space-y-2">
                  <Textarea
                    value={pasteText}
                    onChange={(e) => setPasteText(e.target.value)}
                    placeholder='{ "title": "My App", "short_description": "...", "description": { "desc": ["Paragraph 1"], "features": ["Feature 1"] }, "tech": ["React"] }'
                    className="font-mono text-xs bg-[#111318] border-neutral-800/60 text-neutral-100 placeholder:text-neutral-600 focus-visible:ring-offset-0 focus-visible:ring-cyan-500/20 focus-visible:border-cyan-500 focus-visible:ring-1 min-h-[90px]"
                  />
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={handleApplyPaste}
                      className="h-7 text-[10px] uppercase tracking-widest font-bold bg-cyan-950/40 text-cyan-400 border border-cyan-800/30 hover:bg-cyan-900/40 transition-all"
                    >
                      Apply Details
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 py-6 px-1.5 max-h-[65vh] overflow-y-auto no-scrollbar">
            {/* Title & Sort Order Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              <div className="md:col-span-3 space-y-2">
                <Label htmlFor="title" className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400">
                  Project Title *
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Braintisa Premium Portal"
                  className="bg-[#111318] border-neutral-800/60 text-neutral-100 placeholder:text-neutral-600 focus-visible:ring-offset-0 focus-visible:ring-cyan-500/20 focus-visible:border-cyan-500 focus-visible:ring-1 transition-all duration-200 h-10"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sort_order" className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400">
                  Sort Order
                </Label>
                <Input
                  id="sort_order"
                  name="sort_order"
                  type="number"
                  value={formData.sort_order}
                  onChange={handleInputChange}
                  placeholder="1"
                  className="bg-[#111318] border-neutral-800/60 text-neutral-100 placeholder:text-neutral-600 focus-visible:ring-offset-0 focus-visible:ring-cyan-500/20 focus-visible:border-cyan-500 focus-visible:ring-1 transition-all duration-200 h-10"
                  min="0"
                />
              </div>
            </div>

            {/* Short Description */}
            <div className="space-y-2">
              <Label htmlFor="short_description" className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400">
                Short Description *
              </Label>
              <Input
                id="short_description"
                name="short_description"
                value={formData.short_description}
                onChange={handleInputChange}
                placeholder="e.g., A state-of-the-art enterprise software web portal."
                className="bg-[#111318] border-neutral-800/60 text-neutral-100 placeholder:text-neutral-600 focus-visible:ring-offset-0 focus-visible:ring-cyan-500/20 focus-visible:border-cyan-500 focus-visible:ring-1 transition-all duration-200 h-10"
                required
              />
            </div>

            {/* Description Paragraphs */}
            <div className="space-y-2">
              <Label htmlFor="desc" className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400">
                Detailed Paragraphs (Separate with Newline)
              </Label>
              <Textarea
                id="desc"
                name="desc"
                value={formData.desc}
                onChange={handleInputChange}
                placeholder="First paragraph describing the core app purpose.&#10;Second paragraph explaining the technological stack or implementation."
                className="bg-[#111318] border-neutral-800/60 text-neutral-100 placeholder:text-neutral-600 focus-visible:ring-offset-0 focus-visible:ring-cyan-500/20 focus-visible:border-cyan-500 focus-visible:ring-1 transition-all duration-200 min-h-[120px] resize-y"
              />
            </div>

            {/* Key Features List */}
            <div className="space-y-2">
              <Label htmlFor="features" className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400">
                Key Features (Comma or Newline Separated)
              </Label>
              <Textarea
                id="features"
                name="features"
                value={formData.features}
                onChange={handleInputChange}
                placeholder="Feature 1: Real-time analytics dashboards, Feature 2: Multi-tenant database architecture&#10;Feature 3: Push notifications"
                className="bg-[#111318] border-neutral-800/60 text-neutral-100 placeholder:text-neutral-600 focus-visible:ring-offset-0 focus-visible:ring-cyan-500/20 focus-visible:border-cyan-500 focus-visible:ring-1 transition-all duration-200 min-h-[100px] resize-y"
              />
            </div>

            {/* Description Footer */}
            <div className="space-y-2">
              <Label htmlFor="footer" className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400">
                Description Footer Note
              </Label>
              <Input
                id="footer"
                name="footer"
                value={formData.footer}
                onChange={handleInputChange}
                placeholder="e.g., Developed for enterprise clients under active NDAs."
                className="bg-[#111318] border-neutral-800/60 text-neutral-100 placeholder:text-neutral-600 focus-visible:ring-offset-0 focus-visible:ring-cyan-500/20 focus-visible:border-cyan-500 focus-visible:ring-1 transition-all duration-200 h-10"
              />
            </div>

            {/* Tech Stack */}
            <div className="space-y-2">
              <Label htmlFor="tech" className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400">
                Technologies (Comma Separated)
              </Label>
              <Input
                id="tech"
                name="tech"
                value={formData.tech}
                onChange={handleInputChange}
                placeholder="e.g., Next.js, TypeScript, Tailwinds, MongoDB"
                className="bg-[#111318] border-neutral-800/60 text-neutral-100 placeholder:text-neutral-600 focus-visible:ring-offset-0 focus-visible:ring-cyan-500/20 focus-visible:border-cyan-500 focus-visible:ring-1 transition-all duration-200 h-10"
              />
            </div>

            {/* Multiple Image Upload Area */}
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400">
                Project Screenshots (Cloudinary Upload)
              </Label>
              
              {/* Upload Zone */}
              <div className="border border-dashed border-neutral-800/80 hover:border-cyan-500/40 rounded-lg p-6 bg-[#111318]/20 transition-all cursor-pointer relative flex flex-col items-center justify-center min-h-[100px] text-center group">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImages}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />
                {uploadingImages ? (
                  <div className="flex flex-col items-center space-y-2">
                    <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
                    <span className="text-xs text-neutral-400">Uploading screenshots to Cloudinary...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-2">
                    <Plus className="h-6 w-6 text-neutral-500 group-hover:text-cyan-400 transition-colors" />
                    <span className="text-xs text-neutral-400 group-hover:text-neutral-300 transition-colors">
                      Click or drag images here to upload multiple screenshots
                    </span>
                    <span className="text-[9px] text-neutral-600">Supports PNG, JPG, WEBP</span>
                  </div>
                )}
              </div>

              {/* Previews Grid */}
              {formData.imageUrls && formData.imageUrls.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                  {formData.imageUrls.map((url, index) => (
                    <div key={index} className="group relative aspect-video rounded border border-neutral-800 bg-[#111318] overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt={`Screenshot ${index + 1}`}
                        className="object-cover w-full h-full"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-destructive hover:text-red-400 transition-opacity duration-200"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* GitHub & Live Demo Links Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="github_url" className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400">
                  GitHub Link (github_url)
                </Label>
                <Input
                  id="github_url"
                  name="github_url"
                  value={formData.github_url}
                  onChange={handleInputChange}
                  placeholder="https://github.com/..."
                  className="bg-[#111318] border-neutral-800/60 text-neutral-100 placeholder:text-neutral-600 focus-visible:ring-offset-0 focus-visible:ring-cyan-500/20 focus-visible:border-cyan-500 focus-visible:ring-1 transition-all duration-200 h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="demo_url" className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400">
                  Live Demo Link (demo_url)
                </Label>
                <Input
                  id="demo_url"
                  name="demo_url"
                  value={formData.demo_url}
                  onChange={handleInputChange}
                  placeholder="https://..."
                  className="bg-[#111318] border-neutral-800/60 text-neutral-100 placeholder:text-neutral-600 focus-visible:ring-offset-0 focus-visible:ring-cyan-500/20 focus-visible:border-cyan-500 focus-visible:ring-1 transition-all duration-200 h-10"
                />
              </div>
            </div>

            {/* Play Store Link & Category Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="playstore_url" className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400">
                  Play Store Link (playstore_url)
                </Label>
                <Input
                  id="playstore_url"
                  name="playstore_url"
                  value={formData.playstore_url}
                  onChange={handleInputChange}
                  placeholder="https://play.google.com/store/apps/..."
                  className="bg-[#111318] border-neutral-800/60 text-neutral-100 placeholder:text-neutral-600 focus-visible:ring-offset-0 focus-visible:ring-cyan-500/20 focus-visible:border-cyan-500 focus-visible:ring-1 transition-all duration-200 h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sort_key" className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400">
                  Sort Key (Legacy)
                </Label>
                <select
                  id="sort_key"
                  name="sort_key"
                  value={formData.sort_key}
                  onChange={handleInputChange}
                  className="flex h-10 w-full rounded-md border border-neutral-800/60 bg-[#111318] text-neutral-100 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-500/20 focus-visible:border-cyan-500 transition-all duration-200"
                >
                  <option value="web">web</option>
                  <option value="mobile">mobile</option>
                  <option value="design">design</option>
                  <option value="other">other</option>
                </select>
              </div>

              {/* Category (Filter Tag) */}
              <div className="space-y-2">
                <Label htmlFor="category" className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400">
                  Category (Filter Tag)
                </Label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="flex h-10 w-full rounded-md border border-neutral-800/60 bg-[#111318] text-neutral-100 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-500/20 focus-visible:border-cyan-500 transition-all duration-200"
                >
                  <option value="">— Select Category —</option>
                  <option value="Web Site">Web Site</option>
                  <option value="Mobile App">Mobile App</option>
                  <option value="Demo Project">Demo Project</option>
                  <option value="POS System">POS System</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Featured Project Switch Area */}
            <div className="flex items-center justify-between bg-[#111318]/40 border border-neutral-800/40 p-4 rounded-lg">
              <div className="space-y-0.5 pr-4">
                <span className="text-xs font-semibold text-neutral-200">
                  Featured Project
                </span>
                <p className="text-[10px] text-neutral-500 leading-normal">
                  Spotlight this project at the top of your landing page featured projects list.
                </p>
              </div>
              {/* Premium Tailwind UI toggle switch */}
              <button
                type="button"
                id="is_featured_toggle"
                role="switch"
                aria-checked={formData.is_featured}
                onClick={() => setFormData((prev) => ({ ...prev, is_featured: !prev.is_featured }))}
                className={`${
                  formData.is_featured ? "bg-cyan-500" : "bg-neutral-800"
                } relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:ring-offset-0`}
              >
                <span
                  aria-hidden="true"
                  className={`${
                    formData.is_featured ? "translate-x-5" : "translate-x-0"
                  } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                />
              </button>
            </div>

            {/* Dialog Footer Actions */}
            <div className="pt-5 border-t border-neutral-800/40 flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setModalOpen(false)}
                className="border-neutral-800 hover:bg-neutral-900 text-neutral-400 hover:text-neutral-200 text-xs font-semibold uppercase tracking-wider h-10 px-5"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-cyan-600 hover:bg-cyan-500 text-neutral-950 text-xs font-bold uppercase tracking-wider flex items-center gap-2 h-10 px-6"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Project"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
