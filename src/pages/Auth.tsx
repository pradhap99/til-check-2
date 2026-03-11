import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Mail, Lock, User, CheckCircle } from "lucide-react";

type Mode = "login" | "signup" | "forgot";
type Role = "creator" | "brand";

const demoPersonas = [
  { initials: "PS", name: "Priya Sharma", color: "from-pink-500 to-rose-600", delay: "0s", role: "creator" as const },
  { initials: "VK", name: "Vikram Kumar", color: "from-blue-500 to-indigo-600", delay: "1.2s", role: "creator" as const },
  { initials: "AJ", name: "Ajay Jain", color: "from-amber-500 to-orange-600", delay: "2.4s", role: "brand" as const },
];

const Auth = () => {
  const [mode, setMode] = useState<Mode>("login");
  const searchParams = new URLSearchParams(window.location.search);
  const initialRole = searchParams.get("role") === "brand" ? "brand" : "creator";
  const [role, setRole] = useState<Role>(initialRole);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    if (mode === "forgot") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Reset link sent", description: "Check your email for the password reset link." });
        setMode("login");
      }
      setSubmitting(false);
      return;
    }

    if (mode === "login") {
      const { error } = await signIn(email, password);
      if (error) {
        toast({ title: "Login failed", description: error.message, variant: "destructive" });
      } else {
        navigate(role === "brand" ? "/brand/dashboard" : "/home");
      }
    } else {
      const { error } = await signUp(email, password, fullName, role);
      if (error) {
        toast({ title: "Signup failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Account created", description: "Signing you in..." });
        const { error: loginErr } = await signIn(email, password);
        if (!loginErr) {
          navigate(role === "brand" ? "/brand/dashboard" : "/home");
        }
      }
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: "hsl(222 47% 6%)" }}>
      {/* Animated drifting orbs */}
      <div className="absolute top-[10%] left-[10%] w-[200px] h-[200px] rounded-full animate-drift-orb" style={{ background: "radial-gradient(circle, hsla(262,83%,58%,0.35), transparent 70%)", filter: "blur(60px)", animationDuration: "10s" }} />
      <div className="absolute top-[50%] right-[5%] w-[250px] h-[250px] rounded-full animate-drift-orb" style={{ background: "radial-gradient(circle, hsla(45,93%,58%,0.25), transparent 70%)", filter: "blur(80px)", animationDelay: "3s", animationDuration: "12s" }} />
      <div className="absolute bottom-[15%] left-[20%] w-[180px] h-[180px] rounded-full animate-drift-orb" style={{ background: "radial-gradient(circle, hsla(180,60%,45%,0.2), transparent 70%)", filter: "blur(50px)", animationDelay: "5s", animationDuration: "14s" }} />
      <div className="absolute top-[30%] left-[60%] w-[150px] h-[150px] rounded-full animate-drift-orb" style={{ background: "radial-gradient(circle, hsla(330,80%,55%,0.2), transparent 70%)", filter: "blur(40px)", animationDelay: "2s", animationDuration: "9s" }} />

      {/* Back + Logo */}
      <div className="px-5 pt-5 flex items-center gap-3 relative z-10">
        <button onClick={() => navigate("/")} className="text-white/60 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-5 pb-8 relative z-10">
        {/* Logo Section */}
        <div className="text-center mb-6 animate-fade-slide-up">
          <h1 className="text-5xl font-heading font-extrabold" style={{ color: "#f59e0b" }}>TIL</h1>
          <p className="text-sm text-white/60 mt-1 font-medium">India's Creator Economy Platform</p>
        </div>

        {/* Floating Avatars */}
        <div className="flex items-center gap-4 mb-8">
          {floatingAvatars.map((av, i) => (
            <div
              key={i}
              className="animate-float-avatar"
              style={{ animationDelay: av.delay }}
            >
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${av.color} flex items-center justify-center shadow-lg`}>
                <span className="text-white font-heading font-bold text-sm">{av.initials}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Glass Form Card */}
        <div
          className="w-full max-w-sm rounded-3xl p-6 animate-scale-in"
          style={{
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <h2 className="text-2xl font-heading font-bold text-white">
            {mode === "login" ? "Welcome back" : mode === "signup" ? "Create account" : "Reset password"}
          </h2>
          <p className="text-sm text-white/50 mt-1 mb-6">
            {mode === "login"
              ? (role === "brand" ? "Sign in to manage your campaigns" : "Sign in to continue")
              : mode === "signup" ? "Get started with TIL" : "We'll send you a reset link"}
          </p>

          {mode !== "forgot" && (
            <div className="flex gap-1 mb-4 p-1 rounded-lg" style={{ background: "rgba(255,255,255,0.08)" }}>
              {(["creator", "brand"] as Role[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-all btn-micro ${
                    role === r ? "text-black shadow-sm" : "text-white/60 hover:text-white"
                  }`}
                  style={role === r ? { background: "#f59e0b" } : {}}
                >
                  {r === "creator" ? "Creator" : "Brand"}
                </button>
              ))}
            </div>
          )}




          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-medium text-white/70">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <Input
                    id="name" value={fullName} onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your full name"
                    className="pl-9 h-11 rounded-xl border-white/10 text-white placeholder:text-white/25"
                    style={{ background: "rgba(255,255,255,0.06)" }}
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-medium text-white/70">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <Input
                  id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="pl-9 h-11 rounded-xl border-white/10 text-white placeholder:text-white/25 focus:border-amber-500"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                  required
                />
              </div>
            </div>

            {mode !== "forgot" && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-medium text-white/70">Password</Label>
                  {mode === "login" && (
                    <button type="button" onClick={() => setMode("forgot")} className="text-xs text-white/40 hover:text-white transition-colors">
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <Input
                    id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="pl-9 h-11 rounded-xl border-white/10 text-white placeholder:text-white/25 focus:border-amber-500"
                    style={{ background: "rgba(255,255,255,0.06)" }}
                    required minLength={6}
                  />
                </div>
              </div>
            )}

            <Button
              type="submit" size="lg"
              className="w-full h-12 font-heading font-bold rounded-xl text-white btn-hover-lift btn-shimmer-hover"
              style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}
              disabled={submitting}
            >
              {submitting ? "Please wait..." : mode === "login" ? "Sign In" : mode === "signup" ? "Create Account" : "Send Reset Link"}
            </Button>
          </form>

          <p className="text-center text-sm text-white/40 mt-5">
            {mode === "forgot" ? (
              <button onClick={() => setMode("login")} className="text-white font-medium hover:underline">
                Back to sign in
              </button>
            ) : (
              <>
                {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
                <button onClick={() => setMode(mode === "login" ? "signup" : "login")} className="font-medium hover:underline" style={{ color: "#f59e0b" }}>
                  {mode === "login" ? "Sign up" : "Sign in"}
                </button>
              </>
            )}
          </p>
        </div>

        {/* Trust badge */}
        <div className="mt-6 flex items-center gap-1.5 animate-fade-slide-up" style={{ animationDelay: "0.4s" }}>
          <CheckCircle className="w-3.5 h-3.5" style={{ color: "#f59e0b" }} />
          <span className="text-[11px] text-white/50 font-medium">Trusted by 12,400+ creators</span>
        </div>
      </div>
    </div>
  );
};

export default Auth;
