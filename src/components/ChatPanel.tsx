import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatHistory } from "./chat/ChatHistory";
import { ChatInput } from "./chat/ChatInput";
import { Message } from "@/types/chat";
import { createGithubRepository } from "@/services/github";

export const ChatPanel = () => {
  const [entrada, setEntrada] = useState("");
  const [estaCarregando, setEstaCarregando] = useState(false);
  const { toast } = useToast();
  const [mensagens, setMensagens] = useState<Message[]>(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    return savedMessages
      ? JSON.parse(savedMessages)
      : [
          {
            type: "ai",
            content:
              "Olá! Eu sou BOB, seu assistente de IA para criar aplicativos e sites. Posso ajudar você a criar e gerenciar repositórios no GitHub. Diga-me o que você precisa!",
            timestamp: Date.now(),
          },
        ];
  });

  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(mensagens));
  }, [mensagens]);

  const handleCreateRepository = async (repoName: string, description?: string) => {
    try {
      const data = await createGithubRepository(repoName, description);
      toast({
        title: "Sucesso",
        description: `Repositório ${data.name} criado com sucesso! Link: ${data.html_url}`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível criar o repositório. Verifique suas configurações e tente novamente.",
        variant: "destructive",
      });
      console.error("Erro no handleCreateRepository:", error);
    }
  };

  const enviarMensagem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!entrada.trim() || estaCarregando) return;

    const mensagemDoUsuario = entrada.trim();
    setEntrada("");

    const novaMensagemUsuario: Message = {
      type: "user",
      content: mensagemDoUsuario,
      timestamp: Date.now(),
    };

    setMensagens((prev) => [...prev, novaMensagemUsuario]);
    setEstaCarregando(true);

    try {
      const resposta = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content:
                "Você é BOB, um assistente de IA dedicado ao desenvolvimento de aplicativos e sites profissionais. Você pode criar e gerenciar repositórios no GitHub. Quando o usuário pedir para criar um repositório, extraia o nome e a descrição da mensagem e use a função handleCreateRepository.",
            },
            ...mensagens.map((msg) => ({
              role: msg.type === "user" ? "user" : "assistant",
              content: msg.content,
            })),
            { role: "user", content: mensagemDoUsuario },
          ],
        }),
      });

      if (!resposta.ok) {
        throw new Error("Falha ao obter resposta da IA");
      }

      const dados = await resposta.json();
      const respostaDaIA = dados.choices[0].message.content;

      if (
        mensagemDoUsuario.toLowerCase().includes("criar repositório") ||
        mensagemDoUsuario.toLowerCase().includes("criar repo")
      ) {
        const repoName = mensagemDoUsuario.match(/repositório\s+([a-zA-Z0-9-_]+)/i)?.[1] ||
                       mensagemDoUsuario.match(/repo\s+([a-zA-Z0-9-_]+)/i)?.[1];
        const repoDescription = mensagemDoUsuario.match(/descrição\s+(.+)/i)?.[1];

        if (repoName) {
          await handleCreateRepository(repoName, repoDescription);
        } else {
          setMensagens((prev) => [
            ...prev,
            {
              type: "ai",
              content: "Por favor, forneça um nome válido para o repositório.",
              timestamp: Date.now(),
            },
          ]);
        }
      }

      const novaMensagemIA: Message = {
        type: "ai",
        content: respostaDaIA,
        timestamp: Date.now(),
      };

      setMensagens((prev) => [...prev, novaMensagemIA]);
    } catch (erro) {
      toast({
        title: "Erro",
        description: "Não foi possível obter resposta da IA. Tente novamente.",
        variant: "destructive",
      });
      console.error("Erro na resposta da IA:", erro);
    } finally {
      setEstaCarregando(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 border-r border-gray-200">
      <Tabs defaultValue="chat" className="flex flex-col h-full">
        <TabsList className="justify-start border-b border-gray-200 px-4">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="flex-1 flex flex-col">
          <ChatHistory messages={mensagens} />
          <ChatInput
            value={entrada}
            onChange={setEntrada}
            onSubmit={enviarMensagem}
            isLoading={estaCarregando}
          />
        </TabsContent>

        <TabsContent value="history" className="flex-1 p-4">
          <div className="text-gray-500 text-center">
            Seu histórico de chat aparecerá aqui
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};