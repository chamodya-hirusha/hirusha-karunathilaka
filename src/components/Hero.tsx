"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FaWhatsapp } from "react-icons/fa";
import { Download, Mail, Github, Linkedin, Twitter } from "lucide-react";

const Hero = () => {
  const [profile, setProfile] = useState({
    cvUrl: "",
    githubUrl: "https://github.com/chamodya-hirusha",
    linkedinUrl: "https://www.linkedin.com/in/chamodya-hirusha-6a5961262?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    email: "chamodyahirusha21@gmail.com",
    aboutTitle: "Full-Stack Developer · Mobile App Developer"
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          setProfile({
            cvUrl: data.cvUrl || "",
            githubUrl: data.githubUrl || "https://github.com/chamodya-hirusha",
            linkedinUrl: data.linkedinUrl || "https://www.linkedin.com/in/chamodya-hirusha-6a5961262?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
            email: data.email || "chamodyahirusha21@gmail.com",
            aboutTitle: data.aboutTitle || "Full-Stack Developer · Mobile App Developer"
          });
        }
      } catch (err) {
        console.error("Error loading profile in Hero section:", err);
      }
    };
    fetchProfile();
  }, []);

  const handleCvDownload = () => {
    if (profile.cvUrl) {
      // If there is an external link in the database, open it directly
      window.open(profile.cvUrl, "_blank", "noopener,noreferrer");
    } else {
      // Fall back to the local static PDF
      const link = document.createElement("a");
      link.download = "Chamodya_Hirusha_CV.pdf";
      link.rel = "noopener";
      link.target = "_blank";
      link.href = "/chamodya_hirusha_se_cv.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-card">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_hsl(var(--primary)/0.1),transparent_50%)]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] animate-float" style={{ animationDelay: "3s" }} />
      </div>

      <div className="container relative z-10 px-4 py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto"
        >
          {/* Left: Intro */}
          <div className="text-center md:text-left">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-6"
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-4">
                <span className="gradient-text">Hirusha</span>
              </h1>
              <p className="text-2xl md:text-3xl text-muted-foreground mb-2">
                {profile.aboutTitle}
              </p>
              <p className="text-xl text-muted-foreground/80">
                AI/ML Enthusiast · Problem Solver · Always Learning
              </p>
            </motion.div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-6">
              <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm">React</span>
              <span className="px-3 py-1 rounded-full bg-secondary/10 border border-secondary/30 text-secondary text-sm">Node.js</span>
              <span className="px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-sm">AI/ML</span>
              <span className="px-3 py-1 rounded-full bg-muted/50 border border-border/50 text-foreground/80 text-sm">React Native</span>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl md:max-w-none mb-8 mx-auto md:mx-0"
            >
              Building AI-powered, scalable and delightful products across web and mobile.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 md:justify-start justify-center"
            >
              <Button size="lg" className="glass-card border-primary/50 hover:border-primary" variant="outline" onClick={handleCvDownload}>
                <Download className="mr-2 h-5 w-5" />
                Download CV
              </Button>
              {profile.githubUrl && (
                <Button size="lg" className="glass-card glow-border group" asChild>
                  <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                    GitHub Profile
                  </a>
                </Button>
              )}
              {profile.email && (
                <Button size="lg" variant="outline" className="glass-card border-primary/50 hover:border-primary" asChild>
                  <a href={profile.email.startsWith("mailto:") ? profile.email : `mailto:${profile.email}`}>
                    <Mail className="mr-2 h-5 w-5" />
                    Email Me
                  </a>
                </Button>
              )}

            </motion.div>

            {/* Social row */}
            <div className="flex items-center gap-4 mt-6 justify-center md:justify-start">
              {profile.githubUrl && (
                <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="glass-card p-2 rounded-lg border border-border/50 hover:border-primary/50 transition-colors">
                  <Github className="h-5 w-5" />
                </a>
              )}
              {profile.linkedinUrl && (
                <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="glass-card p-2 rounded-lg border border-border/50 hover:border-primary/50 transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
              )}
         
            </div>
          </div>

          {/* Right: Animated Tech Showcase */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="relative h-[400px] flex items-center justify-center"
          >
            {/* Orbiting Tech Icons */}
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Center Core */}
              <motion.div
                className="absolute z-10 glass-card rounded-full p-8 border-2 border-primary/30"
                animate={{
                  scale: [1, 1.05, 1],
                  boxShadow: [
                    "0 0 20px rgba(var(--primary), 0.2)",
                    "0 0 40px rgba(var(--primary), 0.4)",
                    "0 0 20px rgba(var(--primary), 0.2)",
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="text-4xl font-bold gradient-text">{'<\/>'}</div>
              </motion.div>

              {/* Orbit 1 - Inner Circle */}
              {[
                { icon: "⚛️", label: "React", delay: 0 },
                { icon: "📱", label: "React Native", delay: 1 },
                { icon: "🟢", label: "Node.js", delay: 2 },
                { icon: "⚡", label: "Vite", delay: 3 },
                { icon: "🤖", label: "AI/ML", delay: 4 },
              ].map((tech, i) => (
                <motion.div
                  key={`inner-${i}`}
                  className="absolute glass-card rounded-xl p-4 border border-primary/20 hover:border-primary/50 transition-colors group cursor-pointer"
                  style={{
                    width: "80px",
                    height: "80px",
                  }}
                  animate={{
                    x: [
                      Math.cos((i * Math.PI) / 2 + tech.delay) * 120,
                      Math.cos((i * Math.PI) / 2 + Math.PI * 2 + tech.delay) * 120,
                    ],
                    y: [
                      Math.sin((i * Math.PI) / 2 + tech.delay) * 120,
                      Math.sin((i * Math.PI) / 2 + Math.PI * 2 + tech.delay) * 120,
                    ],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <div className="flex flex-col items-center justify-center h-full">
                    <span className="text-2xl mb-1">{tech.icon}</span>
                    <span className="text-[10px] text-muted-foreground group-hover:text-foreground transition-colors">
                      {tech.label}
                    </span>
                  </div>
                </motion.div>
              ))}

              {/* Orbit 2 - Outer Circle */}
              {[
                { icon: "🎨", label: "UI/UX", delay: 0.5 },
                { icon: "🔥", label: "Firebase", delay: 1.5 },
                { icon: "💾", label: "Database", delay: 2.5 },
                { icon: "☁️", label: "Cloud", delay: 3.5 },
                { icon: "⚙️", label: "DevOps", delay: 4.5 },
              ].map((tech, i) => (
                <motion.div
                  key={`outer-${i}`}
                  className="absolute glass-card rounded-lg p-3 border border-accent/20 hover:border-accent/50 transition-colors group cursor-pointer"
                  style={{
                    width: "70px",
                    height: "70px",
                  }}
                  animate={{
                    x: [
                      Math.cos((i * Math.PI * 2) / 5 + tech.delay) * 180,
                      Math.cos((i * Math.PI * 2) / 5 + Math.PI * 2 + tech.delay) * 180,
                    ],
                    y: [
                      Math.sin((i * Math.PI * 2) / 5 + tech.delay) * 180,
                      Math.sin((i * Math.PI * 2) / 5 + Math.PI * 2 + tech.delay) * 180,
                    ],
                  }}
                  transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear",
                    delay: i * 0.2,
                  }}
                >
                  <div className="flex flex-col items-center justify-center h-full">
                    <span className="text-xl mb-1">{tech.icon}</span>
                    <span className="text-[9px] text-muted-foreground group-hover:text-foreground transition-colors">
                      {tech.label}
                    </span>
                  </div>
                </motion.div>
              ))}

              {/* Floating Particles */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={`particle-${i}`}
                  className="absolute w-2 h-2 rounded-full bg-primary/30"
                  animate={{
                    x: [
                      Math.random() * 300 - 150,
                      Math.random() * 300 - 150,
                      Math.random() * 300 - 150,
                    ],
                    y: [
                      Math.random() * 300 - 150,
                      Math.random() * 300 - 150,
                      Math.random() * 300 - 150,
                    ],
                    opacity: [0.2, 0.5, 0.2],
                    scale: [1, 1.5, 1],
                  }}
                  transition={{
                    duration: 5 + Math.random() * 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: Math.random() * 2,
                  }}
                />
              ))}

              {/* Connecting Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <motion.circle
                  cx="50%"
                  cy="50%"
                  r="120"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="1"
                  strokeDasharray="5,5"
                  opacity="0.2"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                <motion.circle
                  cx="50%"
                  cy="50%"
                  r="180"
                  fill="none"
                  stroke="hsl(var(--accent))"
                  strokeWidth="1"
                  strokeDasharray="5,5"
                  opacity="0.15"
                  animate={{ rotate: -360 }}
                  transition={{
                    duration: 40,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </svg>
            </div>
          </motion.div>

          {/* Floating geometric shapes */}
          <div className="absolute top-20 right-10 w-20 h-20 border-2 border-primary/30 rounded-lg rotate-12 animate-float" />
          <div className="absolute bottom-20 left-10 w-16 h-16 border-2 border-accent/30 rotate-45 animate-float" style={{ animationDelay: "2s" }} />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex items-start justify-center p-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-primary rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
