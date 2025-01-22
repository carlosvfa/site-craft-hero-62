import { Github } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-[#221F26] border-t border-gray-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 mb-4 md:mb-0">
            © 2025 Carlos Alves, Inc. Todos os direitos reservados.
          </div>
          <div className="flex space-x-6">
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Documentação
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Suporte
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};