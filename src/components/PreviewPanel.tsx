import { Button } from "@/components/ui/button";
import { RefreshCw, Smartphone } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const PreviewPanel = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(""); // Página selecionada
  const pages = ["/index", "/about", "/contact"]; // Páginas disponíveis

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="border-b border-gray-200 p-2 flex justify-between items-center">
        {/* Lado esquerdo: Nome do projeto e seletor */}
        <div className="flex items-center space-x-4">
          {/* Nome do projeto temporário */}
          <span className="text-lg font-semibold text-gray-700">
            SiteCraftHero
          </span>
          {/* Seletor de páginas */}
          <Select
            value={currentPage}
            onValueChange={(value) => setCurrentPage(value)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Selecionar Página" />
            </SelectTrigger>
            <SelectContent>
              {pages.map((page) => (
                <SelectItem key={page} value={page}>
                  {page}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Lado direito: Botões Mobile e Reiniciar */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobile(!isMobile)}
            className="text-gray-600"
          >
            <Smartphone className="h-4 w-4 mr-2" />
            {isMobile ? "Desktop" : "Mobile"}
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-600">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reiniciar
          </Button>
        </div>
      </div>
      <div
        className={`flex-1 overflow-y-auto bg-gray-50 ${
          isMobile ? "flex justify-center" : ""
        }`}
      >
        <div
          className={`min-h-[calc(100vh-8rem)] ${
            isMobile ? "w-[375px] border-x border-gray-200" : "w-full"
          }`}
        >
          <div className="flex items-center justify-center h-full text-gray-500">
            Área de Visualização
          </div>
        </div>
      </div>
    </div>
  );
};
