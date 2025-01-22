import { Message } from "@/types/chat";

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  return (
    <div className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] p-3 rounded-lg ${
          message.type === "user"
            ? "bg-gray-900 text-white"
            : "bg-gray-200 text-gray-900"
        } shadow`}
      >
        <div>{message.content}</div>
        {message.timestamp && (
          <div
            className={`text-xs mt-1 ${
              message.type === "user" ? "text-gray-300" : "text-gray-500"
            }`}
          >
            {new Date(message.timestamp).toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
};