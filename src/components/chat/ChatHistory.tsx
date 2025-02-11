import { Message } from "@/types/chat";
import { ChatMessage } from "./ChatMessage";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatHistoryProps {
  messages: Message[];
}

export const ChatHistory = ({ messages }: ChatHistoryProps) => {
  return (
    <ScrollArea className="flex-1 px-4">
      <div className="py-4 space-y-4">
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
      </div>
    </ScrollArea>
  );
};