import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Footer } from "@/components/Footer";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        toast({
          title: "Registro realizado com sucesso!",
          description: "Verifique seu email para confirmar o cadastro.",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate("/");
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#222222] text-white">
      <div className="flex-grow flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 p-8 bg-[#403E43] rounded-xl shadow-2xl animate-fade-in">
          <div className="text-center space-y-6">
            <h1 className="text-4xl font-bold tracking-tight text-white animate-scale-in">
              WebSite Builder APP
            </h1>
            <h2 className="text-2xl font-semibold text-gray-200">
              {isSignUp ? "Criar nova conta" : "Entrar na sua conta"}
            </h2>
          </div>

          <form className="mt-8 space-y-6 animate-fade-in" onSubmit={handleAuth}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  disabled={loading}
                  className="bg-[#221F26] border-gray-600 text-white placeholder:text-gray-400"
                />
              </div>
              <div>
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Senha"
                  disabled={loading}
                  className="bg-[#221F26] border-gray-600 text-white placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="space-y-4">
              <Button
                type="submit"
                className="w-full bg-white text-black hover:bg-gray-200 transition-colors"
                disabled={loading}
              >
                {loading ? "Carregando..." : isSignUp ? "Cadastrar" : "Entrar"}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-500" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-[#403E43] text-gray-300">
                    Ou continue com
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full border-gray-600 text-white hover:bg-[#221F26] transition-colors"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Entrar com Google
              </Button>
            </div>
          </form>

          <div className="text-center">
            <Button
              variant="link"
              onClick={() => setIsSignUp(!isSignUp)}
              disabled={loading}
              className="text-gray-300 hover:text-white"
            >
              {isSignUp
                ? "Já tem uma conta? Entre aqui"
                : "Não tem uma conta? Cadastre-se"}
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}