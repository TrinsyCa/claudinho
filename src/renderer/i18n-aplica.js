// Runs after the dictionaries and before the rest of the app: the static HTML
// in index.html comes up in the chosen language, and the main process learns
// the language the first time (it may have been picked from the system's).
document.documentElement.lang = I18N.locale;
I18N.traduz(document.body);
document.title = t(document.title);
// (in the browser-only demo there's no main process: vivo comes later, from simulador.js)
if (window.vivo) vivo.estado().then((e) => { if (e && e.idioma !== I18N.idioma) vivo.config({ idioma: I18N.idioma }); }).catch(() => {});
