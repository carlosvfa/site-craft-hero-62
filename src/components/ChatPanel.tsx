import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  type: "ai" | "user";
  content: string;
}

export const ChatPanel = () => {
  const [entrada, setEntrada] = useState("");
  const [estaCarregando, setEstaCarregando] = useState(false);
  const { toast } = useToast();
  const [mensagens, setMensagens] = useState<Message[]>([
    {
      type: "ai",
      content: "Olá! Eu sou BOB, seu assistente de IA para criar aplicativos e sites. Diga-me o que você precisa, e eu cuidarei do resto!",
    },
  ]);

  const enviarMensagem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!entrada.trim() || estaCarregando) return;

    const mensagemDoUsuario = entrada.trim();
    setEntrada("");
    setMensagens((prev) => [...prev, { type: "user", content: mensagemDoUsuario }]);
    setEstaCarregando(true);

    try {
      const resposta = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: "Você é BOB, um assistente de IA dedicado ao desenvolvimento de aplicativos e sites profissionais. Você ajuda os usuários fornecendo orientações claras, passo a passo, e explicações técnicas.",
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

      setMensagens((prev) => [...prev, { type: "ai", content: respostaDaIA }]);
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
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
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
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    {mensagem.content}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <form onSubmit={enviarMensagem} className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={entrada}
                onChange={(e) => setEntrada(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                disabled={estaCarregando}
              />
              <Button 
                type="submit" 
                className="bg-gray-900 hover:bg-gray-800"
                disabled={estaCarregando}
              >
                <Send className="h-4 w-4" />
              </Button>
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