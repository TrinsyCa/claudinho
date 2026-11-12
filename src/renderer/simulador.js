// Outside Electron (the page opened in a plain browser) there is no bridge:
// this stands in for it with a canned reply, so the interface can be looked
// at and tried without Claude Code. Inside the app `window.vivo` already
// exists and this does nothing.
if (!window.vivo) {
  const ouvintes = [];
  const emite = (ev) => ouvintes.forEach((f) => f(ev));
  const espera = (ms) => new Promise((r) => setTimeout(r, ms));
  const resposta = t("Claro! Olhei o projeto e encontrei **três pontos** pra melhorar:\n\n1. O `index.html` carrega as fontes sem `preconnect`.\n2. As imagens não têm `loading=\"lazy\"`.\n3. Falta um `alt` em duas imagens.\n\n```js\nconst img = document.querySelector('img');\nimg.loading = 'lazy';\n```\n\nQuer que eu aplique as correções?");

  async function simula(texto) {
    emite({ tipo: "inicio" });
    await espera(600);
    if (/pergunta/i.test(texto)) {
      emite({ tipo: "pergunta", id: "q1", perguntas: [{ header: t("Estilo"), question: t("Qual estilo você prefere para a página?"), multiSelect: false, options: [{ label: t("Minimalista"), description: t("Pouca cor, muito espaço") }, { label: t("Colorido"), description: t("Gradientes e ilustrações") }] }] });
      return;
    } else if (/gato|cat|oceano|fundo|biblioteca/i.test(texto)) {
      emite({ tipo: "ferramenta", id: "b1", nome: "mcp__claudinho__buscar_fundo", entrada: { busca: "ocean night" } });
      await espera(300);
      emite({ tipo: "ferramenta_fim", id: "b1", erro: false, saida: "moonlit-sea — Moonlit Sea (landscapes): A full moon over a calm night sea." });
      emite({ tipo: "texto_inicio" });
      for (const p of t("Achei uma na biblioteca que combina: um mar noturno com lua cheia.").split(/(?<= )/)) { emite({ tipo: "texto", delta: p }); await espera(25); }
      emite({ tipo: "ferramenta", id: "b2", nome: "mcp__claudinho__sugerir_fundo", entrada: { peca: "moonlit-sea" } });
      emite({ tipo: "cartao_arte", chave: "magia:moonlit-sea" });
      emite({ tipo: "ferramenta_fim", id: "b2", erro: false, saida: t("Cartão mostrado.") });
    } else if (/tema|lagoa|honu|lareira|sakura/i.test(texto)) {
      emite({ tipo: "texto_inicio" });
      for (const p of t("Aqui está um tema pra este chat. Ele troca o fundo e deixa os painéis de vidro fosco.").split(/(?<= )/)) { emite({ tipo: "texto", delta: p }); await espera(25); }
      emite({ tipo: "ferramenta", id: "t1", nome: "mcp__claudinho__sugerir_tema", entrada: { tema: "lagoon" } });
      emite({ tipo: "cartao_tema", tema: "lagoon" });
      emite({ tipo: "ferramenta_fim", id: "t1", erro: false, saida: t("Cartão do tema Honu Lagoon mostrado.") });
    } else {
      emite({ tipo: "raciocinio_inicio" });
      for (const p of t("O usuário quer melhorias no projeto. Primeiro vou listar os HTML, depois ler o index e ver o que dá pra melhorar em desempenho e acessibilidade.").split(/(?<= )/)) { emite({ tipo: "raciocinio", delta: p }); await espera(30); }
      emite({ tipo: "ferramenta", id: "td", nome: "TodoWrite", entrada: { todos: [{ content: t("Ler o index.html"), status: "completed" }, { content: t("Achar problemas"), activeForm: t("Achando problemas"), status: "in_progress" }, { content: t("Propor correções"), status: "pending" }] } });
      emite({ tipo: "ferramenta", id: "t2", nome: "Glob", entrada: { pattern: "**/*.html" } });
      await espera(400);
      emite({ tipo: "ferramenta_fim", id: "t2", erro: false, saida: "index.html\nsobre.html" });
      emite({ tipo: "ferramenta", id: "t3", nome: "Read", entrada: { file_path: "C:\\projeto\\index.html" } });
      await espera(400);
      emite({ tipo: "ferramenta_fim", id: "t3", erro: false, saida: "<!doctype html>…" });
      emite({ tipo: "texto_inicio" });
      for (const p of resposta.split(/(?<= )/)) { emite({ tipo: "texto", delta: p }); await espera(18); }
      emite({ tipo: "ferramenta", id: "e1", nome: "Edit", entrada: { file_path: "C:\\projeto\\index.html", old_string: '<img src="a.png">\n<p>Oi</p>', new_string: '<img src="a.png" alt="Logo" loading="lazy">\n<p>Oi</p>' } });
      emite({ tipo: "ferramenta_fim", id: "e1", erro: false, saida: "ok" });
      emite({ tipo: "marca", uuid: "u1" });
      emite({ tipo: "uso", contexto: 41200, janela: 200000, saida: 860 });
      emite({ tipo: "permissao", id: "p1", ferramenta: "Edit", entrada: { file_path: "C:\\projeto\\index.html", old_string: "<img src=\"a.png\">", new_string: "<img src=\"a.png\" alt=\"Logo\" loading=\"lazy\">" }, motivo: null, temSempre: true });
    }
    emite({ tipo: "fim", ok: true, duracao: 4200, detalhe: "success" });
    emite({ tipo: "parado" });
  }

  window.vivo = {
    estado: async () => ({ cwd: "C:\\Users\\voce\\projetos\\exemplo", model: "", modo: "default", sessionId: null }),
    enviar: async (t, anexos) => { if (anexos?.length) console.log("[simulador] anexos", anexos.map((a) => a.nome)); simula(t); return true; },
    parar: async () => {},
    permissao: async () => {},
    nova: async () => true,
    sessoes: async (o) => [
      ...(o?.todas ? [{ id: "x", titulo: t("Refatorar API de pagamentos"), quando: Date.now() - 7200e3, cwd: "C:\Users\voce\projetos\loja", projeto: "loja" }] : []),
      { id: "a", titulo: t("Landing page da padaria"), quando: Date.now() - 3600e3 },
      { id: "b", titulo: t("Corrigir bug do carrinho"), quando: Date.now() - 86400e3 },
      { id: "c", titulo: t("Temas animados do chat"), quando: Date.now() - 2 * 86400e3 },
    ],
    abrirSessao: async () => [{ papel: "eu", texto: t("oi, me ajuda com o carrinho?") }, { papel: "claude", texto: t("Claro! Qual é o problema?") }],
    pasta: async () => null,
    config: async () => ({}),
    barra: async () => {},
    link: async () => {},
    comandos: async () => { await espera(500); return [
      { nome: "compact", descricao: t("Resume a conversa para liberar contexto"), dica: t("[instruções]") },
      { nome: "review", descricao: t("Revisa um pull request"), dica: "" },
      { nome: "init", descricao: t("Cria um CLAUDE.md com a documentação do projeto"), dica: "" },
      { nome: "security-review", descricao: t("Revisão de segurança das mudanças pendentes"), dica: "" },
    ]; },
    anexar: async () => ["C:\Users\voce\projetos\exemplo\notas.md"],
    caminhoDe: () => "",
    motionImportar: async () => null,
    motionLista: async () => [],
    motionLer: async () => null,
    motionApagar: async () => true,
    ramificar: async (id, uuid, titulo) => ({ id: "r" + Date.now(), titulo }),
    exportar: async () => "C:\Users\voce\Documents\conversa.md",
    buscar: async (t) => (/carrinho/i.test(t) ? [] : [{ id: "c", trecho: I18N.t("…o tema {busca} ficou ótimo no chat…", { busca: t }) }]),
    focar: async () => {},
    janelaNova: async () => {},
    painel: async () => ({ ambiente: { computador: "MEU-PC", pasta: "C:\Users\voce\projetos\exemplo", ramo: "main", modelo: "claude-opus-5-5" }, contexto: { total: 98000, max: 1000000, pct: 9.8, categorias: [{ nome: "Messages", tokens: 52000, tipo: "used" }, { nome: "System tools", tokens: 25500, tipo: "used" }, { nome: "MCP tools", tokens: 9000, tipo: "used" }, { nome: "System prompt", tokens: 9800, tipo: "used" }, { nome: "Skills", tokens: 1700, tipo: "used" }, { nome: "Free space", tokens: 869000, tipo: "free" }, { nome: "MCP tools (deferred)", tokens: 330000, tipo: "deferred" }] }, conectores: [{ nome: "claudinho", estado: "connected" }, { nome: "outframe-assets", estado: "connected" }, { nome: "vercel", estado: "needs-auth" }] }),
    abrirArquivo: async () => true,
    uso: async () => ({ plano: "max", disponivel: true, janelas: [{ id: "five_hour", uso: +(localStorage.getItem("simUso") || 64), renova: new Date(Date.now() + 5400e3).toISOString() }, { id: "seven_day", uso: 17, renova: new Date(Date.now() + 5 * 864e5).toISOString() }], sessao: null }),
    visual: async () => JSON.parse(localStorage.getItem("simVisual") || "{}"),
    visualSalvar: async (v) => { localStorage.setItem("simVisual", JSON.stringify(v)); return v; },
    pessoalLista: async () => [],
    pessoalImportar: async () => ({ itens: [] }),
    pessoalApagar: async () => true,
    responder: async () => { emite({ tipo: "fim", ok: true }); emite({ tipo: "parado" }); },
    desfazer: async (u, simular) => ({ canRewind: true, filesChanged: ["C:\\projeto\\index.html"], insertions: 3, deletions: 1 }),
    aoEvento: (f) => ouvintes.push(f),
  };
}
