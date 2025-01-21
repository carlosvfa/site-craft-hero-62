import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Octokit } from "@octokit/rest";

interface Message {
  type: "ai" | "user";
  content: string;
  timestamp?: number;
}

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

  const createGithubRepository = async (name: string, description?: string) => {
    const octokit = new Octokit({
      auth: import.meta.env.VITE_GITHUB_TOKEN, // Token do GitHub configurado no .env
    });

    try {
      const response = await octokit.repos.createForAuthenticatedUser({
        name,
        description: description || "Repositório criado pelo Construtor de Sites AI",
        private: false, // Altere para true se quiser repositórios privados
      });

      toast({
        title: "Sucesso",
        description: `Repositório ${response.data.name} criado com sucesso! Link: ${response.data.html_url}`,
      });

      return response.data;
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível criar o repositório. Verifique suas configurações e tente novamente.",
        variant: "destructive",
      });
      console.error("Erro ao criar repositório:", error);
      throw error;
    }
  };

  const handleCreateRepository = async (repoName: string, description?: string) => {
    try {
      await createGithubRepository(repoName, description);
    } catch (error) {
      console.error("Erro no handleCreateRepository:", error);
    }
  };

  const enviarMensagem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!entrada.trim() || estaCarregando) return;

    const mensagemDoUsuario = entrada.trim();
    setEntrada("");

    const novaMensagemUsuario = {
      type: "user" as const,
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

      // Verifica se a mensagem contém um pedido para criar um repositório
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

      const novaMensagemIA = {
        type: "ai" as const,
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
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {mensagens.map((mensagem, index) => (
                <div
                  key={index}
                  className={`flex ${
                    mensagem.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      mensagem.type === "user"
                        ? "bg-gray-900 text-white"
                        : "bg-gray-200 text-gray-900"
                    } shadow`}
                  >
                    <div>{mensagem.content}</div>
                    {mensagem.timestamp && (
                      <div
                        className={`text-xs mt-1 ${
                          mensagem.type === "user"
                            ? "text-gray-300"
                            : "text-gray-500"
                        }`}
                      >
                        {new Date(mensagem.timestamp).toLocaleTimeString()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <form onSubmit={enviarMensagem} className="p-4 border-t border-gray-200 bg-white">
            <div className="flex space-x-2">
              <input
                type="text"
                value={entrada}
                onChange={(e) => setEntrada(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                disabled={estaCarregando}
              />
              <button
                type="submit"
                className={`flex items-center justify-center px-4 py-2 font-semibold rounded-lg shadow border ${
                  estaCarregando
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
                disabled={estaCarregando}
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </form>
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
