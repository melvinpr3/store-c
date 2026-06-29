import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "../components/Logo";

export const metadata: Metadata = {
  title: "Termini e Condizioni | Maisonelle",
  description:
    "Termini e Condizioni di Vendita di Maisonelle. Informazioni su ordini, pagamenti, spedizioni, diritto di recesso e garanzie per l'acquisto di abbigliamento contemporaneo.",
};

export default function TerminiECondizioniPage() {
  return (
    <div className="min-h-screen bg-[#FBF7F4] text-[#1A1A1A] font-sans">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-[#E8DFD6] py-4 px-6 md:px-10 flex justify-between items-center">
        <Link href="/" className="flex items-center">
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
            Termini e Condizioni di Vendita
          </h1>
          <p className="text-[11px] text-neutral-400 uppercase tracking-widest font-sans">
            Ultimo aggiornamento: 28 Giugno 2026 &nbsp;·&nbsp; Versione 1.1
          </p>
        </div>

        {/* Intro Banner */}
        <div className="mb-12 bg-white border border-[#E8DFD6] p-6">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#9A7B6F] mb-2">
            Informazioni sul Venditore
          </p>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Maisonelle è un brand di abbigliamento contemporaneo ispirato al
            fascino delle maison francesi. Propone capi versatili e di alta
            qualità per uomo e donna, pensati per chi ricerca eleganza
            essenziale, materiali di pregio e uno stile sofisticato da indossare
            ogni giorno. I presenti Termini regolano l&apos;acquisto di prodotti
            attraverso il sito <strong>maisonelle.com</strong>.
          </p>
        </div>

        {/* Index */}
        <nav className="mb-12 bg-white border border-[#E8DFD6] p-6 rounded-none">
          <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#9A7B6F] mb-4">
            Indice
          </p>
          <ol className="space-y-1.5">
            {[
              ["1", "Premesse e Identificazione del Venditore", "#art1"],
              ["2", "Ambito di Applicazione e Accettazione", "#art2"],
              ["3", "Prodotti e Prezzi", "#art3"],
              ["4", "Procedura d'Ordine e Conclusione del Contratto", "#art4"],
              ["5", "Metodi di Pagamento", "#art5"],
              ["6", "Spedizione e Consegna", "#art6"],
              ["7", "Diritto di Recesso", "#art7"],
              ["8", "Garanzia Legale di Conformità", "#art8"],
              ["9", "Limitazione di Responsabilità", "#art9"],
              ["10", "Proprietà Intellettuale", "#art10"],
              ["11", "Legge Applicabile e Foro Competente", "#art11"],
              ["12", "Contatti", "#art12"],
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
          <article id="art1" className="scroll-mt-28">
            <h2 className="text-2xl font-serif font-light text-[#1A1A1A] mb-5 pb-3 border-b border-[#E8DFD6]">
              1. Premesse e Identificazione del Venditore
            </h2>
            <div className="space-y-4">
              <p>
                Il presente sito web è gestito da <strong>Maisonelle</strong>{" "}
                (di seguito «Venditore»), brand di abbigliamento contemporaneo
                per uomo e donna, accessibile tramite il sito web{" "}
                <strong>maisonelle.com</strong>.
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
                Il Venditore è raggiungibile per qualsiasi comunicazione
                tramite i recapiti indicati all&apos;articolo 12 dei presenti
                Termini.
              </p>
            </div>
          </article>

          {/* Art 2 */}
          <article id="art2" className="scroll-mt-28">
            <h2 className="text-2xl font-serif font-light text-[#1A1A1A] mb-5 pb-3 border-b border-[#E8DFD6]">
              2. Ambito di Applicazione e Accettazione
            </h2>
            <div className="space-y-4">
              <p>
                I presenti Termini e Condizioni di Vendita (di seguito
                «Termini») regolano il rapporto contrattuale tra il Venditore e
                qualsiasi soggetto (di seguito «Cliente» o «Consumatore») che
                effettui acquisti attraverso il sito web{" "}
                <strong>maisonelle.com</strong> (di seguito «Sito»).
              </p>
              <p>
                L&apos;accesso al Sito e l&apos;effettuazione di un ordine
                implicano la piena e incondizionata accettazione dei presenti
                Termini da parte del Cliente. I Termini possono essere
                aggiornati in qualsiasi momento; le modifiche saranno efficaci
                dalla data di pubblicazione sul Sito e si applicheranno agli
                ordini effettuati successivamente.
              </p>
              <p>
                I presenti Termini si applicano esclusivamente alle vendite
                effettuate a consumatori privati ai sensi del Codice del Consumo
                (D.Lgs. 206/2005 e successive modifiche). Per acquisti
                aziendali, contattare il Venditore per condizioni specifiche.
              </p>
            </div>
          </article>

          {/* Art 3 */}
          <article id="art3" className="scroll-mt-28">
            <h2 className="text-2xl font-serif font-light text-[#1A1A1A] mb-5 pb-3 border-b border-[#E8DFD6]">
              3. Prodotti e Prezzi
            </h2>
            <div className="space-y-4">
              <p>
                <strong>3.1 Disponibilità prodotti.</strong> I prodotti
                disponibili sul Sito sono descritti con la massima accuratezza
                possibile, incluse caratteristiche, composizione, taglia e
                immagini fotografiche. Le immagini sono puramente illustrative;
                possono verificarsi lievi differenze cromatiche in base alla
                calibrazione del monitor del Cliente. Il Venditore si riserva il
                diritto di modificare la disponibilità dei prodotti senza
                preavviso.
              </p>
              <p>
                <strong>3.2 Prezzi.</strong> Tutti i prezzi indicati sul Sito
                sono espressi in Euro (€) e sono comprensivi dell&apos;IVA
                applicabile ai sensi della normativa italiana vigente, salvo
                diversa indicazione. I prezzi non includono le spese di
                spedizione, che verranno indicate separatamente al momento del
                checkout, ove applicabili.
              </p>
              <p>
                <strong>3.3 Variazioni di prezzo.</strong> Il Venditore si
                riserva il diritto di modificare i prezzi in qualsiasi momento e
                senza preavviso. I prezzi in vigore al momento della conferma
                dell&apos;ordine saranno quelli applicati all&apos;acquisto. Non
                saranno emessi rimborsi o addebitati supplementi in caso di
                variazioni di prezzo successive alla conferma dell&apos;ordine.
              </p>
              <p>
                <strong>3.4 Promozioni.</strong> Le offerte promozionali e gli
                sconti sono validi esclusivamente nel periodo indicato e fino ad
                esaurimento scorte. Il Venditore si riserva il diritto di
                revocare o modificare le promozioni in qualsiasi momento.
              </p>
            </div>
          </article>

          {/* Art 4 */}
          <article id="art4" className="scroll-mt-28">
            <h2 className="text-2xl font-serif font-light text-[#1A1A1A] mb-5 pb-3 border-b border-[#E8DFD6]">
              4. Procedura d&apos;Ordine e Conclusione del Contratto
            </h2>
            <div className="space-y-4">
              <p>
                <strong>4.1 Processo d&apos;ordine.</strong> Per effettuare un
                ordine, il Cliente deve: (i) selezionare i prodotti desiderati e
                aggiungerli al carrello; (ii) procedere al checkout inserendo i
                dati di spedizione; (iii) selezionare il metodo di pagamento;
                (iv) confermare l&apos;ordine accettando i presenti Termini.
              </p>
              <p>
                <strong>4.2 Registrazione account.</strong> Per completare un
                acquisto è necessario creare un account o effettuare l&apos;accesso.
                Il Cliente è responsabile della riservatezza delle proprie
                credenziali di accesso.
              </p>
              <p>
                <strong>4.3 Conferma dell&apos;ordine.</strong> Dopo la
                trasmissione dell&apos;ordine, il Cliente riceverà una email di
                conferma all&apos;indirizzo indicato in fase di registrazione.
                Il contratto di vendita si intende concluso nel momento in cui
                il Venditore invia la conferma dell&apos;ordine al Cliente.
              </p>
              <p>
                <strong>4.4 Rifiuto dell&apos;ordine.</strong> Il Venditore si
                riserva il diritto di rifiutare o annullare un ordine in caso
                di: (i) indisponibilità del prodotto; (ii) errori nel prezzo o
                nella descrizione; (iii) mancata autorizzazione del pagamento;
                (iv) sospetto di frode. In caso di annullamento dopo il
                pagamento, il Cliente sarà rimborsato integralmente entro 14
                giorni lavorativi.
              </p>
              <p>
                <strong>4.5 Fatturazione.</strong> Su richiesta del Cliente,
                effettuata prima della conferma dell&apos;ordine, il Venditore
                emetterà regolare fattura. I dati per la fatturazione devono
                essere forniti in fase di ordine.
              </p>
            </div>
          </article>

          {/* Art 5 */}
          <article id="art5" className="scroll-mt-28">
            <h2 className="text-2xl font-serif font-light text-[#1A1A1A] mb-5 pb-3 border-b border-[#E8DFD6]">
              5. Metodi di Pagamento
            </h2>
            <div className="space-y-4">
              <p>
                <strong>5.1 Metodi accettati.</strong> Il Sito accetta i
                seguenti metodi di pagamento:
              </p>
              <ul className="list-none space-y-2 pl-4 border-l-2 border-[#E8DFD6]">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9A7B6F] shrink-0" />
                  PayPal (incluse carte di credito/debito tramite PayPal)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9A7B6F] shrink-0" />
                  Carte di credito e debito (Visa, Mastercard, American Express)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9A7B6F] shrink-0" />
                  Bonifico bancario (ove indicato)
                </li>
              </ul>
              <p>
                <strong>5.2 Sicurezza dei pagamenti.</strong> Tutte le
                transazioni sono elaborate attraverso piattaforme di pagamento
                certificate e conformi agli standard PCI-DSS. I dati della carta
                di credito non vengono mai memorizzati sui server del Venditore.
                Le comunicazioni tra il browser del Cliente e il Sito sono
                protette da crittografia SSL.
              </p>
              <p>
                <strong>5.3 Autorizzazione al pagamento.</strong> Effettuando
                un ordine, il Cliente autorizza il Venditore a procedere
                all&apos;addebito dell&apos;importo totale dell&apos;ordine,
                incluse le spese di spedizione applicabili. Il pagamento viene
                processato al momento della conferma dell&apos;ordine.
              </p>
              <p>
                <strong>5.4 Rifiuto di pagamento.</strong> In caso di mancata
                autorizzazione del pagamento da parte dell&apos;istituto
                finanziario del Cliente, l&apos;ordine non verrà processato. Il
                Venditore non è responsabile per eventuali costi bancari o
                commissioni addebitati al Cliente dal proprio istituto
                finanziario.
              </p>
              <p>
                <strong>5.5 Rimborsi.</strong> I rimborsi, ove dovuti, verranno
                effettuati tramite lo stesso metodo di pagamento utilizzato
                per l&apos;acquisto, salvo accordo diverso, entro 14 giorni
                lavorativi dall&apos;accettazione del rimborso.
              </p>
            </div>
          </article>

          {/* Art 6 */}
          <article id="art6" className="scroll-mt-28">
            <h2 className="text-2xl font-serif font-light text-[#1A1A1A] mb-5 pb-3 border-b border-[#E8DFD6]">
              6. Spedizione e Consegna
            </h2>
            <div className="space-y-4">
              <p>
                <strong>6.1 Aree di spedizione.</strong> Maisonelle spedisce in
                tutto il mondo. Non esistono limitazioni geografiche per la
                ricezione degli ordini.
              </p>
              <p>
                <strong>6.2 Tempi di elaborazione.</strong> Gli ordini vengono
                elaborati nei giorni lavorativi (lunedì–venerdì, esclusi
                festivi) entro <strong>1–3 giorni lavorativi</strong> dalla
                conferma del pagamento. Nei periodi di alta stagione o
                promozioni, i tempi potrebbero essere superiori; in tal caso,
                il Venditore comunicherà eventuali ritardi via email.
              </p>
              <p>
                <strong>6.3 Tempi di consegna.</strong> Una volta spedito
                l&apos;ordine tramite <strong>DHL</strong> o{" "}
                <strong>Poste Italiane</strong>, i tempi di consegna stimati
                sono:
              </p>
              <ul className="list-none space-y-2 pl-4 border-l-2 border-[#E8DFD6]">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9A7B6F] shrink-0" />
                  <strong>Italia e resto del mondo:</strong>&nbsp;10–15 giorni lavorativi
                </li>
              </ul>
              <p>
                I tempi di consegna sono indicativi e possono variare in
                funzione del corriere, della destinazione finale e di
                circostanze esterne (es. sdoganamento per paesi extra-UE).
                Il Venditore non può essere ritenuto responsabile per ritardi
                imputabili al corriere o a cause di forza maggiore.
              </p>
              <p>
                <strong>6.4 Costi di spedizione.</strong> La spedizione è
                <strong> gratuita</strong> su tutti gli ordini, senza importo
                minimo di acquisto.
              </p>
              <p>
                <strong>6.5 Tracciamento.</strong> A seguito della spedizione
                dell&apos;ordine, il Cliente riceverà un&apos;email con il
                numero di tracciamento e le istruzioni per monitorare la
                consegna.
              </p>
              <p>
                <strong>6.6 Mancata consegna.</strong> In caso di mancata
                consegna per cause imputabili al Cliente (indirizzo errato,
                assenza prolungata, rifiuto del pacco), le spese di rientro
                della merce e di eventuale rispedizione sono a carico del
                Cliente.
              </p>
              <p>
                <strong>6.7 Verifica al ricevimento.</strong> Il Cliente è
                tenuto a verificare l&apos;integrità del pacco al momento della
                consegna. In caso di danni visibili al packaging o al prodotto,
                il Cliente deve accettare il pacco con riserva scritta o
                rifiutarlo, comunicando immediatamente la situazione al Venditore.
              </p>
            </div>
          </article>

          {/* Art 7 */}
          <article id="art7" className="scroll-mt-28">
            <h2 className="text-2xl font-serif font-light text-[#1A1A1A] mb-5 pb-3 border-b border-[#E8DFD6]">
              7. Diritto di Recesso
            </h2>
            <div className="space-y-4">
              <div className="bg-neutral-50 border border-[#E8DFD6] p-5 rounded-none">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#9A7B6F] mb-2">
                  Informazione importante per il Consumatore
                </p>
                <p>
                  Ai sensi degli artt. 52–58 del Codice del Consumo (D.Lgs.
                  206/2005), il Consumatore ha diritto di recedere dal contratto
                  di acquisto entro <strong>14 giorni</strong> dalla ricezione
                  della merce, senza necessità di fornire alcuna motivazione.
                </p>
              </div>
              <p>
                <strong>7.1 Termine per esercitare il recesso.</strong> Il
                periodo di recesso decorre dal giorno in cui il Consumatore, o
                un terzo da lui designato (diverso dal vettore), acquisisca il
                possesso fisico della merce. In caso di ordini multipli
                consegnati separatamente, il termine decorre dall&apos;ultimo
                prodotto ricevuto.
              </p>
              <p>
                <strong>7.2 Come esercitare il recesso.</strong> Per esercitare
                il diritto di recesso, il Consumatore deve comunicare la propria
                decisione prima della scadenza del termine tramite:
              </p>
              <ul className="list-none space-y-2 pl-4 border-l-2 border-[#E8DFD6]">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9A7B6F] shrink-0" />
                  Email:{" "}
                  <a href="mailto:help@maisonelle.com" className="text-[#1A1A1A] font-medium underline underline-offset-2">help@maisonelle.com</a>
                </li>
              </ul>
              <p>
                La comunicazione deve indicare: nome e cognome, numero
                d&apos;ordine, prodotti da restituire e la volontà di recedere
                dal contratto. È possibile utilizzare il modulo standard di
                recesso allegato al presente documento (Allegato I).
              </p>
              <p>
                <strong>7.3 Restituzione della merce.</strong> Entro 14 giorni
                dalla comunicazione del recesso, il Consumatore deve restituire
                la merce al Venditore. I costi diretti di restituzione sono a
                carico del Consumatore, salvo diversa indicazione del Venditore.
                La merce deve essere restituita nelle stesse condizioni in cui
                è stata ricevuta, integra, non utilizzata, con i cartellini
                originali ancora attaccati e nell&apos;imballo originale.
              </p>
              <p>
                <strong>7.4 Rimborso.</strong> Il Venditore rimborserà tutti i
                pagamenti ricevuti, incluse le spese di consegna standard (esclusi
                i costi aggiuntivi derivanti dalla scelta di un tipo di
                consegna diverso da quello standard), entro 14 giorni dal
                ricevimento della merce restituita o, se anteriore, dalla prova
                dell&apos;avvenuta restituzione. Il rimborso avverrà mediante lo
                stesso mezzo di pagamento utilizzato per l&apos;acquisto.
              </p>
              <p>
                <strong>7.5 Esclusioni dal diritto di recesso.</strong> Ai sensi
                dell&apos;art. 59 del Codice del Consumo, il diritto di recesso
                è escluso per:
              </p>
              <ul className="list-none space-y-2 pl-4 border-l-2 border-[#E8DFD6]">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 shrink-0" />
                  Prodotti confezionati su misura o personalizzati
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 shrink-0" />
                  Prodotti che per loro natura non possono essere restituiti o che
                  possono deteriorarsi rapidamente
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 shrink-0" />
                  Prodotti sigillati che non si prestano ad essere restituiti per
                  motivi igienici o connessi alla protezione della salute e che
                  siano stati aperti dopo la consegna
                </li>
              </ul>

              <div className="mt-8 border border-[#E8DFD6] p-5 bg-white">
                <p className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 mb-3">
                  Allegato I — Modulo Standard di Recesso
                </p>
                <p className="text-[12px] italic text-neutral-600">
                  A mezzo email a{" "}
                  <a href="mailto:help@maisonelle.com" className="text-[#1A1A1A] font-medium underline underline-offset-2">help@maisonelle.com</a>
                </p>
                <div className="mt-3 text-[12px] text-neutral-600 space-y-1 font-mono bg-neutral-50 p-4 border border-[#E8DFD6]">
                  <p>
                    Con la presente comunico il mio recesso dal contratto di
                    vendita dei seguenti prodotti:
                  </p>
                  <p className="mt-2">
                    Numero d&apos;ordine: _______________
                    <br />
                    Prodotto/i: _______________
                    <br />
                    Ordinato il: _______________ / Ricevuto il: _______________
                    <br />
                    Nome Consumatore: _______________
                    <br />
                    Indirizzo Consumatore: _______________
                    <br />
                    Data: _______________
                    <br />
                    Firma (solo se il presente modulo è notificato su carta):
                    _______________
                  </p>
                </div>
              </div>
            </div>
          </article>

          {/* Art 8 */}
          <article id="art8" className="scroll-mt-28">
            <h2 className="text-2xl font-serif font-light text-[#1A1A1A] mb-5 pb-3 border-b border-[#E8DFD6]">
              8. Garanzia Legale di Conformità
            </h2>
            <div className="space-y-4">
              <p>
                Ai sensi degli artt. 128–135 del Codice del Consumo, tutti i
                prodotti venduti sono coperti dalla garanzia legale di conformità
                di <strong>24 mesi</strong> dalla data di acquisto per i
                consumatori privati.
              </p>
              <p>
                <strong>8.1 Difetti di conformità.</strong> La garanzia copre i
                vizi e i difetti di conformità esistenti al momento della
                consegna del prodotto. Un prodotto è difettoso quando non
                corrisponde alla descrizione fornita, non possiede le qualità
                presentate, non è idoneo all&apos;uso cui è destinato.
              </p>
              <p>
                <strong>8.2 Come esercitarla.</strong> In caso di difetto di
                conformità, il Cliente deve contattare il Venditore entro 2 mesi
                dalla scoperta del difetto, fornendo la descrizione del problema
                e le foto del prodotto difettoso. Il Venditore valuterà il difetto
                e proporrà, a sua discrezione: riparazione, sostituzione,
                riduzione del prezzo o rimborso.
              </p>
              <p>
                <strong>8.3 Esclusioni.</strong> La garanzia non copre danni
                causati da: uso improprio o scorretto, normale usura, incidenti,
                modifiche non autorizzate, manutenzione inadeguata.
              </p>
            </div>
          </article>

          {/* Art 9 */}
          <article id="art9" className="scroll-mt-28">
            <h2 className="text-2xl font-serif font-light text-[#1A1A1A] mb-5 pb-3 border-b border-[#E8DFD6]">
              9. Limitazione di Responsabilità
            </h2>
            <div className="space-y-4">
              <p>
                <strong>9.1</strong> Il Venditore non sarà responsabile per
                danni indiretti, incidentali, speciali o consequenziali derivanti
                dall&apos;uso o dall&apos;impossibilità di utilizzo dei prodotti
                acquistati, nei limiti consentiti dalla normativa applicabile.
              </p>
              <p>
                <strong>9.2 Forza maggiore.</strong> Il Venditore non sarà
                responsabile per ritardi o inadempimenti causati da circostanze
                al di fuori del proprio ragionevole controllo, incluse ma non
                limitatamente a: disastri naturali, pandemie, scioperi, azioni
                governative, interruzioni di rete o di forniture di energia.
              </p>
              <p>
                <strong>9.3 Link di terze parti.</strong> Il Sito può contenere
                link a siti web di terze parti. Il Venditore non è responsabile
                per il contenuto, le pratiche sulla privacy o le politiche di
                tali siti.
              </p>
              <p>
                <strong>9.4 Massimale di responsabilità.</strong> Fatta salva la
                responsabilità inderogabile ai sensi del Codice del Consumo, la
                responsabilità complessiva del Venditore nei confronti del
                Cliente non supererà in nessun caso l&apos;importo pagato dal
                Cliente per il singolo ordine oggetto della controversia.
              </p>
            </div>
          </article>

          {/* Art 10 */}
          <article id="art10" className="scroll-mt-28">
            <h2 className="text-2xl font-serif font-light text-[#1A1A1A] mb-5 pb-3 border-b border-[#E8DFD6]">
              10. Proprietà Intellettuale
            </h2>
            <div className="space-y-4">
              <p>
                Tutti i contenuti del Sito — inclusi ma non limitatamente a
                testi, grafica, loghi, icone, immagini fotografiche, clip audio,
                download digitali e compilazioni di dati — sono di proprietà del
                Venditore o dei suoi fornitori di contenuti e sono protetti dalle
                leggi italiane e internazionali sulla proprietà intellettuale.
              </p>
              <p>
                È vietato riprodurre, distribuire, modificare, trasmettere o
                riutilizzare i contenuti del Sito senza previa autorizzazione
                scritta del Venditore. L&apos;uso del Sito non conferisce alcuna
                licenza sui marchi commerciali e sui diritti di proprietà
                intellettuale del Venditore.
              </p>
            </div>
          </article>

          {/* Art 11 */}
          <article id="art11" className="scroll-mt-28">
            <h2 className="text-2xl font-serif font-light text-[#1A1A1A] mb-5 pb-3 border-b border-[#E8DFD6]">
              11. Legge Applicabile e Foro Competente
            </h2>
            <div className="space-y-4">
              <p>
                I presenti Termini sono regolati dalla legge italiana. Per le
                controversie derivanti dall&apos;interpretazione, esecuzione o
                risoluzione degli stessi, qualora il Cliente rivesta la qualità
                di consumatore ai sensi del Codice del Consumo, è competente il
                foro del luogo di residenza o domicilio del consumatore.
              </p>
              <p>
                <strong>Risoluzione alternativa delle controversie (ADR/ODR).</strong>{" "}
                Ai sensi del Regolamento UE n. 524/2013, i consumatori residenti
                nell&apos;Unione Europea possono ricorrere alla piattaforma di
                risoluzione online delle controversie (ODR) all&apos;indirizzo:{" "}
                <a
                  href="https://ec.europa.eu/consumers/odr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#9A7B6F] underline underline-offset-2"
                >
                  ec.europa.eu/consumers/odr
                </a>
                .
              </p>
            </div>
          </article>

          {/* Art 12 */}
          <article id="art12" className="scroll-mt-28">
            <h2 className="text-2xl font-serif font-light text-[#1A1A1A] mb-5 pb-3 border-b border-[#E8DFD6]">
              12. Contatti
            </h2>
            <div className="space-y-4">
              <p>
                Per qualsiasi informazione, reclamo o assistenza post-vendita,
                il Cliente può contattare Maisonelle tramite:
              </p>
              <div className="bg-white border border-[#E8DFD6] p-5 text-[12px] space-y-2 font-sans">
                <p>
                  <strong>Email:</strong>{" "}
                  <a href="mailto:help@maisonelle.com" className="text-[#1A1A1A] underline underline-offset-2">help@maisonelle.com</a>
                </p>
                <p>
                  <strong>Orario assistenza:</strong> Lunedì–Venerdì, 09:00–18:00 CET
                </p>
              </div>
              <p className="text-neutral-500 text-[12px]">
                Il Venditore si impegna a rispondere alle richieste entro 3
                giorni lavorativi.
              </p>
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
            href="/privacy-policy"
            className="text-[9px] font-bold uppercase tracking-widest text-[#9A7B6F] hover:text-neutral-900 transition-colors"
          >
            Leggi la Privacy Policy →
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
