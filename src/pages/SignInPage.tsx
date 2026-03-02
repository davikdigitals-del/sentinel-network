import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignInPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (ok) navigate("/dashboard");
    else setError("Invalid credentials. Please check your email and password.");
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-alert rounded-sm flex items-center justify-center mx-auto mb-3">
            <span className="font-display font-bold text-lg text-alert-foreground">PH</span>
          </div>
          <CardTitle className="font-display text-2xl">Sign In</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Access your Preparedness Hub account</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-sm text-destructive bg-destructive/10 p-2 rounded">{error}</p>}
            <div>
              <Label>Email</Label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" />
            </div>
            <div>
              <Label>Password</Label>
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" minLength={6} />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/signup" className="text-alert hover:underline font-semibold">Create one</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
