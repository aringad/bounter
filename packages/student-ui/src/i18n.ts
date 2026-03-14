export type Lang = "it" | "en";

const translations = {
  // Header
  securityLab: { it: "Laboratorio Sicurezza", en: "Security Lab" },
  challenges: { it: "Sfide", en: "Challenges" },
  settings: { it: "Impostazioni", en: "Settings" },
  logout: { it: "Esci", en: "Logout" },
  back: { it: "Indietro", en: "Back" },

  // ChallengeList sections
  generalSection: { it: "Sicurezza Generale", en: "General Security" },
  generalSubtitle: {
    it: "Quiz interattivi per imparare le basi della sicurezza informatica. Nessuna conoscenza tecnica richiesta.",
    en: "Interactive quizzes to learn cybersecurity basics. No technical knowledge required.",
  },
  networkingSection: { it: "Reti e Infrastruttura", en: "Networking & Infrastructure" },
  networkingSubtitle: {
    it: "Dispositivi, cablaggio, subnetting, VLAN, DHCP e NAT. Esercizi pratici per system integrator.",
    en: "Devices, cabling, subnetting, VLANs, DHCP and NAT. Hands-on exercises for system integrators.",
  },
  dnsSection: { it: "Domain Name System", en: "Domain Name System" },
  dnsSubtitle: {
    it: "Risoluzione DNS, record, sicurezza email (SPF/DKIM/DMARC), attacchi e troubleshooting.",
    en: "DNS resolution, records, email security (SPF/DKIM/DMARC), attacks and troubleshooting.",
  },
  tcpUdpSection: { it: "TCP, UDP e Porte", en: "TCP, UDP & Ports" },
  tcpUdpSubtitle: {
    it: "Protocolli di trasporto, handshake, porte well-known, firewall e analisi connessioni.",
    en: "Transport protocols, handshake, well-known ports, firewalls and connection analysis.",
  },
  technicalSection: { it: "Cybersecurity Hands-On", en: "Cybersecurity Hands-On" },
  technicalSubtitle: {
    it: "Esplora le vulnerabilità OWASP Top 10 su app vulnerabili con supporto IA.",
    en: "Explore OWASP Top 10 vulnerabilities on vulnerable apps with AI support.",
  },
  loadingChallenges: { it: "Caricamento sfide...", en: "Loading challenges..." },
  error: { it: "Errore", en: "Error" },

  // Difficulty
  beginner: { it: "fondamenti", en: "fundamentals" },
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
  startQuiz: { it: "Inizia Quiz", en: "Start Quiz" },
  endSession: { it: "Termina Sessione", en: "End Session" },
  closeQuiz: { it: "Chiudi Quiz", en: "Close Quiz" },
  modeLabel: { it: "Modalità", en: "Mode" },
  aiDemo: { it: "Demo IA", en: "AI Demo" },
  practice: { it: "Pratica", en: "Practice" },
  quiz: { it: "Quiz interattivo", en: "Interactive quiz" },
  followSteps: {
    it: "Segui i passaggi e provali nell'app qui sotto",
    en: "Follow the steps and try them in the app below",
  },
  quizInstructions: {
    it: "Rispondi alle domande nel pannello a sinistra",
    en: "Answer the questions in the left panel",
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

  // Challenge descriptions - General
  "desc.phishing": {
    it: "Analizza email sospette e impara a distinguere i messaggi di phishing da quelli legittimi.",
    en: "Analyze suspicious emails and learn to distinguish phishing messages from legitimate ones.",
  },
  "desc.sender": {
    it: "Impara a verificare l'autenticità dei mittenti email analizzando domini e indirizzi.",
    en: "Learn to verify email sender authenticity by analyzing domains and addresses.",
  },
  "desc.passwords": {
    it: "Scopri cosa rende una password sicura e testa la forza delle tue password.",
    en: "Discover what makes a password secure and test the strength of your passwords.",
  },
  "desc.suspicious-urls": {
    it: "Impara a riconoscere link pericolosi prima di cliccarci sopra.",
    en: "Learn to recognize dangerous links before clicking on them.",
  },
  "desc.social-engineering": {
    it: "Riconosci i tentativi di manipolazione e impara a difenderti dal social engineering.",
    en: "Recognize manipulation attempts and learn to defend against social engineering.",
  },
  "desc.permissions": {
    it: "Valuta quali permessi sono ragionevoli per un'app e quali sono sospetti.",
    en: "Evaluate which app permissions are reasonable and which are suspicious.",
  },
  "desc.public-wifi": {
    it: "Impara i rischi delle reti Wi-Fi pubbliche e come proteggerti.",
    en: "Learn the risks of public Wi-Fi networks and how to protect yourself.",
  },
  "desc.backup": {
    it: "Conosci le buone pratiche per aggiornamenti, backup e protezione dai ransomware.",
    en: "Learn best practices for updates, backups, and ransomware protection.",
  },
  "desc.fake-notifications": {
    it: "Impara a distinguere le notifiche del browser legittime da quelle fasulle usate per truffe e malware.",
    en: "Learn to distinguish legitimate browser notifications from fake ones used for scams and malware.",
  },
  "desc.qr-codes": {
    it: "Impara a riconoscere QR Code truffa e a proteggerti dal quishing.",
    en: "Learn to recognize scam QR codes and protect yourself from quishing.",
  },

  // Challenge descriptions - Networking
  "desc.net-devices": {
    it: "Riconosci hub, switch, router e access point e scegli il dispositivo giusto per ogni scenario.",
    en: "Identify hubs, switches, routers and access points and choose the right device for each scenario.",
  },
  "desc.net-cabling": {
    it: "Scegli il cavo di rete corretto in base a distanza, velocità e ambiente.",
    en: "Choose the right network cable based on distance, speed and environment.",
  },
  "desc.net-subnetting": {
    it: "Calcola network address, broadcast, range host e subnet mask a partire da IP e CIDR.",
    en: "Calculate network address, broadcast, host range and subnet mask from IP and CIDR.",
  },
  "desc.net-vlan": {
    it: "Configura le VLAN assegnando porte a reti logiche separate su uno switch.",
    en: "Configure VLANs by assigning ports to separate logical networks on a switch.",
  },
  "desc.net-dhcp": {
    it: "Comprendi il processo Discover-Offer-Request-Acknowledge e le opzioni DHCP.",
    en: "Understand the Discover-Offer-Request-Acknowledge process and DHCP options.",
  },
  "desc.net-nat": {
    it: "Comprendi come NAT e PAT traducono gli indirizzi IP interni verso l'esterno.",
    en: "Understand how NAT and PAT translate internal IP addresses to external ones.",
  },
  // Challenge descriptions - DNS
  "desc.dns-resolution": {
    it: "Segui passo passo una query DNS dalla richiesta alla risposta.",
    en: "Follow a DNS query step by step from request to response.",
  },
  "desc.dns-records": {
    it: "Associa ogni tipo di record DNS (A, AAAA, CNAME, MX, TXT, SRV) al suo utilizzo.",
    en: "Match each DNS record type (A, AAAA, CNAME, MX, TXT, SRV) to its use case.",
  },
  "desc.dns-dig": {
    it: "Interpreta l'output del comando dig identificando record, TTL e sezioni.",
    en: "Interpret dig command output identifying records, TTL and sections.",
  },
  "desc.dns-email-auth": {
    it: "Configura i record TXT per proteggere il dominio dallo spoofing email.",
    en: "Configure TXT records to protect your domain from email spoofing.",
  },
  "desc.dns-attacks": {
    it: "Identifica gli attacchi DNS: cache poisoning, hijacking, typosquatting e tunneling.",
    en: "Identify DNS attacks: cache poisoning, hijacking, typosquatting and tunneling.",
  },
  "desc.dns-troubleshooting": {
    it: "Risolvi problemi di rete seguendo un metodo diagnostico step-by-step.",
    en: "Troubleshoot network issues following a step-by-step diagnostic method.",
  },
  // Challenge descriptions - TCP/UDP
  "desc.tcp-handshake": {
    it: "Completa la sequenza SYN, SYN-ACK, ACK con i numeri di sequenza corretti.",
    en: "Complete the SYN, SYN-ACK, ACK sequence with the correct sequence numbers.",
  },
  "desc.tcp-vs-udp": {
    it: "Scegli il protocollo di trasporto corretto per ogni servizio e applicazione.",
    en: "Choose the correct transport protocol for each service and application.",
  },
  "desc.tcp-ports": {
    it: "Associa i servizi alle porte well-known: SSH, HTTP, HTTPS, SMTP, RDP, SMB e altre.",
    en: "Match services to well-known ports: SSH, HTTP, HTTPS, SMTP, RDP, SMB and more.",
  },
  "desc.tcp-segment": {
    it: "Analizza un header TCP campo per campo: flag, window size, sequence number.",
    en: "Analyze a TCP header field by field: flags, window size, sequence number.",
  },
  "desc.tcp-firewall": {
    it: "Scrivi regole firewall per filtrare traffico in base a porta, protocollo e direzione.",
    en: "Write firewall rules to filter traffic based on port, protocol and direction.",
  },
  "desc.tcp-netstat": {
    it: "Interpreta l'output di netstat/ss per identificare connessioni sospette.",
    en: "Interpret netstat/ss output to identify suspicious connections.",
  },

  // Challenge descriptions - Technical
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
