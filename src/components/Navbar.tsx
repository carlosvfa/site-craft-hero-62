import { Button } from "@/components/ui/button";
import { Settings, Github, Database } from "lucide-react";

export const Navbar = () => {
  return (
    <>
      {/* Barra de Navegação */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-xl font-semibold text-gray-900">
                Construtor de Sites AI
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-600">
                <Database className="h-4 w-4 mr-2" />
                Supabase
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600">
                <Github className="h-4 w-4 mr-2" />
                Github
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Conteúdo Principal */}
      <div className="mt-16">
        {/* Aqui vai o restante da página */}
        <p>Seu conteúdo principal começa aqui!</p>
      </div>
    </>
  );
};
