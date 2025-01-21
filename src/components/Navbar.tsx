import { Button } from "@/components/ui/button";
import { Settings, Github, Cloud, Zap, Database } from "lucide-react";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <span className="text-xl font-semibold text-gray-900">
              Website Builder AI
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="text-gray-600">
              <Database className="h-4 w-4" />
              Supabase
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-600">
              <Github className="h-4 w-4" />
              Github
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-600">
              <Zap className="h-4 w-4" />
              Publish
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-600">
              <Cloud className="h-4 w-4" />
              Deploy
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-600">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};