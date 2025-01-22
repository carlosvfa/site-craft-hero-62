export interface Message {
  type: "ai" | "user";
  content: string;
  timestamp?: number;
}