import { Button } from "@/components/ui/button";
import { FileText, Settings } from "lucide-react";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-primary" />
            <span className="ml-2 text-xl font-semibold text-primary-dark">
              Website Builder AI
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="text-gray-600 hover:text-primary">
              About
            </Button>
            <Button variant="ghost" className="text-gray-600 hover:text-primary">
              <Settings className="h-4 w-4 mr-2" />
              Tools
            </Button>
            <Button className="bg-primary hover:bg-primary-hover text-white">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};