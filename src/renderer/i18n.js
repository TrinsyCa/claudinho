// Languages. The app is written in Portuguese and every Portuguese string is
// its own key: t("Nova conversa") hands it back in the chosen language, or as
// it is when there's no translation yet. Values can carry {name} slots:
// t("{n} imagens", { n: 3 }). The dictionaries live in i18n/*.js, one per
// part of the app, and the static HTML is translated by i18n-aplica.js.
// The choice is kept in localStorage (read synchronously at boot) and in the
// main process's config, which uses it for its own dialogs and prompts.

const I18N = (() => {
  const IDIOMAS = {
    pt: { nome: "Português", locale: "pt-BR" },
    en: { nome: "English", locale: "en-US" },
    tr: { nome: "Türkçe", locale: "tr-TR" },
  };
  const CHAVE = "claudinho.idioma";
  const detecta = () => { const l = (navigator.language || "").toLowerCase(); return l.startsWith("tr") ? "tr" : l.startsWith("pt") ? "pt" : "en"; };
  let idioma = null;
  try { idioma = localStorage.getItem(CHAVE); } catch {}
  if (!IDIOMAS[idioma]) idioma = detecta();
  const DIC = { en: {}, tr: {} };
  const preenche = (s, v) => (v ? s.replace(/\{(\w+)\}/g, (m, k) => (k in v ? v[k] : m)) : s);
  const t = (pt, v) => preenche(idioma === "pt" ? pt : DIC[idioma][pt] ?? pt, v);

  // Text nodes and the attributes people read; whitespace around the text is kept.
  const ATRIBUTOS = ["title", "placeholder", "aria-label", "alt"];
  const troca = (s) => { const m = /^(\s*)([\s\S]*?)(\s*)$/.exec(s); const novo = m[2] && t(m[2]); return novo && novo !== m[2] ? m[1] + novo + m[3] : null; };
  function traduz(raiz) {
    if (idioma === "pt" || !raiz) return;
    const w = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT);
    for (let n; (n = w.nextNode()); ) { const novo = troca(n.nodeValue); if (novo) n.nodeValue = novo; }
    const els = raiz.querySelectorAll ? [raiz, ...raiz.querySelectorAll(ATRIBUTOS.map((a) => `[${a}]`).join(","))] : [];
    for (const el of els) for (const a of ATRIBUTOS) { const v = el.getAttribute?.(a); const novo = v && troca(v); if (novo) el.setAttribute(a, novo); }
  }

  return {
    IDIOMAS, t, traduz,
    get idioma() { return idioma; },
    get locale() { return IDIOMAS[idioma].locale; },
    // dic: { en: { "pt string": "english" }, tr: { ... } }
    add(dic) { for (const l in DIC) Object.assign(DIC[l], dic[l]); },
    async muda(novo) {
      if (!IDIOMAS[novo] || novo === idioma) return;
      try { localStorage.setItem(CHAVE, novo); } catch {}
      try { await vivo.config({ idioma: novo }); } catch {}
      location.reload();
    },
  };
})();
const t = I18N.t;
