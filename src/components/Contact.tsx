"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Github, Linkedin, Mail } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import emailjs from "@emailjs/browser";

const socialLinks = [
  { icon: Github, label: "GitHub", url: "https://github.com/chamodya-hirusha", color: "hover:text-primary" },
  { icon: Linkedin, label: "LinkedIn", url: "https://www.linkedin.com/in/chamodya-hirusha-6a5961262?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app", color: "hover:text-primary" },
  { icon: FaWhatsapp, label: "WhatsApp", url: "https://wa.me/94701529611", color: "hover:text-green-500" },
  { icon: Mail, label: "Email", url: "mailto:chamodyahirusha21@gmail.com", color: "hover:text-secondary" },
];

const Contact = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSending, setIsSending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSending) return;
    setIsSending(true);

    const serviceId = "service_2uap55h";
    const templateId = "template_4hwdn3j";
    const publicKey = "N7OLfCOHHErgoWto6"; // Replace with your actual public key

    try {
      const templateParams = {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        notes: `Message from ${formData.name} (${formData.email})`,
      };

      const response = await emailjs.send(serviceId, templateId, templateParams, publicKey);
      
      toast({
        title: "Message sent successfully!",
        description: `Thanks for reaching out. I'll get back to you soon!`,
      });
      
      setFormData({ name: "", email: "", message: "" });
      formRef.current?.reset();
    } catch (error) {
      console.log('FAILED...', error);
      toast({
        title: "Sending failed",
        description: "Please try again or email me directly at chamodyahirusha21@gmail.com",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section id="contact" className="py-20 relative">
      <div className="container px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            <span className="gradient-text">Get In Touch</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-16" />

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <Card className="glass-card p-8">
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Name
                    </label>
                    <Input
                      name="from_name"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="glass-card border-border/50 focus:border-primary"
                      placeholder="Your name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email
                    </label>
                    <Input
                      name="from_email"
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="glass-card border-border/50 focus:border-primary"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Message
                    </label>
                    <Textarea
                      name="message"
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      className="glass-card border-border/50 focus:border-primary min-h-[150px]"
                      placeholder="Tell me about your project..."
                    />
                  </div>

                  <Button type="submit" disabled={isSending} className="w-full glass-card glow-border" size="lg">
                    {isSending ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </Card>
            </motion.div>

            {/* Social Links & Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="space-y-8"
            >
              <Card className="glass-card p-8">
                <h3 className="text-2xl font-bold mb-4 glow-text">Let's Connect</h3>
                <p className="text-muted-foreground mb-6">
                  I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.label}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-3 p-4 rounded-lg glass-card border border-border/50 hover:border-primary/50 transition-all group ${social.color}`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="text-sm font-medium">{social.label}</span>
                      </a>
                    );
                  })}
                </div>
              </Card>

              <Card className="glass-card p-8 border-l-4 border-primary">
                <h3 className="text-xl font-bold mb-3">Quick Response</h3>
                <p className="text-muted-foreground">
                  I typically respond within 24 hours. Looking forward to hearing from you!
                </p>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
