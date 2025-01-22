import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import type { Project } from "@/types/auth";

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data: projects, error } = await supabase
        .from("projects")
        .select("*")
        .eq('owner_id', user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProjects(projects || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar projetos",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("can_create_projects")
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      if (!profile.can_create_projects) {
        toast({
          title: "Permissão negada",
          description: "Você não tem permissão para criar projetos.",
          variant: "destructive",
        });
        return;
      }

      const name = `Projeto ${projects.length + 1}`;
      const { data: project, error } = await supabase
        .from("projects")
        .insert([{ name, owner_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      navigate(`/project/${project.id}`);
    } catch (error: any) {
      toast({
        title: "Erro ao criar projeto",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/auth");
    } catch (error: any) {
      toast({
        title: "Erro ao sair",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Meus Projetos</h1>
          <Button onClick={handleLogout} variant="outline">
            Sair
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => navigate(`/project/${project.id}`)}
              className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-medium text-gray-900">
                {project.name}
              </h3>
              {project.description && (
                <p className="mt-2 text-gray-500">{project.description}</p>
              )}
              <p className="mt-2 text-sm text-gray-400">
                Criado em:{" "}
                {new Date(project.created_at).toLocaleDateString("pt-BR")}
              </p>
            </div>
          ))}

          <Button
            onClick={handleCreateProject}
            className="h-full min-h-[200px] flex flex-col items-center justify-center space-y-4 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-100 transition-colors"
          >
            <Plus className="h-8 w-8" />
            <span>Criar novo projeto</span>
          </Button>
        </div>
      </main>
    </div>
  );
}