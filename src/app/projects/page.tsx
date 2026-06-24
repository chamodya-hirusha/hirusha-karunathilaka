import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProjectsList from "./ProjectsList";

export const metadata = {
  title: "All Projects | Chamodya Hirusha",
  description: "Explore the complete portfolio of Chamodya Hirusha, showcasing web applications, mobile apps, and developer tools built with React, Next.js, React Native, Node.js, and MongoDB.",
};

export default function ProjectsPage() {
  return (
    <>
      <SEO
        title="All Projects | Chamodya Hirusha"
        description="Explore the complete portfolio of Chamodya Hirusha, showcasing web applications, mobile apps, and developer tools built with React, Next.js, React Native, Node.js, and MongoDB."
        keywords={["Projects", "Portfolio", "Web Apps", "Mobile Apps", "Full-Stack Development"]}
      />
      <main className="min-h-screen bg-background text-foreground relative overflow-hidden">
        {/* Visual ambient gradient glow */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[150px] pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] rounded-full bg-secondary/5 blur-[150px] pointer-events-none" />

        <Navbar />
        
        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto px-4 pt-32 pb-20 relative z-10">
          <ProjectsList />
        </div>

        <Footer />
      </main>
    </>
  );
}
