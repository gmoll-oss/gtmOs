"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Mail, Lock, User, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        const result = await signIn.email({
          email,
          password,
        });
        if (result.error) {
          setError(result.error.message || "Error al iniciar sesión");
          setLoading(false);
          return;
        }
      } else {
        if (!name.trim()) {
          setError("El nombre es requerido");
          setLoading(false);
          return;
        }
        const result = await signUp.email({
          email,
          password,
          name,
        });
        if (result.error) {
          setError(result.error.message || "Error al crear cuenta");
          setLoading(false);
          return;
        }
      }
      router.push("/");
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Error inesperado");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#00395E] via-[#004a7a] to-[#005a94] p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img
            src="/logo-fideltour.png"
            alt="Fideltour"
            className="h-10 mx-auto mb-4"
            data-testid="img-login-logo"
          />
          <p className="text-white/70 text-sm">
            Plataforma de prospección hotelera
          </p>
        </div>

        <Card className="border-0 shadow-2xl" data-testid="card-login">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl" data-testid="text-login-title">
              {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Tu nombre"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10"
                      data-testid="input-name"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                    data-testid="input-email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                    minLength={6}
                    data-testid="input-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    data-testid="button-toggle-password"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-500 text-center" data-testid="text-login-error">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
                data-testid="button-submit-login"
              >
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                }}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                data-testid="button-toggle-mode"
              >
                {isLogin
                  ? "¿No tienes cuenta? Crear una"
                  : "¿Ya tienes cuenta? Iniciar sesión"}
              </button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-white/40 text-xs mt-6">
          © {new Date().getFullYear()} Fideltour · www.fideltour.com
        </p>
      </div>
    </div>
  );
}
