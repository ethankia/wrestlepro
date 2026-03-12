import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import AnimatedSection from "@/components/AnimatedSection";

const Auth = () => {
  const { user, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) return null;
  if (user) return <Navigate to="/" replace />;

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        toast.success("Check your email to confirm your account.");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOAuth = async (provider: "google" | "apple") => {
    const { error } = await lovable.auth.signInWithOAuth(provider, {
      redirect_uri: window.location.origin,
    });
    if (error) toast.error(error.message || "OAuth sign-in failed");
  };

  return (
    <div className="page-container flex items-center justify-center min-h-[80vh]">
      <AnimatedSection className="w-full max-w-sm">
        <h1 className="section-title text-center mb-2">
          {isLogin ? "Sign In" : "Sign Up"}
        </h1>
        <p className="text-muted-foreground text-center text-sm mb-8">
          {isLogin ? "Welcome back, wrestler." : "Join the team."}
        </p>

        {/* OAuth buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => handleOAuth("google")}
            className="flex-1 py-3 bg-card border border-border text-foreground font-heading uppercase text-sm hover:border-gold transition-colors"
          >
            Google
          </button>
          <button
            onClick={() => handleOAuth("apple")}
            className="flex-1 py-3 bg-card border border-border text-foreground font-heading uppercase text-sm hover:border-gold transition-colors"
          >
            Apple
          </button>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground uppercase">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-card border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full bg-card border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold"
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-primary text-primary-foreground font-heading uppercase text-sm border border-gold hover:bg-gold/90 transition-colors disabled:opacity-50"
          >
            {submitting ? "..." : isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          {isLogin ? "No account?" : "Already have one?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="gold-text hover:underline"
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </p>
      </AnimatedSection>
    </div>
  );
};

export default Auth;
