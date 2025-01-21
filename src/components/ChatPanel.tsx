import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

export const ChatPanel = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      type: "ai",
      content: "Hello! I'm your AI website builder assistant. How can I help you today?",
    },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages([...messages, { type: "user", content: input }]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      <Tabs defaultValue="chat" className="flex flex-col h-full">
        <TabsList className="justify-start border-b border-gray-200 px-4">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chat" className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === "user"
                        ? "bg-gray-900 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
              <Button type="submit" className="bg-gray-900 hover:bg-gray-800">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="history" className="flex-1 p-4">
          <div className="text-gray-500 text-center">
            Your chat history will appear here
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};