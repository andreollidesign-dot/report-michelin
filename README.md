# Report DEM Michelin

Mockup della pagina con cui Michelin, cliente di Lulop, vede come vanno le sue DEM: aperture, click, pubblico raggiunto e invio di un comunicato a un contatto.

HTML, CSS e JavaScript semplici, senza framework né dipendenze. I dati sono finti (`data.js`).

## Versione attuale: `v7/`

| Pagina | Cosa mostra |
|---|---|
| `login.html` | Accesso con email e password, poi codice di verifica |
| `index.html` | Home: ultime 10 DEM, riepilogo del periodo (settimana o mese), elenco di tutte le DEM |
| `dem.html?id=…` | Scheda di una singola DEM |
| `invia.html` | Invio di un comunicato a un contatto, in 3 passi |

File condivisi: `data.js` (dati di esempio), `common.js` (funzioni comuni), `style.css`.

### Come aprirla

Online: <https://andreollidesign-dot.github.io/report-michelin/> (porta dritto all'accesso della v7).

In locale, le pagine vanno servite da un piccolo server locale (aperte con doppio clic alcune parti non funzionano):

```bash
cd v7
python3 -m http.server 8000
```

Poi apri <http://localhost:8000/login.html>.

Credenziali del mockup: qualsiasi email, password `demo1234`, codice `123456` (il codice `000000` simula un codice scaduto).

## Storico delle versioni

Ogni giro di modifiche è una cartella nuova; le precedenti non vengono toccate.

| Versione | Cosa cambia |
|---|---|
| `mockup-sorgente/` | Mockup originale (formato canvas) |
| `Report-DEM-Michelin-v2.html` | Prima versione in un unico file HTML |
| `Report-DEM-Michelin-v3.html` | Rifiniture della v2 |
| `v4/` | Struttura mobile-first su più pagine |
| `v5/` | Aggiunti accesso e "Invia a un contatto" |
| `v6/` | Solo mercato italiano, torta per le DEM in corso, grafico a linee |
| `v7/` | DEM in corso escluse dai conti, testi e dati tutti in italiano |

`mock up/` contiene i PDF della v5 (mobile e desktop), numerati nell'ordine in cui leggerli.
