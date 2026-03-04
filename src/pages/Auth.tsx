import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Mail, Lock, User } from "lucide-react";

type Mode = "login" | "signup" | "forgot";
type Role = "creator" | "brand";

const Auth = () => {
  const [mode, setMode] = useState<Mode>("login");
  const [role, setRole] = useState<Role>("creator");
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
        navigate("/home");
      }
    } else {
      const { error } = await signUp(email, password, fullName, role);
      if (error) {
        toast({ title: "Signup failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Account created", description: "Signing you in..." });
        const { error: loginErr } = await signIn(email, password);
        if (!loginErr) {
          navigate("/home");
        }
      }
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen mesh-gradient-bg flex flex-col relative overflow-hidden">
      {/* Floating orbs */}
      <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-accent/10 blur-3xl animate-float" />
      <div className="absolute bottom-32 right-8 w-48 h-48 rounded-full bg-info/8 blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />

      <div className="px-5 pt-5 flex items-center gap-3 relative z-10">
        <button onClick={() => navigate("/")} className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary-foreground flex items-center justify-center">
            <span className="text-primary font-heading font-bold text-[10px]">T</span>
          </div>
          <span className="font-heading font-bold text-primary-foreground text-sm">TIL</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-5 pb-8 relative z-10">
        <div className="w-full max-w-sm glass-card rounded-2xl p-6 animate-fade-up">
          <h2 className="text-2xl font-heading font-bold text-primary-foreground">
            {mode === "login" ? "Welcome back" : mode === "signup" ? "Create account" : "Reset password"}
          </h2>
          <p className="text-sm text-primary-foreground/60 mt-1 mb-6">
            {mode === "login" ? "Sign in to continue" : mode === "signup" ? "Get started with TIL" : "We'll send you a reset link"}
          </p>

          {mode === "signup" && (
            <div className="flex gap-1 mb-6 p-1 bg-primary-foreground/10 rounded-lg">
              {(["creator", "brand"] as Role[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-all btn-micro ${
                    role === r
                      ? "bg-primary-foreground text-primary shadow-sm"
                      : "text-primary-foreground/60 hover:text-primary-foreground"
                  }`}
                >
                  {r === "creator" ? "Creator" : "Brand"}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-medium text-primary-foreground/80">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-foreground/40" />
                  <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" className="pl-9 h-11 bg-primary-foreground/10 border-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/30 focus:border-accent" required />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-medium text-primary-foreground/80">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-foreground/40" />
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="pl-9 h-11 bg-primary-foreground/10 border-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/30 focus:border-accent" required />
              </div>
            </div>

            {mode !== "forgot" && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-medium text-primary-foreground/80">Password</Label>
                  {mode === "login" && (
                    <button type="button" onClick={() => setMode("forgot")} className="text-xs text-primary-foreground/50 hover:text-primary-foreground transition-colors">
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-foreground/40" />
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 characters" className="pl-9 h-11 bg-primary-foreground/10 border-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/30 focus:border-accent" required minLength={6} />
                </div>
              </div>
            )}

            <Button type="submit" size="lg" className="w-full h-11 font-medium bg-accent hover:bg-accent/90 text-accent-foreground btn-micro" disabled={submitting}>
              {submitting ? "Please wait..." : mode === "login" ? "Sign In" : mode === "signup" ? "Create Account" : "Send Reset Link"}
            </Button>
          </form>

          <p className="text-center text-sm text-primary-foreground/50 mt-6">
            {mode === "forgot" ? (
              <button onClick={() => setMode("login")} className="text-primary-foreground font-medium hover:underline">
                Back to sign in
              </button>
            ) : (
              <>
                {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
                <button onClick={() => setMode(mode === "login" ? "signup" : "login")} className="text-accent font-medium hover:underline">
                  {mode === "login" ? "Sign up" : "Sign in"}
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
