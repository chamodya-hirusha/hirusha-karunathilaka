"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, User, Eye, EyeOff, Loader2, ArrowRight, ShieldCheck, ChevronLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLogin() {
  const router = useRouter();

  // Authentication step state
  const [step, setStep] = useState<1 | 2>(1);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  
  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Step 1: Send OTP to Admin Email
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Please enter both email and password");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Verification code sent to your admin email address");
        setStep(2); // Progress to OTP Verification
      } else {
        toast.error(data.error || "Authentication failed. Invalid credentials.");
      }
    } catch (err) {
      console.error("Send OTP error:", err);
      toast.error("Connection error. Could not reach authentication server.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and Log In
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim() || otp.trim().length !== 6) {
      toast.error("Please enter a valid 6-digit verification code");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          otp: otp.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Access granted. Loading admin workspace...");

        if (data.isDefaultAdmin) {
          toast.warning("Warning: Please ensure you update default credentials in your database.", {
            duration: 8000,
          });
        }

        // Wait brief moment for session propagation and redirect
        setTimeout(() => {
          router.push("/admin/dashboard");
          router.refresh();
        }, 1200);
      } else {
        toast.error(data.error || "Verification failed. Invalid or expired code.");
      }
    } catch (err) {
      console.error("Verify OTP error:", err);
      toast.error("Connection error. Verification server unreachable.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080c] flex flex-col items-center justify-center text-foreground p-4 relative overflow-hidden">
      {/* Decorative luxury ambient lighting elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full bg-cyan-500/5 blur-[90px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] rounded-full bg-purple-500/5 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <Card className="glass-card border-neutral-800/80 shadow-2xl p-4 bg-[#090a0f]/80 backdrop-blur-md">
          
          <AnimatePresence mode="wait">
            {step === 1 ? (
              /* STEP 1: CREDENTIALS ENTRY FORM */
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.3 }}
              >
                <CardHeader className="text-center pb-6">
                  <div className="mx-auto w-14 h-14 rounded-full bg-cyan-950/40 border border-cyan-800/30 flex items-center justify-center mb-4 shadow-sm animate-pulse">
                    <Lock className="h-6 w-6 text-cyan-400" />
                  </div>
                  <CardTitle className="text-3xl font-extrabold tracking-tight glow-text text-white">
                    Admin Gateway
                  </CardTitle>
                  <CardDescription className="text-neutral-400 mt-2 text-xs uppercase tracking-widest font-semibold">
                    Step 1: Credentials Verification
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <form onSubmit={handleSendOtp} className="space-y-5">
                    {/* Username / Email field */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400">
                        Email Address / Username
                      </Label>
                      <div className="relative">
                        <Input
                          id="email"
                          type="text"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g., hiruniru99@gmail.com"
                          className="bg-[#111318] border-neutral-800/60 focus-visible:ring-cyan-500 pl-10 h-11 text-sm text-neutral-100 placeholder:text-neutral-600 focus-visible:ring-offset-0 focus-visible:ring-1"
                          required
                          disabled={loading}
                        />
                        <User className="absolute left-3.5 top-3.5 h-4 w-4 text-neutral-500" />
                      </div>
                    </div>

                    {/* Password field */}
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400">
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          className="bg-[#111318] border-neutral-800/60 focus-visible:ring-cyan-500 pl-10 pr-10 h-11 text-sm text-neutral-100 placeholder:text-neutral-600 focus-visible:ring-offset-0 focus-visible:ring-1"
                          required
                          disabled={loading}
                        />
                        <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-neutral-500" />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3.5 text-neutral-500 hover:text-neutral-200 focus:outline-none"
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Send OTP button */}
                    <Button
                      type="submit"
                      className="w-full h-11 bg-gradient-to-r from-cyan-900/60 to-purple-900/60 hover:from-cyan-800/60 hover:to-purple-800/60 text-cyan-400 border border-cyan-800/40 hover:border-cyan-500/60 shadow-lg font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 mt-4 rounded-lg transition-all"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Validating credentials...
                        </>
                      ) : (
                        <>
                          Request Verification Code
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </motion.div>
            ) : (
              /* STEP 2: OTP VERIFICATION CODE FORM */
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.3 }}
              >
                <CardHeader className="text-center pb-6 relative">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setOtp("");
                    }}
                    className="absolute left-0 top-2 flex items-center gap-1 text-[9px] uppercase tracking-widest font-bold text-neutral-500 hover:text-neutral-200 transition-colors"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    Back
                  </button>
                  
                  <div className="mx-auto w-14 h-14 rounded-full bg-cyan-950/40 border border-cyan-800/30 flex items-center justify-center mb-4 shadow-sm">
                    <ShieldCheck className="h-6 w-6 text-cyan-400" />
                  </div>
                  <CardTitle className="text-3xl font-extrabold tracking-tight glow-text text-white">
                    Enter Code
                  </CardTitle>
                  <CardDescription className="text-neutral-400 mt-2 text-xs uppercase tracking-widest font-semibold">
                    Step 2: Two-Factor Verification
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <form onSubmit={handleVerifyOtp} className="space-y-6">
                    <div className="text-center space-y-2">
                      <p className="text-xs text-neutral-400 leading-relaxed font-light">
                        We have sent a 6-digit temporary verification code to:
                      </p>
                      <p className="text-sm text-cyan-400 font-semibold font-mono tracking-wide">
                        {email}
                      </p>
                    </div>

                    {/* Monospace 6-digit OTP code input */}
                    <div className="space-y-2">
                      <Label htmlFor="otp" className="text-[10px] uppercase tracking-widest font-semibold text-neutral-500 text-center block w-full">
                        6-Digit One-Time Password
                      </Label>
                      <Input
                        id="otp"
                        type="text"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} // Only digits
                        placeholder="000000"
                        className="bg-[#111318]/90 border-neutral-800/60 focus-visible:ring-cyan-500 h-12 text-center text-xl font-bold font-mono tracking-[0.6em] text-neutral-100 focus-visible:ring-offset-0 focus-visible:ring-1 pl-4 rounded-lg"
                        required
                        autoFocus
                        disabled={loading}
                      />
                    </div>

                    {/* Verify & Login button */}
                    <div className="space-y-4 pt-2">
                      <Button
                        type="submit"
                        className="w-full h-11 bg-gradient-to-r from-cyan-900/60 to-purple-900/60 hover:from-cyan-800/60 hover:to-purple-800/60 text-cyan-400 border border-cyan-800/40 hover:border-cyan-500/60 shadow-lg font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 rounded-lg transition-all"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Verifying login code...
                          </>
                        ) : (
                          <>
                            Confirm & Access Workspace
                            <ShieldCheck className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                      
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={loading}
                        className="w-full text-center text-[9px] uppercase tracking-widest font-semibold text-neutral-500 hover:text-cyan-400 transition-colors disabled:opacity-50"
                      >
                        Resend OTP Code
                      </button>
                    </div>
                  </form>
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>

        </Card>
      </div>
    </div>
  );
}
