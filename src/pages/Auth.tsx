import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Mail, Lock, User, Sparkles } from "lucide-react";

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
        toast({ title: "Reset link sent!", description: "Check your email for the password reset link." });
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
        toast({ title: "Account created! 🎉", description: "Signing you in..." });
        // Auto-confirm is on, so sign them in directly
        const { error: loginErr } = await signIn(email, password);
        if (!loginErr) {
          navigate("/home");
        }
      }
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="px-4 pt-6 pb-2 flex items-center gap-3">
        <button onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-heading font-bold gradient-text">TIL</h1>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 pb-8">
        <div className="w-full max-w-sm">
          <div className="w-16 h-16 rounded-2xl gradient-primary mx-auto flex items-center justify-center mb-6 animate-pulse-glow">
            <Sparkles className="w-8 h-8 text-primary-foreground" />
          </div>

          <h2 className="text-2xl font-heading font-bold text-center text-foreground">
            {mode === "login" ? "Welcome back" : mode === "signup" ? "Join TIL" : "Reset Password"}
          </h2>
          <p className="text-sm text-muted-foreground text-center mt-1 mb-6">
            {mode === "login" ? "Sign in to your account" : mode === "signup" ? "Create your account to get started" : "We'll send you a reset link"}
          </p>

          {mode === "signup" && (
            <div className="flex gap-2 mb-6">
              {(["creator", "brand"] as Role[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`flex-1 py-3 rounded-xl text-sm font-heading font-medium transition-all ${
                    role === r
                      ? "gradient-primary text-primary-foreground shadow-lg"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {r === "creator" ? "🎨 Creator" : "🏢 Brand"}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-heading">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" className="pl-9 h-11 rounded-xl bg-secondary border-border/50" required />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-heading">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="pl-9 h-11 rounded-xl bg-secondary border-border/50" required />
              </div>
            </div>

            {mode !== "forgot" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-heading">Password</Label>
                  {mode === "login" && (
                    <button type="button" onClick={() => setMode("forgot")} className="text-xs text-primary font-heading hover:underline">
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="pl-9 h-11 rounded-xl bg-secondary border-border/50" required minLength={6} />
                </div>
              </div>
            )}

            <Button type="submit" variant="gradient" size="lg" className="w-full" disabled={submitting}>
              {submitting ? "Please wait..." : mode === "login" ? "Sign In" : mode === "signup" ? "Create Account" : "Send Reset Link"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {mode === "forgot" ? (
              <button onClick={() => setMode("login")} className="text-primary font-medium hover:underline">
                Back to sign in
              </button>
            ) : (
              <>
                {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
                <button onClick={() => setMode(mode === "login" ? "signup" : "login")} className="text-primary font-medium hover:underline">
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
