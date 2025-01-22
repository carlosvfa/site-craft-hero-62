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

  const handleAuth = async (e) => {
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
    } catch (error) {
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
    } catch (error) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white animate-fade-in"
    >
      <div className="flex-grow flex items-center justify-center relative overflow-hidden">
        {/* Background animation */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="w-[200%] h-[200%] animate-gradient-spin bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800 via-gray-700 to-black opacity-50" />
        </div>

        {/* Card */}
        <div className="relative z-10 max-w-md w-full space-y-8 p-10 bg-black bg-opacity-70 rounded-xl shadow-lg backdrop-blur-md">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight text-white animate-fade-in">
              WebSite Builder APP
            </h1>
            <h2 className="text-lg font-medium text-gray-300">
              {isSignUp ? "Crie sua conta agora" : "Entre na sua conta"}
            </h2>
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleAuth}>
            <div className="space-y-4">
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                disabled={loading}
                className="w-full bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-gray-500 focus:outline-none rounded-md"
              />
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha"
                disabled={loading}
                className="w-full bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-gray-500 focus:outline-none rounded-md"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-gray-700 to-gray-600 text-white font-medium py-2 rounded-md hover:from-gray-600 hover:to-gray-500 transition duration-300"
              disabled={loading}
            >
              {loading ? "Carregando..." : isSignUp ? "Cadastrar" : "Entrar"}
            </Button>

            <div className="text-center text-sm text-gray-400">
              <span>Ou entre com:</span>
            </div>

            <Button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full bg-gray-800 border border-gray-700 text-white py-2 rounded-md hover:bg-gray-700 transition duration-300 flex items-center justify-center"
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
              Google
            </Button>
          </form>

          <div className="text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              disabled={loading}
              className="text-gray-400 hover:text-white text-sm underline"
            >
              {isSignUp ? "Já tem uma conta? Entre aqui" : "Não tem uma conta? Cadastre-se"}
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
