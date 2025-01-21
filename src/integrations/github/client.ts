import { supabase } from "@/integrations/supabase/client";

interface CreateRepoParams {
  name: string;
  description?: string;
  private?: boolean;
}

export const createGithubRepository = async (params: CreateRepoParams) => {
  try {
    const { data: { GITHUB_ACCESS_TOKEN }, error: secretError } = await supabase
      .functions.invoke('get-secret', {
        body: { name: 'GITHUB_ACCESS_TOKEN' }
      });

    if (secretError) throw new Error('Failed to get GitHub token');

    const response = await fetch('https://api.github.com/user/repos', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GITHUB_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: params.name,
        description: params.description,
        private: params.private ?? false,
        auto_init: true,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create repository');
    }

    const repo = await response.json();

    // Get the current user's ID
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error('Failed to get user');

    // Save repository info in Supabase with user_id
    const { error: dbError } = await supabase
      .from('github_repositories')
      .insert({
        repo_name: repo.name,
        repo_url: repo.html_url,
        user_id: user.id
      });

    if (dbError) throw new Error('Failed to save repository info');

    return repo;
  } catch (error) {
    console.error('Error creating GitHub repository:', error);
    throw error;
  }
};

export const listUserRepositories = async () => {
  try {
    const { data, error } = await supabase
      .from('github_repositories')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error listing repositories:', error);
    throw error;
  }
};