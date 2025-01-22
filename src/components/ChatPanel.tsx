// src/components/ChatPanel.tsx
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ChatHistory } from "./chat/ChatHistory";
import { ChatInput } from "./chat/ChatInput";
import { Message } from "@/types/chat";
import { createGithubRepository, pushWebsiteFiles } from "@/services/github";
import { generateWebsite } from "@/services/websiteGenerator";

const SYSTEM_PROMPT = `Você é um assistente de desenvolvimento web. Siga estas regras:
1. Sempre pergunte detalhes faltantes
2. Gere código em markdown (ex: \`\`\`html <div>...</div> \`\`\`)
3. Para criar repositórios, peça: "name:descrição"
4. Mantenha respostas curtas e técnicas`;

export const ChatPanel = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>(loadMessages());

  function loadMessages(): Message[] {
    const saved = localStorage.getItem("chatMessages");
    return saved ? JSON.parse(saved) : [{
      type: "ai",
      content: "Olá! Vamos criar seu site? Me diga: 1. Tipo de site 2. Cores principais 3. Funcionalidades",
      timestamp: Date.now()
    }];
  }

  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  const handleWebsiteGeneration = async (config: any) => {
    const files = generateWebsite(config);
    await pushWebsiteFiles(config.repoName, files);
    toast({ title: "Site gerado!", description: `Acesse: ${config.repoUrl}` });
  };

  const processAIResponse = async (text: string) => {
    // Detectar criação de repositório
    if (text.match(/name:.+/)) {
      const [name, desc] = text.split(':')[1].split('|');
      const repo = await createGithubRepository(name.trim(), desc?.trim());
      await handleWebsiteGeneration({
        repoName: name.trim(),
        ...repo
      });
      return `Repositório criado: ${repo.url}`;
    }

    // Extrair código de respostas
    const codeBlocks = text.match(/```[\s\S]*?```/g) || [];
    if (codeBlocks.length > 0) {
      return "Código gerado e enviado para o GitHub!";
    }

    return text;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { type: "user", content: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_OPENAI_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages.map(m => ({ role: m.type === "user" ? "user" : "assistant", content: m.content })),
            { role: "user", content: input }
          ]
        })
      });

      const data = await response.json();
      const aiResponse = await processAIResponse(data.choices[0].message.content);
      
      setMessages(prev => [...prev, {
        type: "ai",
        content: aiResponse,
        timestamp: Date.now()
      }]);

    } catch (error) {
      toast({ title: "Erro", description: "Falha na comunicação com a IA", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] border-r">
      <ChatHistory messages={messages} />
      <ChatInput
        value={input}
        onChange={setInput}
        onSubmit={handleSubmit}
        isLoading={loading}
      />
    </div>
  );
};
