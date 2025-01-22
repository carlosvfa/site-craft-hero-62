// src/services/websiteGenerator.ts
interface WebsiteConfig {
  title: string;
  primaryColor: string;
  pages: string[];
}

export const generateWebsite = (config: WebsiteConfig) => {
  const css = `:root {
    --primary: ${config.primaryColor};
    --font: 'Inter', sans-serif;
  }
  body { 
    font-family: var(--font);
    margin: 0;
    padding: 20px;
  }`;

  const html = `<!DOCTYPE html>
  <html lang="pt-BR">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.title}</title>
    <style>${css}</style>
  </head>
  <body>
    <nav style="display: flex; gap: 1rem; margin-bottom: 2rem;">
      ${config.pages.map(page => `<a href="#${page}">${page}</a>`).join('')}
    </nav>
    <div id="content"></div>
    <script src="./script.js"></script>
  </body>
  </html>`;

  return {
    "index.html": html,
    "styles.css": css,
    "script.js": "// Seu JavaScript aqui\nconsole.log('Site gerado!');"
  };
};
