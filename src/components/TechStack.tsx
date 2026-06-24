"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Card } from "@/components/ui/card";
import { Code2, Database, Layout, Server, Cpu, Zap, Smartphone, Brain } from "lucide-react";

const technologies = [
  {
    category: "Frontend Development",
    icon: Layout,
    color: "from-blue-500 to-cyan-500",
    description: "Modern, responsive interfaces",
    proficiency: 95,
    techs: [
      { name: "React", level: "expert" },
      { name: "Next.js", level: "expert" },
      { name: "TypeScript", level: "expert" },
      { name: "Tailwind CSS", level: "expert" },
      { name: "React Native", level: "advanced" },
    ],
  },
  {
    category: "Backend Development",
    icon: Server,
    color: "from-purple-500 to-pink-500",
    description: "Scalable server solutions",
    proficiency: 90,
    techs: [
      { name: "Node.js", level: "expert" },
      { name: "Express", level: "expert" },
      { name: "Spring Boot", level: "advanced" },
      { name: "EJB", level: "intermediate" },
      { name: "REST APIs", level: "expert" },
    ],
  },
  {
    category: "Mobile Development",
    icon: Smartphone,
    color: "from-green-500 to-emerald-500",
    description: "Cross-platform apps",
    proficiency: 88,
    techs: [
      { name: "React Native", level: "expert" },
      { name: "Expo", level: "advanced" },
      { name: "Mobile UI/UX", level: "advanced" },
      { name: "Android Studio", level: "intermediate" },
    ],
  },
  {
    category: "Database & Storage",
    icon: Database,
    color: "from-orange-500 to-red-500",
    description: "Efficient data management",
    proficiency: 85,
    techs: [
      { name: "MongoDB", level: "expert" },
      { name: "Firebase", level: "expert" },
      { name: "MySQL", level: "advanced" },
    ],
  },
  {
    category: "AI & Machine Learning",
    icon: Brain,
    color: "from-violet-500 to-purple-500",
    description: "Intelligent features",
    proficiency: 60,
    techs: [
      { name: "TensorFlow", level: "intermediate" },
      { name: "AI APIs", level: "expert" },
      { name: "OpenAI", level: "intermediate" },
      { name: "ChatGPT", level: "intermediate" },
      { name: "Gemini", level: "intermediate" },
    ],
  },
  {
    category: "Languages",
    icon: Code2,
    color: "from-yellow-500 to-amber-500",
    description: "Core programming skills",
    proficiency: 92,
    techs: [
      { name: "JavaScript", level: "expert" },
      { name: "TypeScript", level: "expert" },
      { name: "Java", level: "advanced" },
      { name: "HTML", level: "advanced" },
    ],
  },
  {
    category: "Hardware & IoT",
    icon: Cpu,
    color: "from-pink-500 to-rose-500",
    description: "Embedded systems",
    proficiency: 65,
    techs: [
      { name: "Arduino", level: "intermediate" },
      { name: "Raspberry Pi", level: "beginner" },
      { name: "ESP32", level: "beginner" },
    ],
  },
  {
    category: "DevOps & Tools",
    icon: Zap,
    color: "from-indigo-500 to-blue-500",
    description: "Development workflow",
    proficiency: 85,
    techs: [
      { name: "Git", level: "expert" },
      { name: "VS Code", level: "intermediate" },
      { name: "IntelliJ IDEA", level: "expert" },
      { name: "Postman", level: "intermediate" },
      { name: "Figma", level: "expert" },
      { name: "Jira", level: "intermediate" },
      { name: "Android Studio", level: "intermediate" },

    ],
  },
];

const TechStack = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1 },
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "expert":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "advanced":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "intermediate":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <section id="skills" className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      
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
                <span className="gradient-text">Tech Stack</span>
              </h2>
            </motion.div>
            <div className="w-24 h-1 bg-gradient-to-r from-primary via-accent to-secondary mx-auto mt-6 rounded-full" />
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto"
          >
            {technologies.map((tech) => {
              const Icon = tech.icon;
              return (
                <motion.div 
                  key={tech.category} 
                  variants={item}
                  className="group"
                >
                  <Card className="relative glass-card p-6 h-full hover:-translate-y-2 transition-all duration-300 border-2 border-border/50 hover:border-primary/40 overflow-hidden">
                    {/* Animated background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Glow effect */}
                    <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative z-10">
                      {/* Header */}
                      <div className="mb-4">
                        <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${tech.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="h-7 w-7 text-white" />
                        </div>
                      </div>

                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {tech.category}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {tech.description}
                      </p>

                      {/* Proficiency Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs text-muted-foreground font-medium">Proficiency</span>
                          <span className="text-xs font-bold text-primary">{tech.proficiency}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full bg-gradient-to-r ${tech.color} rounded-full`}
                            initial={{ width: 0 }}
                            animate={inView ? { width: `${tech.proficiency}%` } : { width: 0 }}
                            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                          />
                        </div>
                      </div>

                      {/* Tech Tags */}
                      <div className="flex flex-wrap gap-2">
                        {tech.techs.map((t) => (
                          <span
                            key={t.name}
                            className={`px-2.5 py-1 text-xs rounded-md border font-medium transition-all hover:scale-105 ${getLevelColor(t.level)}`}
                          >
                            {t.name}
                          </span>
                        ))}
                      </div>

                      {/* Decorative corner */}
                      <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-primary/20 rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Legend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1, duration: 0.5 }}
            className="mt-12 text-center"
          >
            <Card className="glass-card inline-flex items-center gap-6 px-6 py-4 border-2 border-border/50">
              <span className="text-sm text-muted-foreground font-medium">Skill Levels:</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-xs text-muted-foreground">Expert</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-xs text-muted-foreground">Advanced</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="text-xs text-muted-foreground">Intermediate</span>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default TechStack;
