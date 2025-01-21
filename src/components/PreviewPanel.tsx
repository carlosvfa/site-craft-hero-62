import { Button } from "@/components/ui/button";
import { RefreshCw, Smartphone, ArrowBigLeft, ArrowBigRight } from "lucide-react";
import { useState } from "react";

export const PreviewPanel = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 1; // This will be dynamic based on project pages

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="border-b border-gray-200 p-2 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobile(!isMobile)}
            className="text-gray-600"
          >
            <Smartphone className="h-4 w-4" />
            {isMobile ? "Desktop" : "Mobile"}
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-600">
            <RefreshCw className="h-4 w-4" />
            Reiniciar
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            className="text-gray-600"
          >
            <ArrowBigLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-gray-600">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant="ghost"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            className="text-gray-600"
          >
            <ArrowBigRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className={`flex-1 overflow-y-auto bg-gray-50 ${isMobile ? 'flex justify-center' : ''}`}>
        <div className={`min-h-[calc(100vh-8rem)] ${isMobile ? 'w-[375px] border-x border-gray-200' : 'w-full'}`}>
          <div className="flex items-center justify-center h-full text-gray-500">
            Área de Visualização
          </div>
        </div>
      </div>
    </div>
  );
};