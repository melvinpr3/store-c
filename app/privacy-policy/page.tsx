import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "../components/Logo";

export const metadata: Metadata = {
  title: "Privacy Policy | Maisonelle",
  description:
    "Informativa sulla Privacy di Maisonelle, brand di abbigliamento contemporaneo. Come raccogliamo, utilizziamo e proteggiamo i tuoi dati personali in conformità al GDPR.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FBF7F4] text-[#1A1A1A] font-sans">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-[#E8DFD6] py-4 px-6 md:px-10 flex justify-between items-center">
        <Link href="/">
          <Logo size="sm" />
        </Link>
        <Link
          href="/"
          className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-neutral-500 hover:text-neutral-900 border border-neutral-200 hover:border-neutral-400 px-3 py-1.5 rounded transition-all bg-white"
        >
          <ArrowLeft size={12} />
          Torna allo Shop
        </Link>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 md:px-10 py-16 md:py-24">
        {/* Page Title */}
        <div className="mb-12 border-b border-[#E8DFD6] pb-8">
          <span className="text-[8px] font-bold tracking-[0.3em] text-[#9A7B6F] uppercase font-sans block mb-3">
            Documento Legale
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-light text-[#1A1A1A] mb-4">
            Informativa sulla Privacy
          </h1>
          <p className="text-[11px] text-neutral-400 uppercase tracking-widest font-sans">
            Ultimo aggiornamento: 28 Giugno 2026 &nbsp;·&nbsp; Versione 1.1
            &nbsp;·&nbsp; Reg. UE 2016/679 (GDPR)
          </p>
        </div>

        {/* Intro Banner */}
        <div className="mb-12 bg-white border border-[#E8DFD6] p-6">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#9A7B6F] mb-2">
            Il tuo diritto alla privacy
          </p>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Maisonelle — brand di abbigliamento contemporaneo — si impegna a
            proteggere la tua privacy e a trattare i tuoi dati personali in modo
            trasparente, sicuro e conforme al Regolamento Generale sulla
            Protezione dei Dati (GDPR — Reg. UE 2016/679) e al D.Lgs. 196/2003
            (Codice Privacy) come modificato dal D.Lgs. 101/2018. La presente
            Informativa descrive come raccogliamo, utilizziamo e proteggiamo i
            dati personali degli utenti del nostro sito web.
          </p>
        </div>

        {/* Index */}
        <nav className="mb-12 bg-white border border-[#E8DFD6] p-6">
          <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#9A7B6F] mb-4">
            Indice
          </p>
          <ol className="space-y-1.5">
            {[
              ["1", "Titolare del Trattamento", "#priv1"],
              ["2", "Categorie di Dati Raccolti", "#priv2"],
              ["3", "Finalità e Basi Giuridiche del Trattamento", "#priv3"],
              ["4", "Modalità di Trattamento e Sicurezza", "#priv4"],
              ["5", "Comunicazione a Terzi e Responsabili del Trattamento", "#priv5"],
              ["6", "Trasferimento di Dati Extra-UE", "#priv6"],
              ["7", "Periodo di Conservazione dei Dati", "#priv7"],
              ["8", "Diritti dell'Interessato (GDPR Artt. 15–22)", "#priv8"],
              ["9", "Cookie Policy", "#priv9"],
              ["10", "Modifiche all'Informativa", "#priv10"],
              ["11", "Contatti e Reclami", "#priv11"],
            ].map(([num, title, href]) => (
              <li key={num}>
                <a
                  href={href}
                  className="flex items-center gap-3 text-[11px] text-neutral-600 hover:text-neutral-950 transition-colors group"
                >
                  <span className="text-[9px] font-bold text-[#9A7B6F] w-5 shrink-0">
                    {num}.
                  </span>
                  <span className="group-hover:underline underline-offset-2">
                    {title}
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* Articles */}
        <div className="space-y-14 text-sm leading-relaxed text-neutral-700">
          {/* Art 1 */}
          <article id="priv1" className="scroll-mt-28">
            <h2 className="text-2xl font-serif font-light text-[#1A1A1A] mb-5 pb-3 border-b border-[#E8DFD6]">
              1. Titolare del Trattamento
            </h2>
            <div className="space-y-4">
              <p>
                Il Titolare del Trattamento dei dati personali, ai sensi
                dell&apos;art. 4, n. 7 del GDPR, è il brand <strong>Maisonelle</strong>,
                marchio di abbigliamento contemporaneo per uomo e donna, gestito
                tramite il sito web <strong>maisonelle.com</strong>.
              </p>
              <div className="bg-white border border-[#E8DFD6] p-5 text-[12px] space-y-2 font-sans">
                <p>
                  <strong>Brand:</strong> Maisonelle
                </p>
                <p>
                  <strong>Sito web:</strong> maisonelle.com
                </p>
                <p>
                  <strong>Email:</strong>{" "}
                  <a href="mailto:help@maisonelle.com" className="text-[#1A1A1A] underline">help@maisonelle.com</a>
                </p>
              </div>
              <p>
                Il Titolare può essere contattato per qualsiasi questione
                relativa al trattamento dei dati personali tramite i recapiti
                indicati alla Sezione 11 della presente Informativa.
              </p>
            </div>
          </article>

          {/* Art 2 */}
          <article id="priv2" className="scroll-mt-28">
            <h2 className="text-2xl font-serif font-light text-[#1A1A1A] mb-5 pb-3 border-b border-[#E8DFD6]">
              2. Categorie di Dati Raccolti
            </h2>
            <div className="space-y-4">
              <p>
                Maisonelle raccoglie le seguenti categorie di dati personali:
              </p>

              <div className="space-y-4">
                <div className="bg-white border border-[#E8DFD6] p-5">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-neutral-500 mb-3">
                    a) Dati forniti direttamente dall&apos;utente
                  </p>
                  <ul className="space-y-1.5 text-[12px]">
                    {[
                      "Nome e cognome",
                      "Indirizzo email",
                      "Password (conservata in formato crittografato)",
                      "Indirizzo di spedizione (via, città, CAP, nazione)",
                      "Numero di telefono (ove richiesto per la consegna)",
                      "Dati di fatturazione (Partita IVA / Codice Fiscale, ove richiesto)",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#9A7B6F] shrink-0 mt-1.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white border border-[#E8DFD6] p-5">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-neutral-500 mb-3">
                    b) Dati raccolti automaticamente
                  </p>
                  <ul className="space-y-1.5 text-[12px]">
                    {[
                      "Indirizzo IP",
                      "Tipo e versione del browser",
                      "Sistema operativo",
                      "Pagine visitate e percorso di navigazione",
                      "Data e ora di accesso",
                      "URL di provenienza (referrer)",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#9A7B6F] shrink-0 mt-1.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white border border-[#E8DFD6] p-5">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-neutral-500 mb-3">
                    c) Dati relativi agli ordini e ai pagamenti
                  </p>
                  <ul className="space-y-1.5 text-[12px]">
                    {[
                      "Storico degli ordini",
                      "Importi delle transazioni",
                      "Metodi di pagamento utilizzati (non memorizziamo dati della carta di credito)",
                      "Stato degli ordini e delle spedizioni",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#9A7B6F] shrink-0 mt-1.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <p className="text-neutral-500 text-[12px] italic">
                Maisonelle non raccoglie né tratta dati sensibili (categorie
                particolari di dati ai sensi dell&apos;art. 9 GDPR) quali dati
                sulla salute, opinioni politiche, religione o origine etnica.
              </p>
            </div>
          </article>

          {/* Art 3 */}
          <article id="priv3" className="scroll-mt-28">
            <h2 className="text-2xl font-serif font-light text-[#1A1A1A] mb-5 pb-3 border-b border-[#E8DFD6]">
              3. Finalità e Basi Giuridiche del Trattamento
            </h2>
            <div className="space-y-6">
              <div className="overflow-x-auto">
                <table className="w-full text-[12px] border-collapse">
                  <thead>
                    <tr className="bg-[#1A1A1A] text-white">
                      <th className="text-left px-4 py-3 text-[9px] uppercase tracking-widest font-bold">
                        Finalità
                      </th>
                      <th className="text-left px-4 py-3 text-[9px] uppercase tracking-widest font-bold">
                        Base Giuridica
                      </th>
                      <th className="text-left px-4 py-3 text-[9px] uppercase tracking-widest font-bold hidden sm:table-cell">
                        Dati Coinvolti
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8DFD6]">
                    {[
                      [
                        "Gestione dell'account utente",
                        "Esecuzione del contratto (Art. 6.1.b GDPR)",
                        "Nome, email, password",
                      ],
                      [
                        "Elaborazione e gestione degli ordini",
                        "Esecuzione del contratto (Art. 6.1.b GDPR)",
                        "Dati personali, spedizione, pagamento",
                      ],
                      [
                        "Elaborazione dei pagamenti",
                        "Esecuzione del contratto (Art. 6.1.b GDPR)",
                        "Dati transazione (via PayPal/processore)",
                      ],
                      [
                        "Adempimenti fiscali e contabili",
                        "Obbligo legale (Art. 6.1.c GDPR)",
                        "Dati fatturazione, importi",
                      ],
                      [
                        "Assistenza clienti e gestione reclami",
                        "Legittimo interesse (Art. 6.1.f GDPR)",
                        "Dati comunicazione, ordini",
                      ],
                      [
                        "Sicurezza del sito e prevenzione frodi",
                        "Legittimo interesse (Art. 6.1.f GDPR)",
                        "IP, log di navigazione",
                      ],
                      [
                        "Invio newsletter e comunicazioni promozionali",
                        "Consenso (Art. 6.1.a GDPR)",
                        "Email, preferenze",
                      ],
                      [
                        "Analisi statistica del Sito",
                        "Legittimo interesse (Art. 6.1.f GDPR)",
                        "Dati navigazione anonimizzati",
                      ],
                    ].map(([finalita, base, dati]) => (
                      <tr
                        key={finalita}
                        className="bg-white even:bg-neutral-50/50"
                      >
                        <td className="px-4 py-3 text-neutral-800 font-medium">
                          {finalita}
                        </td>
                        <td className="px-4 py-3 text-neutral-600">{base}</td>
                        <td className="px-4 py-3 text-neutral-500 hidden sm:table-cell">
                          {dati}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p>
                Il conferimento dei dati contrassegnati come obbligatori è
                necessario per la fornitura del servizio; il mancato
                conferimento impedirà l&apos;erogazione del servizio stesso. Il
                conferimento dei dati per finalità opzionali (es. newsletter) è
                facoltativo.
              </p>
            </div>
          </article>

          {/* Art 4 */}
          <article id="priv4" className="scroll-mt-28">
            <h2 className="text-2xl font-serif font-light text-[#1A1A1A] mb-5 pb-3 border-b border-[#E8DFD6]">
              4. Modalità di Trattamento e Sicurezza
            </h2>
            <div className="space-y-4">
              <p>
                I dati personali sono trattati con strumenti automatizzati per
                il tempo strettamente necessario al conseguimento degli scopi per
                cui sono stati raccolti.
              </p>
              <p>
                <strong>4.1 Misure di sicurezza adottate:</strong>
              </p>
              <ul className="list-none space-y-2 pl-4 border-l-2 border-[#E8DFD6]">
                {[
                  "Crittografia SSL/TLS per tutte le comunicazioni tra browser e server",
                  "Crittografia delle password (hashing con algoritmi sicuri tipo bcrypt)",
                  "Accesso ai dati limitato al personale autorizzato tramite autenticazione",
                  "Backup regolari dei dati con conservazione sicura",
                  "Monitoraggio continuo per rilevare accessi non autorizzati",
                  "Aggiornamento regolare dei sistemi e delle misure di sicurezza",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[13px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#9A7B6F] shrink-0 mt-1.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <p>
                <strong>4.2 Data breach.</strong> In caso di violazione dei dati
                personali che comporti un rischio per i diritti e le libertà
                degli interessati, il Titolare notificherà l&apos;incidente
                all&apos;Autorità Garante entro 72 ore e, ove necessario,
                informerà gli interessati senza ingiustificato ritardo.
              </p>
            </div>
          </article>

          {/* Art 5 */}
          <article id="priv5" className="scroll-mt-28">
            <h2 className="text-2xl font-serif font-light text-[#1A1A1A] mb-5 pb-3 border-b border-[#E8DFD6]">
              5. Comunicazione a Terzi e Responsabili del Trattamento
            </h2>
            <div className="space-y-4">
              <p>
                I dati personali non sono venduti né ceduti a terzi per finalità
                commerciali proprie. Possono essere condivisi esclusivamente
                con i seguenti soggetti, nella misura necessaria all&apos;erogazione
                del servizio:
              </p>

              <div className="space-y-3">
                {[
                  {
                    nome: "Supabase Inc.",
                    ruolo: "Responsabile del trattamento",
                    finalita:
                      "Database e autenticazione utenti (piattaforma backend-as-a-service)",
                    sede: "USA — con garanzie adeguate (Standard Contractual Clauses)",
                  },
                  {
                    nome: "PayPal (Europe) S.à r.l.",
                    ruolo: "Titolare autonomo del trattamento",
                    finalita: "Elaborazione dei pagamenti",
                    sede: "Lussemburgo / UE",
                  },
                  {
                    nome: "Stripe, Inc. (ove applicabile)",
                    ruolo: "Titolare autonomo del trattamento",
                    finalita: "Elaborazione dei pagamenti tramite carte",
                    sede: "USA — con garanzie adeguate",
                  },
                  {
                    nome: "Corrieri e spedizionieri",
                    ruolo: "Responsabili del trattamento",
                    finalita:
                      "Consegna degli ordini (es. DHL, GLS, SDA, Poste Italiane)",
                    sede: "Italia / UE",
                  },
                  {
                    nome: "Autorità pubbliche",
                    ruolo: "Titolari autonomi",
                    finalita:
                      "Adempimenti fiscali, legali o su richiesta dell'Autorità",
                    sede: "Italia",
                  },
                ].map(({ nome, ruolo, finalita, sede }) => (
                  <div
                    key={nome}
                    className="bg-white border border-[#E8DFD6] p-4 text-[12px]"
                  >
                    <p className="font-bold text-[#1A1A1A] mb-1">{nome}</p>
                    <p className="text-neutral-500">
                      <strong>Ruolo:</strong> {ruolo}
                    </p>
                    <p className="text-neutral-500">
                      <strong>Finalità:</strong> {finalita}
                    </p>
                    <p className="text-neutral-500">
                      <strong>Sede:</strong> {sede}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </article>

          {/* Art 6 */}
          <article id="priv6" className="scroll-mt-28">
            <h2 className="text-2xl font-serif font-light text-[#1A1A1A] mb-5 pb-3 border-b border-[#E8DFD6]">
              6. Trasferimento di Dati Extra-UE
            </h2>
            <div className="space-y-4">
              <p>
                Alcuni dei nostri fornitori di servizi (in particolare Supabase
                Inc. e Stripe Inc.) hanno sede negli Stati Uniti o in paesi
                extra-SEE. Il trasferimento dei dati verso tali paesi avviene
                nel rispetto delle garanzie previste dal GDPR (Capo V), in
                particolare mediante:
              </p>
              <ul className="list-none space-y-2 pl-4 border-l-2 border-[#E8DFD6]">
                <li className="flex items-start gap-2 text-[13px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9A7B6F] shrink-0 mt-1.5" />
                  <strong>Clausole Contrattuali Standard (SCC)</strong>{" "}
                  approvate dalla Commissione Europea (Decisione 2021/914)
                </li>
                <li className="flex items-start gap-2 text-[13px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9A7B6F] shrink-0 mt-1.5" />
                  <strong>Data Privacy Framework UE-USA</strong> (ove il
                  fornitore sia certificato)
                </li>
              </ul>
              <p>
                Per ulteriori informazioni sui trasferimenti extra-UE e sulle
                garanzie adottate, contattare il Titolare ai recapiti indicati
                alla Sezione 11.
              </p>
            </div>
          </article>

          {/* Art 7 */}
          <article id="priv7" className="scroll-mt-28">
            <h2 className="text-2xl font-serif font-light text-[#1A1A1A] mb-5 pb-3 border-b border-[#E8DFD6]">
              7. Periodo di Conservazione dei Dati
            </h2>
            <div className="space-y-4">
              <p>
                I dati personali sono conservati per il tempo strettamente
                necessario alle finalità per cui sono stati raccolti, nel
                rispetto del principio di «limitazione della conservazione»
                (art. 5.1.e GDPR):
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-[12px] border-collapse">
                  <thead>
                    <tr className="bg-[#1A1A1A] text-white">
                      <th className="text-left px-4 py-3 text-[9px] uppercase tracking-widest font-bold">
                        Categoria di dati
                      </th>
                      <th className="text-left px-4 py-3 text-[9px] uppercase tracking-widest font-bold">
                        Periodo di conservazione
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8DFD6]">
                    {[
                      ["Dati account utente", "Fino alla cancellazione dell'account + 30 giorni"],
                      ["Dati ordini e transazioni", "10 anni (obblighi fiscali e contabili)"],
                      ["Log di navigazione e sicurezza", "12 mesi"],
                      ["Dati per newsletter / marketing", "Fino alla revoca del consenso"],
                      ["Cookie tecnici", "Sessione o massimo 12 mesi"],
                      ["Cookie analitici", "Massimo 13 mesi"],
                      ["Dati assistenza clienti", "3 anni dalla risoluzione"],
                    ].map(([categoria, periodo]) => (
                      <tr key={categoria} className="bg-white even:bg-neutral-50/50">
                        <td className="px-4 py-3 text-neutral-800 font-medium">
                          {categoria}
                        </td>
                        <td className="px-4 py-3 text-neutral-600">{periodo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p>
                Allo scadere del periodo di conservazione, i dati vengono
                cancellati in modo definitivo o resi anonimi.
              </p>
            </div>
          </article>

          {/* Art 8 */}
          <article id="priv8" className="scroll-mt-28">
            <h2 className="text-2xl font-serif font-light text-[#1A1A1A] mb-5 pb-3 border-b border-[#E8DFD6]">
              8. Diritti dell&apos;Interessato (GDPR Artt. 15–22)
            </h2>
            <div className="space-y-4">
              <p>
                In qualità di interessato, hai il diritto di esercitare i
                seguenti diritti nei confronti del Titolare:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    diritto: "Diritto di accesso (Art. 15)",
                    desc: "Ottenere conferma del trattamento e copia dei dati personali che ti riguardano.",
                  },
                  {
                    diritto: "Diritto di rettifica (Art. 16)",
                    desc: "Ottenere la correzione di dati inesatti o l'integrazione di dati incompleti.",
                  },
                  {
                    diritto: "Diritto alla cancellazione (Art. 17)",
                    desc: "Ottenere la cancellazione dei tuoi dati («diritto all'oblio»), nei casi previsti dalla norma.",
                  },
                  {
                    diritto: "Diritto di limitazione (Art. 18)",
                    desc: "Ottenere la limitazione del trattamento in determinate circostanze.",
                  },
                  {
                    diritto: "Diritto alla portabilità (Art. 20)",
                    desc: "Ricevere i tuoi dati in formato strutturato e leggibile da dispositivo automatico.",
                  },
                  {
                    diritto: "Diritto di opposizione (Art. 21)",
                    desc: "Opporti al trattamento per motivi di legittimo interesse, incluso il marketing diretto.",
                  },
                  {
                    diritto: "Revoca del consenso (Art. 7.3)",
                    desc: "Revocare in qualsiasi momento il consenso prestato, senza pregiudicare la liceità del trattamento precedente.",
                  },
                  {
                    diritto: "Diritto di reclamo (Art. 77)",
                    desc: "Proporre reclamo all'Autorità Garante per la protezione dei dati personali (www.garanteprivacy.it).",
                  },
                ].map(({ diritto, desc }) => (
                  <div key={diritto} className="bg-white border border-[#E8DFD6] p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#9A7B6F] mb-1.5">
                      {diritto}
                    </p>
                    <p className="text-[12px] text-neutral-600">{desc}</p>
                  </div>
                ))}
              </div>

              <p>
                Per esercitare i tuoi diritti, invia una richiesta scritta al
                Titolare tramite i recapiti indicati alla Sezione 11. Il Titolare
                risponderà entro 30 giorni dal ricevimento della richiesta (con
                possibilità di proroga di ulteriori 60 giorni in caso di
                particolare complessità).
              </p>
            </div>
          </article>

          {/* Art 9 */}
          <article id="priv9" className="scroll-mt-28">
            <h2 className="text-2xl font-serif font-light text-[#1A1A1A] mb-5 pb-3 border-b border-[#E8DFD6]">
              9. Cookie Policy
            </h2>
            <div className="space-y-4">
              <p>
                Il Sito utilizza cookie e tecnologie simili. Un cookie è un
                piccolo file di testo che viene memorizzato nel dispositivo
                dell&apos;utente quando visita un sito web.
              </p>

              <div className="space-y-3">
                <div className="bg-white border border-[#E8DFD6] p-5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A] mb-3">
                    Cookie Tecnici (Necessari) — Nessun consenso richiesto
                  </p>
                  <p className="text-[12px] text-neutral-600 mb-2">
                    Indispensabili per il funzionamento del Sito. Non possono
                    essere disabilitati:
                  </p>
                  <ul className="space-y-1.5 text-[12px]">
                    {[
                      "Cookie di sessione (autenticazione utente)",
                      "Cookie di carrello (mantenimento degli articoli nel carrello)",
                      "Cookie di sicurezza (protezione CSRF)",
                      "Cookie di preferenza lingua/regione",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#9A7B6F] shrink-0 mt-1.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white border border-[#E8DFD6] p-5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A] mb-3">
                    Cookie Analitici — Consenso richiesto
                  </p>
                  <p className="text-[12px] text-neutral-600 mb-2">
                    Utilizzati per raccogliere informazioni anonime sull&apos;uso
                    del Sito al fine di migliorare l&apos;esperienza utente:
                  </p>
                  <ul className="space-y-1.5 text-[12px]">
                    {[
                      "Pagine visitate e percorso di navigazione",
                      "Tempo trascorso sulle pagine",
                      "Fonte di traffico",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#9A7B6F] shrink-0 mt-1.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white border border-[#E8DFD6] p-5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A] mb-3">
                    Cookie di Terze Parti (Pagamenti)
                  </p>
                  <p className="text-[12px] text-neutral-600">
                    PayPal e altri processori di pagamento possono impostare
                    cookie necessari per l&apos;elaborazione sicura dei
                    pagamenti. Questi cookie sono soggetti alle rispettive
                    privacy policy di PayPal e degli altri processori.
                  </p>
                </div>
              </div>

              <p>
                <strong>Gestione dei cookie.</strong> Puoi gestire le preferenze
                sui cookie tramite le impostazioni del tuo browser. Si noti che
                la disabilitazione dei cookie tecnici può compromettere il
                corretto funzionamento del Sito. Per ulteriori informazioni sulla
                gestione dei cookie nei principali browser:{" "}
                <a
                  href="https://www.garanteprivacy.it/cookie"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#9A7B6F] underline underline-offset-2"
                >
                  Garante Privacy — Linee guida Cookie
                </a>
                .
              </p>
            </div>
          </article>

          {/* Art 10 */}
          <article id="priv10" className="scroll-mt-28">
            <h2 className="text-2xl font-serif font-light text-[#1A1A1A] mb-5 pb-3 border-b border-[#E8DFD6]">
              10. Modifiche all&apos;Informativa
            </h2>
            <div className="space-y-4">
              <p>
                Il Titolare si riserva il diritto di modificare la presente
                Informativa in qualsiasi momento, anche in conseguenza di
                variazioni normative. Le modifiche saranno comunicate mediante
                pubblicazione della versione aggiornata sul Sito, con
                indicazione della data di aggiornamento in calce al documento.
              </p>
              <p>
                In caso di modifiche sostanziali che incidano significativamente
                sui diritti degli interessati, il Titolare invierà una
                notifica agli utenti registrati all&apos;indirizzo email fornito
                in fase di registrazione con almeno 15 giorni di preavviso.
              </p>
              <p>
                Il proseguimento nell&apos;utilizzo del Sito successivamente
                alla pubblicazione delle modifiche implica l&apos;accettazione
                delle stesse.
              </p>
            </div>
          </article>

          {/* Art 11 */}
          <article id="priv11" className="scroll-mt-28">
            <h2 className="text-2xl font-serif font-light text-[#1A1A1A] mb-5 pb-3 border-b border-[#E8DFD6]">
              11. Contatti e Reclami
            </h2>
            <div className="space-y-4">
              <p>
                Per qualsiasi domanda relativa alla presente Informativa o per
                esercitare i tuoi diritti ai sensi del GDPR, puoi contattare
                Maisonelle:
              </p>
              <div className="bg-white border border-[#E8DFD6] p-5 text-[12px] space-y-2 font-sans">
                <p>
                  <strong>Email:</strong>{" "}
                  <a href="mailto:help@maisonelle.com" className="text-[#1A1A1A] underline underline-offset-2">help@maisonelle.com</a>
                </p>
              </div>
              <p>
                Hai inoltre il diritto di presentare reclamo all&apos;Autorità
                Garante per la protezione dei dati personali:
              </p>
              <div className="bg-white border border-[#E8DFD6] p-5 text-[12px] space-y-1 font-sans">
                <p className="font-bold">
                  Garante per la protezione dei dati personali
                </p>
                <p className="text-neutral-600">
                  Piazza Venezia 11 — 00187 Roma
                </p>
                <p className="text-neutral-600">
                  <a
                    href="https://www.garanteprivacy.it"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#9A7B6F] underline underline-offset-2"
                  >
                    www.garanteprivacy.it
                  </a>
                </p>
              </div>
            </div>
          </article>
        </div>

        {/* Bottom navigation */}
        <div className="mt-20 pt-8 border-t border-[#E8DFD6] flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft size={12} />
            Torna allo Shop
          </Link>
          <Link
            href="/termini-e-condizioni"
            className="text-[9px] font-bold uppercase tracking-widest text-[#9A7B6F] hover:text-neutral-900 transition-colors"
          >
            ← Termini e Condizioni
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E8DFD6] py-8 px-6 md:px-10 mt-16">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 font-sans">
            © 2026 Maisonelle. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/termini-e-condizioni"
              className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 hover:text-neutral-900 transition-colors"
            >
              Termini e Condizioni
            </Link>
            <Link
              href="/privacy-policy"
              className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 hover:text-neutral-900 transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
