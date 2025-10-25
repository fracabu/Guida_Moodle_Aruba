# 🎓 Guida Interattiva: Moodle su Aruba

Web app interattiva per la guida completa all'installazione di Moodle su hosting Aruba.

## 🚀 Come utilizzare

1. Apri il file `index.html` nel tuo browser
2. Naviga attraverso le sezioni usando il menu laterale
3. Segna i progressi usando le checklist interattive

## ✨ Funzionalità

### 📱 Design Responsive
- Layout completamente responsive ottimizzato per desktop, tablet e mobile
- Menu laterale collassabile con animazioni fluide su dispositivi piccoli
- Pulsante hamburger nell'header per accesso rapido al menu su mobile
- Overlay semi-trasparente quando il menu è aperto su mobile
- Ottimizzazioni per schermi fino a 480px di larghezza

### 🌙 Dark Mode
- Toggle per passare tra tema chiaro e scuro
- Preferenza salvata nel browser
- **Scorciatoia:** `Ctrl/Cmd + D`

### 🔍 Ricerca Avanzata
- Ricerca full-text in tutta la guida
- Risultati in tempo reale mentre digiti
- Evidenziazione delle parole trovate
- **Scorciatoia:** `Ctrl/Cmd + K`

### 📋 Checklist Interattive
- Spunta i task completati
- Progressi salvati automaticamente nel browser
- Badge di completamento nel menu
- Reset disponibile dalla console

### 📊 Barra di Progresso
- Visualizza la percentuale di scroll della pagina
- Aggiornamento in tempo reale

### 💻 Copia Codice
- Pulsante "Copia" su tutti i blocchi di codice
- Feedback visivo dopo la copia
- Sintassi evidenziata per PHP, Bash, Apache, ecc.

### 🎯 Scroll Spy
- Evidenziazione automatica della sezione corrente nel menu
- Navigazione fluida tra le sezioni

### ⬆️ Scroll to Top
- Pulsante per tornare rapidamente in cima
- Appare automaticamente dopo 300px di scroll

## ⌨️ Scorciatoie da Tastiera

| Scorciatoia | Azione |
|-------------|--------|
| `Ctrl/Cmd + K` | Apri ricerca |
| `Ctrl/Cmd + D` | Toggle dark mode |
| `Esc` | Chiudi ricerca |

## 🛠️ Funzioni Console

Apri la console del browser (F12) e utilizza queste funzioni:

```javascript
// Resetta tutti i progressi della checklist
resetChecklist()

// Esporta i progressi in un file JSON
exportProgress()

// Torna in cima alla pagina
scrollToTop()
```

## 💾 Dati Salvati

La web app salva nel localStorage del browser:

- ✅ Stato delle checklist
- 🌙 Preferenza dark mode
- 📍 Posizione scroll (opzionale)

**Nota:** I dati sono salvati solo sul tuo dispositivo e non vengono inviati online.

## 🎨 Personalizzazione

### Colori
Puoi modificare i colori nel file `styles.css` nella sezione `:root`:

```css
:root {
    --primary-color: #2563eb;
    --success-color: #10b981;
    --warning-color: #f59e0b;
    --error-color: #ef4444;
    /* ... */
}
```

### Font
Il font di default è il system font. Per cambiarlo, modifica in `styles.css`:

```css
body {
    font-family: 'Il tuo font', sans-serif;
}
```

## 📦 Struttura File

```
Guida_Moodle_Aruba/
├── index.html              # Struttura HTML della guida
├── styles.css              # Stili e design
├── script.js               # Logica e interattività
├── GUIDA_MOODLE_ARUBA_COMPLETA.md  # Guida originale in markdown
└── README.md               # Questo file
```

## 🌐 Hosting Online

Per mettere la guida online:

1. **GitHub Pages:**
   - Crea un repository GitHub
   - Carica tutti i file
   - Vai su Settings → Pages
   - Seleziona branch main e cartella root
   - La guida sarà disponibile su `username.github.io/repo-name`

2. **Netlify/Vercel:**
   - Drag & drop della cartella
   - Deploy automatico

3. **Hosting tradizionale:**
   - Carica tutti i file via FTP
   - Accedi tramite il tuo dominio

## 🔧 Compatibilità

✅ Chrome/Edge 90+
✅ Firefox 88+
✅ Safari 14+
✅ Opera 76+

## 📝 Licenza

Questa guida è basata sulla documentazione di Moodle e su esperienze reali di migrazione.
Libera da utilizzare per scopi educativi e personali.

## 🤝 Contributi

Hai suggerimenti per migliorare la guida?
- Modifica il file markdown originale
- Rigenera l'HTML con le tue modifiche
- Condividi i miglioramenti!

---

**Creato il:** 25 Ottobre 2025
**Versione:** 1.3.0
**Basato su:** Migrazione reale deltaskill.it

### 🔄 Changelog

**v1.3.0** (25 Ottobre 2025)
- 🎯 Pulsanti "Copia" ora correttamente posizionati nei blocchi di codice
- 🎯 Scrollbar orizzontali personalizzate e funzionanti nei blocchi codice
- 📝 Sistemato allineamento di testi, liste e paragrafi nelle card e alert
- 📝 Migliorato spacing e padding per liste annidate
- 📝 Maggiore leggibilità con line-height ottimizzato
- 🔧 Aggiunta funzione JavaScript per riposizionare automaticamente i pulsanti copia
- 🎨 Scrollbar personalizzate con colori tema per migliore UX

**v1.2.0** (25 Ottobre 2025)
- 🔒 Sostituite tutte le password di esempio con placeholder generici
- 🔒 Rimossi username e email sensibili sostituiti con esempi generici
- 📱 Sistemato overflow dei testi nelle card e alert
- 📱 Migliorato scrolling orizzontale nei blocchi di codice
- 📱 Ottimizzato responsive per evitare testi che escono dai contenitori
- 📱 Migliorato word-wrap e break-word per tutti i dispositivi
- 🎨 Ridotto padding card e blocchi codice su mobile per migliore leggibilità

**v1.1.0** (25 Ottobre 2025)
- ✅ Design completamente responsive per tutti i dispositivi
- ✅ Aggiunto pulsante hamburger nell'header per mobile
- ✅ Aggiunto overlay semi-trasparente per il menu mobile
- ✅ Migliorate animazioni e transizioni
- ✅ Ottimizzazioni per schermi extra-small (≤480px)

**v1.0.0** (25 Ottobre 2025)
- 🎉 Rilascio iniziale

---

🎉 Buon lavoro con Moodle!
