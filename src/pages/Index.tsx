import { Navbar } from "@/components/Navbar";
import { ChatPanel } from "@/components/ChatPanel";
import { PreviewPanel } from "@/components/PreviewPanel";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 pt-16 flex flex-col md:flex-row">
        <div className="w-full md:w-1/3 h-[60vh] md:h-[calc(100vh-4rem)]">
          <ChatPanel />
        </div>
        <div className="w-full md:w-2/3 h-[calc(100vh-4rem)]">
          <PreviewPanel />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Index;