import { Octokit } from "@octokit/rest";
import { supabase } from "@/integrations/supabase/client";

export const createGithubRepository = async (name: string, description?: string) => {
  const octokit = new Octokit({
    auth: import.meta.env.VITE_GITHUB_TOKEN,
  });

  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("User not authenticated");
  }

  const response = await octokit.repos.createForAuthenticatedUser({
    name,
    description: description || "Repositório criado pelo Construtor de Sites AI",
    private: false,
  });

  await supabase.from("github_repositories").insert({
    user_id: user.id,
    repo_name: name,
    repo_url: response.data.html_url,
  });

  return response.data;
};