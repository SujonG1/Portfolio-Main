<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Portfolio-Main — README</title>
<style>
  :root {
    --bg: #0a0e27;
    --bg-card: #12173a;
    --accent: #5eead4;
    --accent2: #818cf8;
    --text: #e5e7eb;
    --text-muted: #94a3b8;
    --border: #232a56;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    padding: 3rem 1.5rem;
    background: radial-gradient(circle at 20% 0%, #1a1f4d, var(--bg) 60%);
    color: var(--text);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    line-height: 1.6;
  }
  main {
    max-width: 720px;
    margin: 0 auto;
  }
  h1 {
    font-size: 2rem;
    margin-bottom: 0.25rem;
    background: linear-gradient(90deg, var(--accent), var(--accent2));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  .tagline {
    color: var(--text-muted);
    margin-top: 0;
    margin-bottom: 2rem;
    font-style: italic;
  }
  .badge {
    display: inline-block;
    padding: 0.25rem 0.7rem;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 600;
    background: rgba(94, 234, 212, 0.12);
    color: var(--accent);
    border: 1px solid rgba(94, 234, 212, 0.3);
    margin-bottom: 1.5rem;
  }
  h2 {
    font-size: 1.15rem;
    margin-top: 2.25rem;
    margin-bottom: 0.75rem;
    color: var(--accent2);
  }
  p { color: var(--text); }
  ul { padding-left: 1.2rem; }
  li { margin-bottom: 0.4rem; }
  a { color: var(--accent); text-decoration: none; }
  a:hover { text-decoration: underline; }
  code {
    background: var(--bg-card);
    border: 1px solid var(--border);
    padding: 0.15rem 0.4rem;
    border-radius: 4px;
    font-size: 0.85em;
    color: var(--accent);
  }
  pre {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 1rem;
    overflow-x: auto;
  }
  pre code {
    background: none;
    border: none;
    padding: 0;
    color: var(--text);
  }
  .stack {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    list-style: none;
    padding: 0;
  }
  .stack li {
    background: var(--bg-card);
    border: 1px solid var(--border);
    padding: 0.3rem 0.75rem;
    border-radius: 6px;
    font-size: 0.85rem;
    color: var(--text-muted);
  }
  footer {
    margin-top: 3rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--border);
    color: var(--text-muted);
    font-size: 0.85rem;
  }
</style>
</head>
<body>
<main>

  <span class="badge">🚧 Work in Progress</span>
  <h1>sujon.dev — Personal Portfolio</h1>
  <p class="tagline">"Bringing ideas to life."</p>

  <p>
    Source for my personal portfolio site — built to showcase projects, experiments,
    and a bit of the AI/ML + fullstack work I've been doing. Currently under active
    development, so expect things to shift around.
  </p>

  <p>
    🔗 <strong>Live:</strong>
    <a href="https://sujon-ganguly-portfolio.vercel.app" target="_blank">sujon-ganguly-portfolio.vercel.app</a>
  </p>

  <h2>Tech Stack</h2>
  <ul class="stack">
    <li>React 19</li>
    <li>TypeScript</li>
    <li>Vite</li>
    <li>Tailwind CSS 4</li>
    <li>GSAP</li>
    <li>React Router</li>
    <li>Vercel Analytics</li>
  </ul>

  <h2>Project Structure</h2>
  <pre><code>Portfolio-Main/
├─ backend/     # API / contact form logic
├─ src/         # React frontend
├─ index.html
└─ package.json</code></pre>

  <h2>Getting Started</h2>
  <pre><code>git clone https://github.com/SujonG1/Portfolio-Main.git
cd Portfolio-Main
npm install
npm run dev</code></pre>

  <h2>Roadmap</h2>
  <ul>
    <li>Finish Projects, Lab, and Achievements sections</li>
    <li>Wire up contact form to backend</li>
    <li>Polish animation timing</li>
    <li>Accessibility + responsive pass</li>
  </ul>

  <footer>
    Made by Sujon Ganguly with curiosity &amp; chai — 2026
  </footer>

</main>
</body>
</html>
