import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
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
    <div className="flex flex-col h-full bg-primary-light">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-primary-dark">Chat Assistant</h2>
      </div>

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
                    ? "bg-primary text-white"
                    : "bg-white text-primary-dark"
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
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button type="submit" className="bg-primary hover:bg-primary-hover">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};