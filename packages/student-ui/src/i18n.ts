export type Lang = "it" | "en";

const translations = {
  // Header
  securityLab: { it: "Laboratorio Sicurezza", en: "Security Lab" },
  challenges: { it: "Sfide", en: "Challenges" },
  settings: { it: "Impostazioni", en: "Settings" },

  // ChallengeList
  challengesTitle: { it: "Sfide", en: "Challenges" },
  challengesSubtitle: {
    it: "Seleziona una vulnerabilità da esplorare. Ogni sfida gira su un'app vulnerabile creata appositamente.",
    en: "Select a vulnerability to explore. Each challenge runs on a purpose-built vulnerable app.",
  },
  loadingChallenges: { it: "Caricamento sfide...", en: "Loading challenges..." },
  error: { it: "Errore", en: "Error" },

  // Difficulty
  easy: { it: "facile", en: "easy" },
  medium: { it: "medio", en: "medium" },
  hard: { it: "difficile", en: "hard" },

  // ChallengeSession
  chooseMode: { it: "Scegli modalità", en: "Choose Mode" },
  watchDemo: { it: "Guarda Demo IA", en: "Watch AI Demo" },
  watchDemoDesc: {
    it: "L'IA spiega l'exploit passo per passo. Provalo nell'iframe!",
    en: "The AI explains the exploit step-by-step. Try it yourself in the iframe!",
  },
  practiceMode: { it: "Modalità Pratica", en: "Practice Mode" },
  practiceModeDesc: {
    it: "Prova a sfruttare la vulnerabilità da solo con suggerimenti IA",
    en: "Try to exploit the vulnerability yourself with AI hints",
  },
  start: { it: "Avvia", en: "Start" },
  startingSession: { it: "Avvio sessione...", en: "Starting session..." },
  endSession: { it: "Termina Sessione", en: "End Session" },
  modeLabel: { it: "Modalità", en: "Mode" },
  aiDemo: { it: "Demo IA", en: "AI Demo" },
  practice: { it: "Pratica", en: "Practice" },
  followSteps: {
    it: "Segui i passaggi e provali nell'app qui sotto",
    en: "Follow the steps and try them in the app below",
  },

  // ExplanationPanel
  aiWalkthrough: { it: "Guida IA", en: "AI Walkthrough" },
  practiceModeTitle: { it: "Modalità Pratica", en: "Practice Mode" },
  stepOf: { it: "Passo", en: "Step" },
  of: { it: "di", en: "of" },
  followInIframe: { it: "— segui nell'iframe", en: "— follow along in the iframe" },
  tryExploit: {
    it: "Prova l'exploit nell'iframe. Chiedi suggerimenti!",
    en: "Try the exploit in the iframe. Ask for hints!",
  },
  practiceInstructions: {
    it: "L'app vulnerabile è caricata a sinistra. Prova a trovare e sfruttare la vulnerabilità!",
    en: "The vulnerable app is loaded on the left. Try to find and exploit the vulnerability!",
  },
  useHintButton: {
    it: "Usa il pulsante suggerimento qui sotto se sei bloccato.",
    en: "Use the hint button below if you get stuck.",
  },
  previous: { it: "Precedente", en: "Previous" },
  next: { it: "Successivo", en: "Next" },
  askHint: { it: "Chiedi un suggerimento...", en: "Ask for a hint..." },
  hint: { it: "Suggerimento", en: "Hint" },
  hintFailed: { it: "Errore suggerimento: ", en: "Failed to get hint: " },

  // Action labels
  navigate: { it: "Naviga", en: "Navigate" },
  click: { it: "Clicca", en: "Click" },
  type: { it: "Digita", en: "Type" },
  observe: { it: "Osserva", en: "Observe" },
  screenshot: { it: "Screenshot", en: "Screenshot" },

  // BrowserView
  selectChallenge: { it: "Seleziona una sfida per iniziare", en: "Select a challenge to begin" },
  appWillAppear: { it: "L'app vulnerabile apparirà qui", en: "The vulnerable app will appear here" },

  // ApiKeyBanner
  warning: { it: "Attenzione", en: "Warning" },
  noApiKey: {
    it: "Nessuna API key Gemini configurata. Contattare l'amministratore.",
    en: "No Gemini API key configured. Contact the administrator.",
  },
  geminiApiKey: { it: "Chiave API Google Gemini", en: "Google Gemini API Key" },
  active: { it: "Attiva", en: "Active" },
  notConfigured: {
    it: "Non configurata. La key va impostata come variabile d'ambiente",
    en: "Not configured. The key must be set as environment variable",
  },
  onVercel: { it: "su Vercel.", en: "on Vercel." },

  // Challenge descriptions (Italian)
  "desc.xss": {
    it: "Inietta JavaScript in un forum con vulnerabilità XSS riflesse e memorizzate.",
    en: "Inject JavaScript into a forum with reflected and stored XSS vulnerabilities.",
  },
  "desc.sqli": {
    it: "Bypassa l'autenticazione ed estrai dati tramite SQL injection.",
    en: "Bypass authentication and extract data through SQL injection.",
  },
  "desc.csrf": {
    it: "Forgia richieste cross-site per trasferire fondi senza protezione CSRF.",
    en: "Forge cross-site requests to transfer funds without CSRF protection.",
  },
  "desc.cmdi": {
    it: "Sfrutta un'utilità ping che passa l'input utente direttamente a un comando shell.",
    en: "Exploit a ping utility that passes user input directly to a shell command.",
  },
  "desc.idor": {
    it: "Accedi ai profili di altri utenti manipolando identificatori prevedibili.",
    en: "Access other users' profiles by manipulating predictable object identifiers.",
  },
  "desc.broken-auth": {
    it: "Forgia token di sessione per impersonare l'utente amministratore.",
    en: "Forge session tokens to impersonate the admin user.",
  },
  "desc.path-traversal": {
    it: "Esci dalla directory dei file e leggi file sensibili dal server.",
    en: "Escape the file directory and read sensitive files from the server.",
  },
} as const;

type TranslationKey = keyof typeof translations;

export function t(key: TranslationKey, lang: Lang): string {
  return translations[key]?.[lang] || translations[key]?.["en"] || key;
}

const LANG_STORAGE_KEY = "bounter_lang";

export function getStoredLang(): Lang {
  return (localStorage.getItem(LANG_STORAGE_KEY) as Lang) || "it";
}

export function setStoredLang(lang: Lang): void {
  localStorage.setItem(LANG_STORAGE_KEY, lang);
}
