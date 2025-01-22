// src/services/github.ts
import { Octokit } from "@octokit/rest"; // Corrigir import (Octokit maiúsculo)
import { supabase } from "@/integrations/supabase/client";

export const createGithubRepository = async (name: string, description?: string) => {
  const octokit = new Octokit({ // Corrigir instanciação
    auth: import.meta.env.VITE_GITHUB_TOKEN // Corrigir nome da variável
  });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Usuário não autenticado");

  const response = await octokit.repos.createForAuthenticatedUser({
    name,
    description: description || "Repositório criado pelo Construtor de Sites AI",
    private: false,
    auto_init: true // Adicionar inicialização
  });

  // Mantenha o registro no Supabase
  await supabase.from("github_repositories").insert({
    user_id: user.id,
    repo_name: name,
    repo_url: response.data.html_url,
  });

  return {
    name: response.data.name,
    url: response.data.html_url,
    fullData: response.data // Mantenha compatibilidade
  };
};

// Adicionar nova função (não existia antes)
export const pushWebsiteFiles = async (repo: string, files: Record<string, string>) => {
  const octokit = new Octokit({ 
    auth: import.meta.env.VITE_GITHUB_TOKEN 
  });

  for (const [path, content] of Object.entries(files)) {
    await octokit.repos.createOrUpdateFileContents({
      owner: import.meta.env.VITE_GITHUB_USER,
      repo,
      path,
      message: "Commit automático via Construtor de Sites AI",
      content: btoa(content),
    });
  }
};
