# CLAUDE.md - Guida Completa Moodle

## Panoramica Progetto
Web app statica (HTML/CSS/JS) per guida interattiva Moodle: sviluppo locale, plugin, standard corsi e hosting Aruba.

## Struttura File
- `index.html` - Struttura HTML con 17 sezioni
- `styles.css` - Stili con tema Moodle arancione (#f98012)
- `script.js` - Funzionalità interattive (dark mode, search, checklist)
- `README.md` - Documentazione bilingue con badge

## Comandi Utili
```bash
# Test locale
start index.html
# oppure
python -m http.server 8000

# Git
git add -A && git commit -m "messaggio" && git push
```

## Struttura Sezioni
1-4: Sviluppo (ambiente, struttura, plugin, standard corsi)
5-17: Hosting Aruba (configurazione, migrazione, troubleshooting)

## Progetti Correlati
- `C:\Users\utente\scorm-course-generator\` - Generatore SCORM multi-agente
- `C:\moodle\` - Installazione Moodle locale (Windows Installer)

## Note
- Tema colori: Moodle Orange #f98012
- Sezione 4 contiene analisi dettagliata scorm-course-generator
- Plugin Moodle vanno in: `C:\moodle\server\moodle\local\`
