"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Code2, Award, Github, Linkedin, Mail, CheckCircle, Sparkles, Target, Rocket } from "lucide-react";
import { FaWhatsapp, FaBullseye, FaRobot, FaRocket, FaWheelchair, FaWrench, FaMobile } from "react-icons/fa";

const About = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [profile, setProfile] = useState({
    aboutTitle: "Full-Stack Developer",
    storyParagraphs: [
      "Hi! I'm Chamodya Hirusha, a passionate Full-Stack and Mobile App Developer based in Sri Lanka. I specialize in building modern, scalable applications that solve real-world problems.",
      "With expertise spanning across React, Node.js, React Native, and AI/ML technologies, I bring ideas to life through clean code and thoughtful design. My approach focuses on creating seamless user experiences while maintaining high performance and code quality.",
      "I believe in continuous learning and staying ahead of the curve. Whether it's implementing AI features, optimizing database queries, or crafting pixel-perfect UIs, I'm committed to delivering excellence in every project."
    ],
    experienceYears: 1,
    projectsCount: 10,
    clientsCount: 5,
    cvUrl: "",
    githubUrl: "https://github.com/chamodya-hirusha",
    linkedinUrl: "https://linkedin.com/in/hirusha218",
    whatsappUrl: "https://wa.me/94701529611",
    email: "chamodyahirusha21@gmail.com"
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          setProfile({
            aboutTitle: data.aboutTitle || "Full-Stack Developer",
            storyParagraphs: Array.isArray(data.storyParagraphs) && data.storyParagraphs.length > 0
              ? data.storyParagraphs
              : [
                  "Hi! I'm Chamodya Hirusha, a passionate Full-Stack and Mobile App Developer based in Sri Lanka. I specialize in building modern, scalable applications that solve real-world problems.",
                  "With expertise spanning across React, Node.js, React Native, and AI/ML technologies, I bring ideas to life through clean code and thoughtful design. My approach focuses on creating seamless user experiences while maintaining high performance and code quality.",
                  "I believe in continuous learning and staying ahead of the curve. Whether it's implementing AI features, optimizing database queries, or crafting pixel-perfect UIs, I'm committed to delivering excellence in every project."
                ],
            experienceYears: typeof data.experienceYears !== "undefined" ? Number(data.experienceYears) : 1,
            projectsCount: typeof data.projectsCount !== "undefined" ? Number(data.projectsCount) : 10,
            clientsCount: typeof data.clientsCount !== "undefined" ? Number(data.clientsCount) : 5,
            cvUrl: data.cvUrl || "",
            githubUrl: data.githubUrl || "https://github.com/chamodya-hirusha",
            linkedinUrl: data.linkedinUrl || "https://linkedin.com/in/hirusha218",
            whatsappUrl: data.whatsappUrl || "https://wa.me/94701529611",
            email: data.email || "chamodyahirusha21@gmail.com"
          });
        }
      } catch (err) {
        console.error("Error loading profile details in About section:", err);
      }
    };
    fetchProfile();
  }, []);

  const renderParagraph = (text: string) => {
    const parts = text.split(/(Chamodya Hirusha|React, Node\.js, React Native,|AI\/ML technologies)/g);
    return (
      <p key={text}>
        {parts.map((part, i) => {
          if (part === "Chamodya Hirusha") {
            return <span key={i} className="text-foreground font-semibold">{part}</span>;
          } else if (part === "React, Node.js, React Native,") {
            return <span key={i} className="text-primary font-medium">{part}</span>;
          } else if (part === "AI/ML technologies") {
            return <span key={i} className="text-accent font-medium">{part}</span>;
          }
          return part;
        })}
      </p>
    );
  };

  const highlights = [
    {
      icon: Rocket,
      title: "Full-Stack Development",
      description: "End-to-end web and mobile solutions with modern frameworks",
    },
    {
      icon: Sparkles,
      title: "AI/ML Integration",
      description: "Smart features powered by cutting-edge AI technologies",
    },
    {
      icon: Target,
      title: "User-Centric Design",
      description: "Intuitive interfaces that users love to interact with",
    },
  ];

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/5 to-background" />
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      
      <div className="container px-4 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-4xl md:text-6xl font-bold mb-4">
                <span className="gradient-text">About Me</span>
              </h2>
            </motion.div>
            <div className="w-24 h-1 bg-gradient-to-r from-primary via-accent to-secondary mx-auto mt-6 rounded-full" />
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
            {/* Profile Card - Spans 1 column */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="lg:col-span-1"
            >
              <Card className="glass-card p-6 h-full border-2 border-primary/20 hover:border-primary/40 transition-all duration-300">
                <div className="relative group mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                  <div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-border/50">
                    <img
                      src="/chamodya-hirusha.jpg?v=2"
                      alt="Hirusha profile"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold mb-2 text-center">Chamodya Hirusha</h3>
                <p className="text-center text-muted-foreground mb-4">{profile.aboutTitle}</p>
                <div className="flex items-center justify-center gap-2 mb-6">
                  <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs">
                    🇱🇰 Sri Lanka
                  </span>
                  <span className="px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs">
                    Available
                  </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-6">
                  <div className="text-center p-3 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                    <Briefcase className="h-5 w-5 mx-auto mb-1 text-primary" />
                    <div className="text-xl font-bold">{profile.experienceYears}+</div>
                    <div className="text-xs text-muted-foreground">Years</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
                    <Code2 className="h-5 w-5 mx-auto mb-1 text-accent" />
                    <div className="text-xl font-bold">{profile.projectsCount}+</div>
                    <div className="text-xs text-muted-foreground">Projects</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20">
                    <Award className="h-5 w-5 mx-auto mb-1 text-secondary" />
                    <div className="text-xl font-bold">{profile.clientsCount > 0 ? `${profile.clientsCount}+` : "100%"}</div>
                    <div className="text-xs text-muted-foreground">{profile.clientsCount > 0 ? "Clients" : "Quality"}</div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex flex-col gap-2">
                  {profile.githubUrl && (
                    <Button size="sm" className="w-full glass-card glow-border" asChild>
                      <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4 mr-2" /> GitHub
                      </a>
                    </Button>
                  )}
                  {profile.linkedinUrl && (
                    <Button size="sm" variant="outline" className="w-full glass-card border-primary/50 hover:border-primary" asChild>
                      <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="h-4 w-4 mr-2" /> LinkedIn
                      </a>
                    </Button>
                  )}
                  {profile.whatsappUrl && (
                    <Button size="sm" variant="outline" className="w-full glass-card border-green-500/50 hover:border-green-500" asChild>
                      <a href={profile.whatsappUrl} target="_blank" rel="noopener noreferrer">
                        <FaWhatsapp className="h-4 w-4 mr-2" /> WhatsApp
                      </a>
                    </Button>
                  )}
                  {profile.email && (
                    <Button size="sm" variant="ghost" className="w-full glass-card" asChild>
                      <a href={profile.email.startsWith("mailto:") ? profile.email : `mailto:${profile.email}`}>
                        <Mail className="h-4 w-4 mr-2" /> Email
                      </a>
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>

            {/* Bio & Highlights - Spans 2 columns */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Bio */}
              <Card className="glass-card p-8 border-2 border-border/50 hover:border-primary/30 transition-all duration-300">
                <h3 className="text-3xl font-bold mb-4 flex items-center gap-3">
                  <span className="h-1 w-12 bg-gradient-to-r from-primary to-accent rounded-full" />
                  My Story
                </h3>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  {profile.storyParagraphs.map((para) => renderParagraph(para))}
                </div>

                {/* Key Points */}
                <div className="grid sm:grid-cols-2 gap-4 mt-8">
                  {[
                    { icon: FaBullseye, text: "Full-stack web & mobile development" },
                    { icon: FaRobot, text: "AI/ML integration & automation" },
                    { icon: FaRocket, text: "Performance optimization expert" },
                    { icon: FaWheelchair, text: "Accessibility-first approach" },
                    { icon: FaWrench, text: "Clean, maintainable code" },
                    { icon: FaMobile, text: "Cross-platform solutions" },
                  ].map((point, idx) => {
                    const Icon = point.icon;
                    return (
                      <motion.div
                        key={point.text}
                        initial={{ opacity: 0, x: -20 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.7 + idx * 0.1 }}
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all"
                      >
                        <Icon className="h-5 w-5 text-primary shrink-0" />
                        <span className="text-sm font-medium">{point.text}</span>
                      </motion.div>
                    );
                  })}
                </div>
              </Card>

              {/* Highlights */}
              <div className="grid md:grid-cols-3 gap-4">
                {highlights.map((highlight, idx) => {
                  const Icon = highlight.icon;
                  return (
                    <motion.div
                      key={highlight.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.9 + idx * 0.1 }}
                    >
                      <Card className="glass-card p-6 h-full hover:-translate-y-1 transition-all duration-300 group border-2 border-border/50 hover:border-primary/30">
                        <div className="mb-4">
                          <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 group-hover:from-primary/30 group-hover:to-accent/30 transition-all">
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                        </div>
                        <h4 className="font-bold mb-2 text-lg">{highlight.title}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {highlight.description}
                        </p>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
