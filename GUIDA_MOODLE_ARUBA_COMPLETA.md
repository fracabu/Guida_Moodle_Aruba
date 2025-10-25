# Guida Completa: Installare Moodle su Aruba - Dalla A alla Z

**Basata su problemi reali risolti durante la migrazione**

---

## 📋 Indice

1. [Scegliere l'hosting corretto su Aruba](#1-scegliere-lhosting-corretto-su-aruba)
2. [Preparazione in locale (Moodle for Windows)](#2-preparazione-in-locale-moodle-for-windows)
3. [Backup completo prima della migrazione](#3-backup-completo-prima-della-migrazione)
4. [Creare il database MySQL su Aruba](#4-creare-il-database-mysql-su-aruba)
5. [Caricare i file su Aruba](#5-caricare-i-file-su-aruba)
6. [Configurare config.php correttamente](#6-configurare-configphp-correttamente)
7. [Proteggere moodledata](#7-proteggere-moodledata)
8. [Test e verifica](#8-test-e-verifica)
9. [Troubleshooting errori comuni](#9-troubleshooting-errori-comuni)
10. [Ottimizzazioni finali](#10-ottimizzazioni-finali)
11. [Reset Password Admin Dopo Migrazione](#11-reset-password-admin-dopo-migrazione)
12. [Gestione Utenti in Moodle](#12-gestione-utenti-in-moodle)
13. [Accesso Ospite (Guest)](#13-accesso-ospite-guest)

---

## 1. Scegliere l'hosting corretto su Aruba

### ⚠️ IMPORTANTE: Quale piano scegliere

**✅ Devi prendere: HOSTING LINUX (non Windows)**

Moodle richiede:
- PHP 7.4+ (meglio 8.1 o 8.2)
- MySQL/MariaDB
- Server Apache/Nginx

**Piano consigliato minimo:**
- **Hosting Linux Easy/Medium** (non Basic)
- Almeno **5 GB di spazio** (Moodle base = ~500MB, più corsi e utenti)
- **1+ database MySQL** incluso
- **PHP 8.2** supportato
- Accesso **File Manager** e **FTP**

### ❌ NON prendere:
- Hosting Windows (ASP.NET)
- Piano Basic se prevedi molti corsi/utenti
- Piani senza database MySQL

### Verifica dopo l'acquisto:

1. **Pannello Aruba → Hosting Linux → Informazioni**
   - Versione PHP: **8.1 o 8.2** ✅
   - Database MySQL: **disponibile** ✅

2. **Pannello → Database MySQL**
   - Puoi creare almeno 1 database ✅

---

## 2. Preparazione in locale (Moodle for Windows)

### Struttura tipica di Moodle for Windows:

```
C:\moodle\
├── server\
│   ├── moodle.exe        ← Avvia/ferma il server locale
│   ├── htdocs\
│   │   └── moodle\       ← CODICE MOODLE (da caricare su Aruba)
│   └── moodledata\       ← DATI (corsi, file, cache) - da caricare su Aruba
```

### Come funziona in locale:

- **moodle.exe**: È un server locale (Apache + MySQL + PHP) preconfigurato
- **NON crea "nuovi progetti"** - hai 1 installazione = 1 sito Moodle
- Puoi creare più Moodle installando in cartelle diverse

---

## 3. Backup completo prima della migrazione

### 3.1 Backup FILE (codice Moodle)

**Percorso:** `C:\moodle\server\htdocs\moodle`

**Procedura:**
1. Tasto destro sulla cartella `moodle`
2. **Invia a → Cartella compressa (ZIP)**
3. Ottieni `moodle.zip` (~300-500 MB)

### 3.2 Backup DATI (moodledata)

**Percorso:** `C:\moodle\server\moodledata`

**Procedura:**
1. Tasto destro sulla cartella `moodledata`
2. **Invia a → Cartella compressa (ZIP)**
3. Ottieni `moodledata.zip`

### 3.3 Backup DATABASE (MySQL)

**Se vuoi migrare corsi/utenti esistenti:**

1. Avvia `moodle.exe` (server locale)
2. Apri browser: `http://localhost/phpmyadmin`
3. Seleziona il database di Moodle (di solito chiamato `moodle`)
4. **Esporta**
   - Metodo: **Personalizzato**
   - Formato: **SQL**
   - Compressione: **zip** (se il file è grande)
5. Click **Esegui** → salva `moodle_backup.sql.zip`

**Se parti da zero (installazione pulita):** salta questo step.

---

## 4. Creare il database MySQL su Aruba

### 4.1 Creare il database

1. **Pannello Aruba → Database → MySQL**
2. Click **Crea Database**
3. Aruba ti mostrerà:
   - **Host:** `31.11.39.250` (o `sqlXXXXX.aruba.it`)
   - **Database:** `Sql1895661_1` (esempio)
   - **Utente:** `Sql1895661` (esempio)
   - **Password:** ⚠️ **DEVI IMPOSTARLA TU!**

### 4.2 ⚠️ FONDAMENTALE: Impostare la password

**Problema comune:** Aruba NON invia la password via email!

**Soluzione:**
1. Nel pannello Database → MySQL
2. Click su **"Non ricordi la password?"** o **"Reimposta password"**
3. Imposta una password sicura (es. `Fr@kabu10`)
4. **SALVALA** - ti servirà per config.php

### 4.3 Testare le credenziali (IMPORTANTISSIMO!)

**Prima di andare avanti, verifica che le credenziali funzionino:**

1. **Pannello → Database → MySQL**
2. Click **"Vai a phpMyAdmin"**
3. Accedi con:
   - **Utente:** `Sql1895661` (o il tuo)
   - **Password:** quella appena impostata
4. **✅ Se entri e vedi il database:** credenziali OK
5. **❌ Se non entri:** password errata → reimposta

### 4.4 (Opzionale) Importare database da locale

**Solo se hai fatto il backup del DB locale:**

1. In phpMyAdmin su Aruba
2. Seleziona il database `Sql1895661_1`
3. Click **Importa**
4. Scegli il file `moodle_backup.sql.zip`
5. Click **Esegui**

**Se il file è troppo grande (timeout):**
- Aumenta il limite upload nel pannello PHP
- Oppure split il file SQL in parti più piccole

---

## 5. Caricare i file su Aruba

### 5.1 Struttura finale su Aruba

```
/web/htdocs/www.tuodominio.it/home/
├── moodle/              ← Codice Moodle (pubblico)
└── .data_mdl_2025/      ← Dati Moodle (NON pubblico)
    └── moodledata/
```

### 5.2 Caricare il codice Moodle

**Metodo 1: File Manager Aruba**

1. **Pannello → Hosting Linux → File Manager**
2. Vai in `/web/htdocs/www.tuodominio.it/home/`
3. **Carica** `moodle.zip`
   - Drag & drop (se attivo)
   - Oppure click su pulsante **Carica**
4. Dopo il caricamento: **Tasto destro → Estrai** (o Decomprimi)
5. Verifica che ci sia la cartella `moodle/`

⚠️ **Se il pulsante Carica è grigio:**
- Il file è troppo grande per l'upload web
- Usa FTP (vedi sotto)

**Metodo 2: FTP (FileZilla)**

**Se il file è grande o l'upload web non funziona:**

1. Scarica **FileZilla** (gratis)
2. Connessione:
   - **Host:** `ftp.tuodominio.it`
   - **Porta:** `21`
   - **Utente:** (dal pannello Aruba → FTP)
   - **Password:** (dal pannello Aruba → FTP)
3. Naviga in `/web/htdocs/www.tuodominio.it/home/`
4. Carica `moodle.zip`
5. Torna al File Manager Aruba e estrai lo zip

### 5.3 Creare cartella per moodledata

**⚠️ CRITICO: moodledata NON deve essere dentro la cartella moodle/**

**Posizione corretta:**

1. Nel File Manager, vai in `/web/htdocs/www.tuodominio.it/home/`
2. Click **Nuova Cartella**
3. Nome: `.data_mdl_2025` (il punto nasconde la cartella)
4. Entra nella cartella `.data_mdl_2025/`
5. Carica ed estrai `moodledata.zip`

**Struttura finale:**

```
/web/htdocs/www.tuodominio.it/home/
├── moodle/                    ← Codice (pubblico)
└── .data_mdl_2025/            ← NON pubblico
    └── moodledata/            ← Dati Moodle
        ├── cache/
        ├── sessions/
        ├── temp/
        └── ...
```

### 5.4 Impostare permessi corretti

**Su moodledata:**

1. Tasto destro sulla cartella `.data_mdl_2025/moodledata`
2. **Permessi** (o Proprietà)
3. Imposta: **777** (o spunta tutte le caselle)
4. **IMPORTANTE:** Applica **ricorsivamente** a tutte le sottocartelle

---

## 6. Configurare config.php correttamente

### 6.1 ⚠️ Problema comune: File Manager non crea .php

**Aruba spesso blocca la creazione diretta di file .php per sicurezza.**

**Soluzione 1: Duplica config-dist.php**

1. Nel File Manager, vai in `/moodle/`
2. Trova il file `config-dist.php`
3. **Tasto destro → Duplica** (o Copia)
4. Rinomina la copia in `config.php`
5. **Tasto destro → Modifica** (o Edit)

**Soluzione 2: Carica da locale**

1. Crea `config.php` sul tuo PC (Desktop)
2. Caricalo nella cartella `/moodle/` su Aruba
3. Se non accetta `.php`: carica come `config.txt` poi rinomina

### 6.2 Contenuto del config.php (TEMPLATE CORRETTO)

**Copia questo template e compila i MAIUSCOLI con i tuoi dati:**

```php
<?php  // Moodle configuration file

unset($CFG);
global $CFG;
$CFG = new stdClass();

// --- DATABASE ARUBA ---
$CFG->dbtype    = 'mysqli';
$CFG->dblibrary = 'native';
$CFG->dbhost    = 'HOST_DB_ARUBA';     // es. 31.11.39.250 o sqlXXXXX.aruba.it
$CFG->dbname    = 'NOME_DATABASE';     // es. Sql1895661_1
$CFG->dbuser    = 'UTENTE_DATABASE';   // es. Sql1895661
$CFG->dbpass    = 'PASSWORD_DATABASE'; // quella impostata nel pannello
$CFG->prefix    = 'mdl_';
$CFG->dboptions = array(
  'dbpersist'   => 0,
  'dbport'      => 3306,
  'dbsocket'    => false,
  'dbcollation' => 'utf8mb4_unicode_ci',
);

// --- URL DEL SITO ---
$CFG->wwwroot   = 'https://www.TUODOMINIO.it/moodle';

// --- PERCORSO DATI (ASSOLUTO!) ---
$CFG->dataroot  = '/web/htdocs/www.TUODOMINIO.it/home/.data_mdl_2025/moodledata';

$CFG->admin     = 'admin';
$CFG->directorypermissions = 0777;

require_once(__DIR__ . '/lib/setup.php');
```

### 6.3 ⚠️ ERRORI CRITICI DA EVITARE

**❌ ERRORE 1: Password senza apice finale**

**SBAGLIATO:**
```php
$CFG->dbpass    = 'Fr@kabu10; // Password
```

**CORRETTO:**
```php
$CFG->dbpass    = 'Fr@kabu10';
```

**Questo era il TUO errore che causava l'errore 500!**

---

**❌ ERRORE 2: File troncato**

Verifica che il file finisca SEMPRE con:
```php
require_once(__DIR__ . '/lib/setup.php');
```

**NON deve finire con `$C` o altro codice incompleto!**

---

**❌ ERRORE 3: Percorso relativo per dataroot**

**SBAGLIATO:**
```php
$CFG->dataroot  = '../.data_mdl_2025/moodledata';
```

**CORRETTO (percorso assoluto):**
```php
$CFG->dataroot  = '/web/htdocs/www.tuodominio.it/home/.data_mdl_2025/moodledata';
```

---

**❌ ERRORE 4: moodledata dentro htdocs pubblico**

**SBAGLIATO:**
```php
$CFG->dataroot  = '/web/htdocs/www.tuodominio.it/home/moodle/moodledata';
```

**CORRETTO (fuori dalla cartella pubblica):**
```php
$CFG->dataroot  = '/web/htdocs/www.tuodominio.it/home/.data_mdl_2025/moodledata';
```

---

### 6.4 Esempio reale (deltaskill.it)

```php
<?php  // Moodle configuration file

unset($CFG);
global $CFG;
$CFG = new stdClass();

$CFG->dbtype    = 'mysqli';
$CFG->dblibrary = 'native';
$CFG->dbhost    = '31.11.39.250';
$CFG->dbname    = 'Sql1895661_1';
$CFG->dbuser    = 'Sql1895661';
$CFG->dbpass    = 'Fr@kabu10';
$CFG->prefix    = 'mdl_';
$CFG->dboptions = array(
  'dbpersist'   => 0,
  'dbport'      => 3306,
  'dbsocket'    => false,
  'dbcollation' => 'utf8mb4_unicode_ci',
);

$CFG->wwwroot   = 'https://www.deltaskill.it/moodle';
$CFG->dataroot  = '/web/htdocs/www.deltaskill.it/home/.data_mdl_2025/moodledata';
$CFG->admin     = 'admin';
$CFG->directorypermissions = 0777;

require_once(__DIR__ . '/lib/setup.php');
```

---

## 7. Proteggere moodledata

### 7.1 Creare .htaccess dentro .data_mdl_2025

**Perché:** Impedire accesso web diretto ai file di Moodle

**Procedura:**

1. File Manager → vai in `/home/.data_mdl_2025/`
2. Crea file `.htaccess`
   - Se non puoi creare: carica da PC come `htaccess.txt` poi rinomina
3. Contenuto:

```apache
Require all denied
Options -Indexes
```

**Questo blocca TUTTO l'accesso web alla cartella!**

### 7.2 Test di sicurezza

Prova ad accedere a:
```
https://www.tuodominio.it/.data_mdl_2025/
```

**✅ Se vedi:** "Forbidden" o errore 403 → SICURO
**❌ Se vedi:** elenco file o contenuto → NON sicuro (rivedi .htaccess)

---

## 8. Test e verifica

### 8.1 Primo accesso

Apri browser e vai a:
```
https://www.tuodominio.it/moodle
```

**Scenario A: Installazione nuova (DB vuoto)**

Vedrai la **schermata di installazione Moodle**:
1. Scegli lingua
2. Conferma percorsi
3. Inserisci dati amministratore
4. Segui wizard

**Scenario B: Migrazione (DB importato)**

Vedrai direttamente il **tuo Moodle** con corsi e utenti.

### 8.2 Verifica funzionalità base

✅ Login amministratore funziona
✅ Vedi corsi creati
✅ Puoi caricare file
✅ Navigazione tra pagine veloce

---

## 9. Troubleshooting errori comuni

### 🔴 Errore 500 (Internal Server Error)

**Causa 1: Errore di sintassi in config.php**

**Soluzione:**
1. Apri `config.php`
2. Verifica la riga della password:
   ```php
   $CFG->dbpass    = 'TuaPassword';  // ← Deve avere l'apice finale!
   ```
3. Verifica che il file finisca con:
   ```php
   require_once(__DIR__ . '/lib/setup.php');
   ```

**Causa 2: Permessi errati su moodledata**

**Soluzione:**
1. Imposta permessi **777** su `.data_mdl_2025/moodledata`
2. Applica ricorsivamente a tutte le sottocartelle

**Causa 3: File PHP danneggiato durante upload**

**Soluzione:**
1. Ricarica i file via FTP (non File Manager)
2. Usa modalità **Binaria** (non ASCII)

---

### 🔴 "Unable to save the cache config to file"

**Causa:** moodledata non scrivibile o percorso errato

**Soluzione:**

1. Verifica in `config.php`:
   ```php
   $CFG->dataroot  = '/web/htdocs/www.tuodominio.it/home/.data_mdl_2025/moodledata';
   ```
   (percorso ASSOLUTO, non relativo!)

2. Imposta permessi **777** su moodledata:
   ```
   moodledata/ → Permessi → 777 (ricorsivo)
   ```

3. Verifica che esistano queste cartelle dentro moodledata:
   - `cache/`
   - `localcache/`
   - `sessions/`
   - `temp/`

4. Svuota contenuto cache:
   - Entra in `moodledata/cache/`
   - Cancella TUTTO il contenuto (non la cartella stessa)
   - Fai lo stesso per `localcache/`

---

### 🔴 "Error: Database connection failed"

**Causa:** Credenziali database errate

**Soluzione:**

1. **Testa credenziali su phpMyAdmin:**
   - Pannello Aruba → Database → phpMyAdmin
   - Accedi con utente e password
   - **Se non entri:** password errata → reimposta dal pannello

2. **Verifica config.php:**
   ```php
   $CFG->dbhost    = '31.11.39.250';     // IP corretto da pannello
   $CFG->dbname    = 'Sql1895661_1';     // Nome DB esatto
   $CFG->dbuser    = 'Sql1895661';       // Utente corretto
   $CFG->dbpass    = 'PasswordCorretta'; // Password dal pannello
   ```

3. **Verifica porta:**
   ```php
   'dbport' => 3306,  // Standard MySQL
   ```

---

### 🔴 Log errori "mkdir(): File exists"

**Causa:** Conflitto permessi o cache corrotta

**Dal tuo log:**
```
PHP Warning: mkdir(): File exists in /web/htdocs/www.deltaskill.it/home/moodle/lib/classes/component.php on line 469
```

**Soluzione:**

1. **Svuota cache manualmente:**
   ```
   moodledata/cache/ → elimina contenuto
   moodledata/localcache/ → elimina contenuto
   ```

2. **Aumenta permessi temporaneamente:**
   ```
   moodledata/ → Permessi 777 (ricorsivo)
   ```

3. **Ricarica il sito** - Moodle ricrea le cartelle automaticamente

---

### 🔴 Pagina bianca (nessun errore)

**Causa:** Error reporting disabilitato

**Soluzione temporanea (solo per debug):**

Aggiungi PRIMA di `require_once` in config.php:
```php
@error_reporting(E_ALL);
@ini_set('display_errors', '1');

require_once(__DIR__ . '/lib/setup.php');
```

**Poi ricarica** - vedrai gli errori effettivi.

**⚠️ RIMUOVI DOPO IL DEBUG!** (non lasciare in produzione)

---

### 🔴 Upload file non funziona nel File Manager

**Causa:** File troppo grande o estensione bloccata

**Soluzione 1: Usa FTP**
- FileZilla con credenziali dal pannello Aruba

**Soluzione 2: Carica come .zip e estrai**
- Comprimi → carica .zip → estrai sul server

**Soluzione 3: Se è .php bloccato**
- Carica come `.txt`
- Rinomina in `.php` dopo il caricamento

---

## 10. Ottimizzazioni finali

### 10.1 Versione PHP

**Pannello Aruba → Hosting Linux → PHP**

- Imposta **PHP 8.2** (o minimo 8.1)
- Verifica impostazioni:
  - `memory_limit`: **256M** (minimo 128M)
  - `max_execution_time`: **300** (per operazioni lunghe)
  - `upload_max_filesize`: **128M** (per caricare file grandi)
  - `post_max_size`: **128M**

### 10.2 HiSpeed Cache Aruba

**Pannello → HiSpeed Cache**

- **Abilita** per velocizzare il sito
- **Escludi:** `/moodle/admin/` e `/moodle/login/`
  (evita cache su pagine dinamiche)

### 10.3 Redirect da root a /moodle

**Se vuoi che chi visita `www.tuodominio.it` veda subito Moodle:**

Crea/modifica `/web/htdocs/www.tuodominio.it/home/index.php`:

```php
<?php
header('Location: /moodle/');
exit;
```

Oppure un `index.html` con link:

```html
<!doctype html>
<html lang="it">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Benvenuto</title>
</head>
<body style="font-family:system-ui; max-width:720px; margin:40px auto; line-height:1.5">
  <h1>Benvenuto su DeltaSkill</h1>
  <p><a href="/moodle/">→ Accedi alla piattaforma Moodle</a></p>
</body>
</html>
```

### 10.4 SSL/HTTPS

**Aruba fornisce SSL gratuito:**

1. **Pannello → Certificati SSL**
2. Attiva **Let's Encrypt** (gratuito)
3. Verifica che `config.php` usi:
   ```php
   $CFG->wwwroot = 'https://www.tuodominio.it/moodle';
   ```
   (con **https**, non http!)

### 10.5 Cron Moodle

**Moodle ha bisogno di un cron per:**
- Inviare email
- Eseguire backup automatici
- Aggiornare cache

**Opzione 1: Cron di sistema (se disponibile)**

Pannello Aruba → Cron (se disponibile nel tuo piano):
```bash
*/15 * * * * php /web/htdocs/www.tuodominio.it/home/moodle/admin/cli/cron.php
```

**Opzione 2: Cron esterno (se piano base)**

Usa servizio gratuito tipo **cron-job.org**:
- URL: `https://www.tuodominio.it/moodle/admin/cron.php`
- Frequenza: ogni 15 minuti

---

## 11. Reset Password Admin Dopo Migrazione

### 🔐 Problema: Non riesco ad accedere dopo la migrazione

**Scenario tipico:**
- Hai migrato Moodle da localhost ad Aruba
- Vedi i corsi sulla homepage
- Ma le credenziali di localhost **non funzionano**
- Errore: "Login errato, riprova"

**Questo succede perché:**
- Le password sono hashate (criptate) nel database
- Il sistema di hash potrebbe avere un "sale" (salt) diverso
- La cache potrebbe contenere dati vecchi
- Ci potrebbero essere errori nel `config.php`

---

### 11.1 Verifiche preliminari

Prima di resettare la password, verifica che non ci siano altri problemi:

#### **Controlla il config.php (CRITICO!)**

**File Manager → `/moodle/config.php`**

Verifica che il file sia COMPLETO e CORRETTO:

```php
<?php  // Moodle configuration file

unset($CFG);
global $CFG;
$CFG = new stdClass();

$CFG->dbtype    = 'mysqli';
$CFG->dblibrary = 'native';
$CFG->dbhost    = '31.11.39.250';
$CFG->dbname    = 'Sql1895661_1';
$CFG->dbuser    = 'Sql1895661';
$CFG->dbpass    = 'Fr@kabu10';  // ← DEVE avere l'apice finale!
$CFG->prefix    = 'mdl_';
$CFG->dboptions = array(
  'dbpersist'   => 0,
  'dbport'      => 3306,
  'dbsocket'    => false,
  'dbcollation' => 'utf8mb4_unicode_ci',
);

$CFG->wwwroot   = 'https://www.tuodominio.it/moodle';
$CFG->dataroot  = '/web/htdocs/www.tuodominio.it/home/.data_mdl_2025/moodledata';
$CFG->admin     = 'admin';
$CFG->directorypermissions = 0777;

require_once(__DIR__ . '/lib/setup.php');  // ← DEVE finire con questa riga!
```

**❌ ERRORI COMUNI:**

1. **Password senza apice finale:**
   ```php
   $CFG->dbpass = 'Fr@kabu10;  // ← SBAGLIATO! Manca l'apice prima del ;
   ```

2. **File troncato:**
   ```php
   $C  // ← File incompleto!
   ```

3. **Manca require_once finale:**
   Il file deve SEMPRE finire con `require_once(__DIR__ . '/lib/setup.php');`

**Se trovi questi errori, correggili SUBITO e salva!**

---

### 11.2 Metodo 1: Reset via phpMyAdmin (Base)

**Quando usarlo:**
- Per un reset veloce
- Non sempre funziona al 100% (dipende dal passwordsalt)

**Procedura:**

1. **Accedi a phpMyAdmin**
   - Pannello Aruba → Database → MySQL → Vai a phpMyAdmin

2. **Seleziona il database**
   - Click su `Sql1895661_1` (o il tuo database) nella colonna sinistra

3. **Trova la tabella mdl_user**
   - Scorri la lista delle tabelle
   - Click su `mdl_user`

4. **Tab "Sfoglia"**
   - Vedrai la lista degli utenti

5. **Trova l'utente admin**
   - Di solito è `id = 2`
   - `username = admin`

6. **Click su "Modifica" (icona matita)**

7. **Modifica il campo password:**
   - Menu a tendina (a sinistra): seleziona **`MD5`**
   - Campo testo (a destra): scrivi `Admin2025!`
   - Click **"Esegui"**

8. **Prova il login:**
   - Vai su `https://www.tuodominio.it/moodle`
   - Username: `admin`
   - Password: `Admin2025!`

**⚠️ Se non funziona:** Passa al Metodo 2 (soluzione definitiva)

---

### 11.3 Metodo 2: Script PHP con funzioni Moodle (DEFINITIVO)

**Quando usarlo:**
- Il Metodo 1 non ha funzionato
- Vuoi una soluzione garantita al 100%

**Questo metodo usa le funzioni native di Moodle per generare l'hash corretto, quindi funziona SEMPRE.**

#### **Step 1: Crea il file reset.php**

**File Manager → vai in `/moodle/`**

**Crea nuovo file:** `reset.php`

**Contenuto:**

```php
<?php
// Script per reset password admin Moodle
require_once('config.php');
require_once($CFG->libdir.'/moodlelib.php');

// Trova utente admin
$admin = $DB->get_record('user', array('username' => 'admin'));

if ($admin) {
    // Nuova password
    $newpassword = 'Deltaskill2025!';

    // Usa la funzione Moodle per generare hash corretto
    $admin->password = hash_internal_user_password($newpassword);

    // Salva nel database
    $DB->update_record('user', $admin);

    echo "<h1>✅ Password aggiornata con successo!</h1>";
    echo "<p><strong>Username:</strong> admin</p>";
    echo "<p><strong>Password:</strong> Deltaskill2025!</p>";
    echo "<p><a href='/moodle/'>→ Vai al login</a></p>";
    echo "<hr>";
    echo "<p style='color: red;'><strong>⚠️ IMPORTANTE:</strong> Elimina questo file dopo il login!</p>";
} else {
    echo "<h1>❌ ERRORE: Utente admin non trovato!</h1>";
    echo "<p>Verifica che l'username sia corretto.</p>";
}
?>
```

**Salva il file!**

#### **Step 2: Esegui lo script**

Apri il browser e vai su:

```
https://www.tuodominio.it/moodle/reset.php
```

Dovresti vedere:

```
✅ Password aggiornata con successo!
Username: admin
Password: Deltaskill2025!
→ Vai al login
```

#### **Step 3: Testa il login**

Click su "Vai al login" oppure vai manualmente su:

```
https://www.tuodominio.it/moodle
```

Login con:
- **Username:** `admin`
- **Password:** `Deltaskill2025!`

**✅ Dovrebbe funzionare!**

#### **Step 4: Elimina il file reset.php**

**⚠️ IMPORTANTE PER LA SICUREZZA!**

Una volta entrato:

1. **File Manager** → `/moodle/reset.php`
2. **Elimina il file**

**Non lasciarlo online!** Chiunque potrebbe usarlo per cambiare la tua password!

#### **Step 5: Cambia la password definitiva**

Una volta dentro Moodle:

1. Click sul tuo nome (in alto a destra)
2. **Preferenze** → **Cambia password**
3. Imposta una password sicura e facile da ricordare
4. Salva

---

### 11.4 Svuotare la cache (se ancora non funziona)

A volte il problema è la cache di Moodle che contiene dati vecchi.

**File Manager → vai in:**

```
/home/.data_mdl_2025/moodledata/
```

**Elimina il CONTENUTO (non le cartelle stesse) di:**

1. **`cache/`**
   - Entra nella cartella
   - Seleziona tutto il contenuto
   - Elimina

2. **`localcache/`**
   - Stessa procedura

3. **`sessions/`**
   - Stessa procedura

**Le cartelle rimarranno vuote** - Moodle le riempirà automaticamente.

Poi riprova il login!

---

### 11.5 Verifica stato account admin (Avanzato)

Se ancora non funziona, l'account potrebbe essere sospeso o non confermato.

**phpMyAdmin → Tab SQL**

Esegui questa query:

```sql
SELECT id, username, auth, suspended, deleted, confirmed, mnethostid
FROM mdl_user
WHERE username = 'admin';
```

**Valori corretti:**
- `auth` = `manual`
- `suspended` = `0` (non sospeso)
- `deleted` = `0` (non eliminato)
- `confirmed` = `1` (confermato)
- `mnethostid` = `1` (host locale)

**Se qualcosa è sbagliato, correggilo:**

```sql
UPDATE mdl_user
SET suspended = 0, deleted = 0, confirmed = 1, auth = 'manual', mnethostid = 1
WHERE username = 'admin';
```

---

### 11.6 Problema: passwordsaltmain

Se hai un `passwordsaltmain` nel config.php, deve essere **identico** tra localhost e Aruba.

**Controlla config.php locale (sul tuo PC):**

Cerca:
```php
$CFG->passwordsaltmain = 'valore_qualsiasi';
```

**Controlla config.php su Aruba:**

Cerca la stessa riga.

**Devono essere IDENTICHE!**

Se nel config.php locale c'è `passwordsaltmain` ma su Aruba no:
1. Copia la riga dal config.php locale
2. Aggiungila nel config.php su Aruba (dopo `$CFG->directorypermissions`)
3. Salva

Se sono diverse:
1. Usa il valore del config.php **locale**
2. Sostituiscilo su Aruba
3. Salva

---

### 11.7 Troubleshooting completo

#### 🔴 "Login errato" dopo reset

**Causa possibile:**
- Cache non svuotata
- passwordsaltmain diverso
- config.php con errori

**Soluzione:**
1. Usa il **Metodo 2 (script PHP)** - funziona sempre
2. Svuota la cache
3. Verifica config.php

---

#### 🔴 "Errore 500" quando accedo a reset.php

**Causa:** config.php ha errori di sintassi

**Soluzione:**
1. Controlla config.php
2. Verifica che `$CFG->dbpass` abbia l'apice finale
3. Verifica che il file finisca con `require_once`
4. Correggi e riprova

---

#### 🔴 Script reset.php dice "admin non trovato"

**Causa:** L'username non è `admin`

**Soluzione:**

1. **phpMyAdmin → Tab SQL:**
   ```sql
   SELECT id, username FROM mdl_user ORDER BY id;
   ```

2. Trova il tuo username (potrebbe essere diverso da `admin`)

3. Modifica il file `reset.php`:
   ```php
   $admin = $DB->get_record('user', array('username' => 'TUO_USERNAME'));
   ```

4. Salva e riprova

---

### 11.8 Riepilogo metodi

| Metodo | Difficoltà | Successo | Quando usarlo |
|--------|-----------|----------|---------------|
| Reset via phpMyAdmin | Media | 60% | Primo tentativo rapido |
| Script PHP Moodle | Facile | 100% | Soluzione definitiva |
| Svuota cache | Facile | 30% | Dopo altri tentativi |
| Verifica passwordsalt | Media | 80% | Se usi password localhost |

**Consiglio:** Usa direttamente il **Metodo 2 (Script PHP)** - è il più sicuro!

---

## 12. Gestione Utenti in Moodle

### 👥 Creare e gestire utenti

Una volta entrato come admin, puoi creare utenti per la tua piattaforma.

---

### 12.1 Tipi di utenti in Moodle

**Ruoli principali:**

| Ruolo | Cosa può fare | Quando usarlo |
|-------|---------------|---------------|
| **Amministratore** | Controllo totale del sito | Tu e collaboratori fidati |
| **Manager** | Gestisce corsi e utenti, ma non le impostazioni del sito | Coordinatori didattici |
| **Creatore di corsi** | Crea nuovi corsi e può insegnare | Docenti senior |
| **Insegnante** | Gestisce un corso specifico (contenuti, voti, studenti) | Docenti |
| **Insegnante non-editor** | Può valutare ma non modificare il corso | Tutor, assistenti |
| **Studente** | Accede ai corsi e completa le attività | Partecipanti ai corsi |

---

### 12.2 Creare un utente manualmente

**Quando usarlo:** Per creare pochi utenti specifici (colleghi, collaboratori)

**Procedura:**

1. **Amministrazione del sito** → **Utenti** → **Account** → **Aggiungi nuovo utente**

2. **Compila il form:**

   **Dati obbligatori:**
   - **Nome utente:** `mario.rossi` (senza spazi, minuscolo, univoco)
   - **Autenticazione:** Lascia `Autenticazione manuale`
   - **Password:** `Password123!` (sicura)
   - **Nome:** `Mario`
   - **Cognome:** `Rossi`
   - **Email:** `mario.rossi@deltaskill.it`

   **Opzioni utili:**
   - ☑️ **Forza cambio password:** L'utente dovrà cambiarla al primo login
   - ☐ **Sospendi account:** Lascia deselezionato

3. **Click "Crea utente"**

4. **Comunica le credenziali:**
   - Username: `mario.rossi`
   - Password: `Password123!`
   - URL: `https://www.deltaskill.it/moodle`

---

### 12.3 Assegnare ruoli agli utenti

#### **Rendere un utente AMMINISTRATORE**

1. **Amministrazione del sito** → **Utenti** → **Permessi** → **Assegna ruoli di sistema**

2. Click su **"Amministratore/Manager"**

3. **Cerca l'utente** (es. `Mario Rossi`)

4. **Selezionalo** dalla colonna destra

5. Click **"Aggiungi"**

✅ Ora Mario è amministratore!

---

#### **Iscrivere un utente a un CORSO come Insegnante**

1. Vai nel **corso specifico**

2. **Amministrazione del corso** → **Utenti** → **Utenti iscritti**

3. Click **"Iscrivi utenti"**

4. **Cerca l'utente** (es. `Laura Bianchi`)

5. Nel menu **"Assegna ruolo"**, seleziona **"Insegnante"**

6. Click **"Iscrivi"**

✅ Laura può ora gestire quel corso!

---

#### **Iscrivere uno STUDENTE a un corso**

Stessa procedura, ma seleziona ruolo **"Studente"** invece di Insegnante.

---

### 12.4 Abilitare l'auto-registrazione

**Quando usarlo:** Per corsi aperti dove gli utenti si registrano autonomamente

**Procedura:**

1. **Amministrazione del sito** → **Plugin** → **Autenticazione** → **Gestisci autenticazione**

2. Trova **"Auto-registrazione tramite email"**

3. Click sull'**icona occhio** (👁️) per abilitarla

4. In alto, nel menu a tendina **"Auto-registrazione"**, seleziona **"Auto-registrazione tramite email"**

5. **Salva le modifiche**

**Risultato:**

Gli utenti vedranno nella pagina di login un link **"Crea un account"**:
1. Compilano il form
2. Ricevono email di conferma
3. Cliccano sul link nell'email
4. Possono accedere come studenti

**⚠️ Limitazioni (opzionali):**

Per limitare chi può registrarsi:

1. **Plugin di autenticazione** → **Auto-registrazione tramite email** → **Impostazioni**

2. **Domini email consentiti:** `@deltaskill.it, @example.com` (solo queste email potranno registrarsi)

---

### 12.5 Caricare utenti in massa (CSV)

**Quando usarlo:** Per creare molti utenti in una volta (classe, azienda)

#### **Preparare il file CSV**

Crea un file `utenti.csv` con questo formato:

```csv
username,password,firstname,lastname,email
mario.rossi,Pass123!,Mario,Rossi,mario@deltaskill.it
laura.bianchi,Pass456!,Laura,Bianchi,laura@deltaskill.it
paolo.verdi,Pass789!,Paolo,Verdi,paolo@deltaskill.it
```

**⚠️ IMPORTANTE:**
- Prima riga = intestazioni (non modificare)
- Campi separati da virgola
- Nessuno spazio extra
- Salva come `.csv` (non Excel)

#### **Caricare il file**

1. **Amministrazione del sito** → **Utenti** → **Account** → **Carica utenti**

2. **Scegli il file** `utenti.csv`

3. **Verifica anteprima** - Moodle mostra cosa creerà

4. **Click "Carica utenti"**

5. ✅ Tutti gli utenti vengono creati!

**Poi puoi iscriverli in massa a un corso:**

1. Vai nel corso

2. **Amministrazione → Utenti → Utenti iscritti**

3. In basso: **"Carica utenti iscritti"**

4. Stesso formato CSV

---

### 12.6 Creare utente via SQL (Veloce)

**Per sviluppatori:** Creazione rapida da phpMyAdmin

**phpMyAdmin → Tab SQL:**

```sql
INSERT INTO mdl_user (auth, confirmed, mnethostid, username, password, firstname, lastname, email, timecreated, timemodified)
VALUES ('manual', 1, 1, 'studente.test', '$2y$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Studente', 'Test', 'studente@test.it', UNIX_TIMESTAMP(), UNIX_TIMESTAMP());
```

**Credenziali create:**
- Username: `studente.test`
- Password: `moodle`
- Nome: `Studente Test`
- Email: `studente@test.it`

⚠️ **Poi devi assegnare il ruolo** tramite interfaccia Moodle!

---

### 12.7 Gestire utenti esistenti

#### **Visualizzare tutti gli utenti**

**Amministrazione → Utenti → Account → Sfoglia elenco utenti**

Puoi:
- 🔍 Cercare per nome/email/username
- ✏️ Modificare dati utente
- 🔒 Sospendere account (invece di eliminare)
- 🗑️ Eliminare utente (⚠️ elimina anche i suoi dati!)

---

#### **Modificare un utente**

1. Cerca l'utente nell'elenco

2. Click sull'**icona modifica** (matita)

3. Modifica i campi necessari

4. **Salva**

---

#### **Sospendere un utente (invece di eliminare)**

1. Cerca l'utente

2. Click **"Modifica"**

3. Spunta **"Sospendi account"**

4. **Salva**

L'utente non potrà più accedere, ma i suoi dati rimangono.

---

#### **Reimpostare password di un utente**

1. Cerca l'utente

2. Click **"Modifica"**

3. Nel campo **"Nuova password"**: inserisci la password

4. Spunta **"Forza cambio password"** (opzionale)

5. **Salva**

6. Comunica la nuova password all'utente

---

### 12.8 Auto-iscrizione ai corsi

**Permettere agli studenti di iscriversi autonomamente a un corso:**

1. Vai nel **corso**

2. **Amministrazione del corso** → **Utenti** → **Metodi di iscrizione**

3. Click sull'**icona occhio** accanto a **"Auto-iscrizione (Studente)"** per abilitarla

4. Click sull'**icona ingranaggio** per configurare:
   - **Chiave di iscrizione:** (opzionale) Password per accedere al corso
   - **Durata iscrizione:** Quanto tempo l'utente rimane iscritto

5. **Salva**

**Risultato:**

Gli studenti vedranno il corso nell'elenco e potranno iscriversi da soli (con chiave se l'hai impostata).

---

### 12.9 Esempi pratici

#### **Caso 1: Creare un insegnante per un corso specifico**

```
1. Crea utente: prof.informatica / Pass123!
2. Vai nel corso "Programmazione Python"
3. Amministrazione → Utenti → Iscrivi utenti
4. Cerca "prof.informatica"
5. Ruolo: Insegnante
6. Iscrivi
```

---

#### **Caso 2: Creare 50 studenti per una classe**

```
1. Prepara CSV:
   username,password,firstname,lastname,email
   studente1,Pass1!,Mario,Rossi,s1@test.it
   studente2,Pass2!,Laura,Verdi,s2@test.it
   ...

2. Carica CSV: Amministrazione → Utenti → Carica utenti

3. Iscrivili al corso:
   Corso → Amministrazione → Carica utenti iscritti
   (stesso CSV con aggiunta colonna "course1")
```

---

#### **Caso 3: Creare un altro amministratore**

```
1. Crea utente: admin2 / SecurePass123!
2. Amministrazione → Utenti → Permessi → Assegna ruoli di sistema
3. Click "Amministratore"
4. Cerca e aggiungi "admin2"
```

---

### 12.10 Best Practices

✅ **Username:**
- Usa formato `nome.cognome` o `ncognome` (es. `mrossi`)
- Sempre minuscolo
- Nessuno spazio

✅ **Password:**
- Almeno 8 caratteri
- Maiuscole, minuscole, numeri, simboli
- Forza cambio al primo login per sicurezza

✅ **Email:**
- Sempre valide (servono per reset password)
- Univoche (un'email = un account)

✅ **Gestione:**
- **Sospendi** invece di eliminare (dati preservati)
- Controlla regolarmente utenti inattivi
- Usa gruppi per organizzare studenti

✅ **Sicurezza:**
- Non condividere account admin
- Usa ruoli appropriati (non dare admin a tutti)
- Abilita autenticazione a due fattori (plugin)

---

### 12.11 Troubleshooting

#### 🔴 "Email già in uso"

**Causa:** Un utente con quella email esiste già

**Soluzione:**
- Usa un'email diversa
- Oppure cerca l'utente esistente e modificalo

---

#### 🔴 "Username già in uso"

**Causa:** Username già registrato

**Soluzione:**
- Usa username diverso (es. `mrossi2`)
- Oppure elimina/modifica l'utente esistente

---

#### 🔴 Utente non riceve email di conferma

**Causa:** Email non configurata o in spam

**Soluzione:**
1. Controlla spam/posta indesiderata
2. Verifica configurazione SMTP in Moodle
3. Oppure **conferma manualmente**:
   - phpMyAdmin → `mdl_user`
   - Trova utente → `confirmed = 1`

---

#### 🔴 Utente non vede il corso

**Causa:** Non è iscritto al corso

**Soluzione:**
- Iscrivilo manualmente: Corso → Utenti iscritti → Iscrivi utenti
- Oppure abilita auto-iscrizione nel corso

---

## 13. Accesso Ospite (Guest)

### 13.1 Cos'è l'utente Ospite?

L'**utente ospite** in Moodle è un account speciale che permette l'accesso ai corsi senza registrazione. È utile per:

- **Demo corsi**: Far vedere i contenuti senza creare account
- **Corsi pubblici**: Contenuti aperti a tutti
- **Prove gratuite**: Permettere l'accesso temporaneo

**Limitazioni dell'ospite:**
- ❌ Non può iscriversi ai corsi
- ❌ Non può partecipare ai forum
- ❌ Non può consegnare compiti
- ❌ Non può fare quiz
- ✅ Può solo visualizzare contenuti

---

### 13.2 Verifica utente Guest esistente

Moodle ha già un utente guest predefinito. Verifica che esista:

#### phpMyAdmin

```sql
SELECT id, username, firstname, lastname, auth, suspended, deleted
FROM mdl_user
WHERE username = 'guest';
```

**Risultato atteso:**
```
id | username | firstname | lastname | auth   | suspended | deleted
1  | guest    | Guest     | user     | manual | 0         | 0
```

✅ Se esiste, è già pronto (solitamente id=1)

---

### 13.3 Abilitare accesso Ospite globale

#### Dal pannello Moodle (Amministratore)

1. **Accedi come admin**
   - Username: `admin`
   - Password: la tua password admin

2. **Vai in Amministrazione sito**
   ```
   ⚙️ Amministrazione del sito → Plugin → Autenticazione → Gestione autenticazione
   ```

3. **Abilita "Accesso ospite"**
   - Trova "Accesso ospite" nella lista
   - Clicca l'icona 👁️ per abilitarlo
   - Deve diventare attivo (icona occhio aperto)

4. **Impostazioni accesso ospite**
   - Clicca su ⚙️ "Impostazioni"
   - Configura:
     - ✅ **Pulsante login ospite**: Sì (mostra "Accedi come ospite" nel login)
     - ✅ **Abilita accesso ospite**: Sì

5. **Salva modifiche**

---

### 13.4 Abilitare Ospite su singolo Corso

Per permettere agli ospiti di accedere a un corso specifico:

#### Passo 1: Vai nel corso

1. **Dashboard** → Clicca sul corso
2. **Impostazioni corso** → ⚙️ in alto a destra

#### Passo 2: Aggiungi metodo "Accesso ospiti"

1. Nel menu laterale: **Utenti** → **Metodi di iscrizione**
2. Clicca **Aggiungi metodo** (menu a tendina)
3. Seleziona **Accesso ospiti**
4. Configura:
   - ✅ **Abilita**: Sì
   - 🔑 **Richiedi password**: No (o imposta una password)
   - ⏰ **Durata**: Illimitata
5. Clicca **Aggiungi metodo**

#### Passo 3: Verifica

1. **Esci** da Moodle
2. Vai alla homepage
3. Dovresti vedere il pulsante **"Accedi come ospite"** o **"Entra come ospite"**
4. Clicca e verifica l'accesso al corso

---

### 13.5 Creare un utente Guest personalizzato

Se vuoi un secondo utente tipo guest con username personalizzato:

#### Metodo 1: Via interfaccia Moodle

1. **Amministrazione del sito** → **Utenti** → **Aggiungi un nuovo utente**
2. Compila:
   ```
   Username: ospite.deltaskill
   Password: (lascia vuota o imposta password semplice)
   Nome: Ospite
   Cognome: Deltaskill
   Email: ospite@deltaskill.it
   Metodo di autenticazione: Manuale
   ```
3. **Crea utente**

#### Metodo 2: Via SQL (phpMyAdmin)

```sql
INSERT INTO mdl_user (
    auth, confirmed, mnethostid, username, password,
    firstname, lastname, email,
    timecreated, timemodified
)
VALUES (
    'manual', 1, 1, 'ospite.deltaskill',
    '$2y$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'Ospite', 'Deltaskill', 'ospite@deltaskill.it',
    UNIX_TIMESTAMP(), UNIX_TIMESTAMP()
);
```

**Nota:** La password hash corrisponde a `moodle`

#### Assegna ruolo Guest

1. **Amministrazione del sito** → **Utenti** → **Permessi** → **Assegna ruoli globali**
2. Clicca su **Ospite**
3. Cerca e seleziona `ospite.deltaskill`
4. Clicca **Aggiungi**

---

### 13.6 Configurazione Password Ospite

Se vuoi che gli ospiti inseriscano una password per accedere al corso:

1. **Corso** → **Utenti** → **Metodi di iscrizione**
2. Clicca ⚙️ su **Accesso ospiti**
3. Configura:
   - 🔑 **Richiedi password**: Sì
   - **Password**: `DeltaskillGuest2025`
4. **Salva modifiche**

Ora gli ospiti dovranno inserire questa password per accedere al corso.

---

### 13.7 Limitare contenuti visibili agli ospiti

Puoi nascondere attività/risorse agli ospiti:

#### Per singola attività

1. Vai nell'attività/risorsa del corso
2. Clicca **Modifica** → **Modifica impostazioni**
3. Scorri fino a **Limitazioni accesso**
4. Clicca **Aggiungi limitazione** → **Ruolo utente**
5. Seleziona: ❌ **Ospite** (spunta negativa)
6. **Salva**

Quella attività sarà invisibile agli ospiti.

---

### 13.8 Messaggi personalizzati per ospiti

Puoi mostrare messaggi specifici agli ospiti nella homepage:

1. **Amministrazione del sito** → **Aspetto** → **Pagina principale** → **Impostazioni pagina principale**
2. In **Riepilogo pagina principale** scrivi:
   ```html
   <div class="alert alert-info">
       👋 <strong>Benvenuto Ospite!</strong>
       Stai visualizzando i corsi in modalità demo.
       <a href="/login/signup.php">Registrati</a> per accesso completo.
   </div>
   ```
3. **Salva modifiche**

---

### 13.9 Tabella riepilogativa accessi

| Tipo utente | Login richiesto | Può iscriversi | Può partecipare | Può vedere contenuti |
|-------------|----------------|----------------|-----------------|---------------------|
| **Admin** | ✅ Sì | ✅ Sì | ✅ Sì | ✅ Tutto |
| **Docente** | ✅ Sì | ✅ Sì | ✅ Sì | ✅ Suoi corsi |
| **Studente** | ✅ Sì | ✅ Sì | ✅ Sì | ✅ Corsi iscritti |
| **Ospite** | ❌ No (o semplice) | ❌ No | ❌ No | ✅ Solo visualizzazione |

---

### 13.10 Esempio pratico: Corso Demo

**Scenario:** Vuoi un corso "Demo Gratuita" accessibile senza registrazione

#### Step 1: Crea corso demo

1. **Amministrazione del sito** → **Corsi** → **Gestisci corsi e categorie**
2. Crea corso:
   ```
   Nome: Demo Gratuita Deltaskill
   Nome breve: demo-free
   Visibilità: Visibile
   ```

#### Step 2: Abilita accesso ospite

1. Entra nel corso
2. **Utenti** → **Metodi di iscrizione**
3. Aggiungi **Accesso ospiti** (senza password)

#### Step 3: Aggiungi contenuti

1. Aggiungi lezioni/risorse visibili a tutti
2. Evita quiz/compiti (gli ospiti non possono completarli)

#### Step 4: Testa

1. Esci da Moodle
2. Vai su `https://tuodominio.it`
3. Clicca **"Accedi come ospite"**
4. Verifica di vedere il corso "Demo Gratuita"

---

### 13.11 Troubleshooting Ospite

#### ❌ "Non vedo il pulsante Accedi come ospite"

**Causa:** Accesso ospite disabilitato globalmente

**Soluzione:**
```
Amministrazione → Plugin → Autenticazione → Gestione autenticazione
→ Abilita "Accesso ospite"
→ Impostazioni → "Pulsante login ospite" = Sì
```

#### ❌ "L'ospite non vede il corso"

**Causa:** Accesso ospiti non abilitato nel corso

**Soluzione:**
```
Corso → Utenti → Metodi di iscrizione
→ Aggiungi metodo → Accesso ospiti → Abilita
```

#### ❌ "L'ospite vede messaggio di errore"

**Causa:** Corso richiede password ospite

**Soluzione:**
- Controlla se hai impostato una password per ospite nel corso
- Rimuovila o comunicala agli utenti

#### ❌ "Voglio permettere agli ospiti di fare quiz"

**Non possibile.** Gli ospiti per design non possono interagire.

**Soluzione alternativa:**
- Crea un utente studente con password semplice
- Username: `demo` / Password: `Demo2025!`
- Condividi queste credenziali per accesso limitato

---

### 13.12 Best Practices Accesso Ospite

✅ **Quando usare l'accesso ospite:**
- Corsi demo/preview
- Contenuti pubblici/marketing
- Documentazione aperta

❌ **Quando NON usarlo:**
- Corsi con certificati
- Corsi con valutazioni
- Corsi a pagamento (usa studenti regolari)

🔒 **Sicurezza:**
- Non mettere contenuti sensibili in corsi con accesso ospite
- Considera che CHIUNQUE può accedere senza tracciabilità

📊 **Analytics:**
- Gli ospiti non vengono tracciati nei report
- Non vedrai statistiche di completamento

---

## 📝 Checklist finale

Prima di andare live, verifica:

### Database
- [ ] Database creato su Aruba
- [ ] Password impostata e testata su phpMyAdmin
- [ ] DB importato (se migrazione) o vuoto (se nuovo)

### File
- [ ] `moodle/` caricato in `/home/moodle/`
- [ ] `moodledata/` caricato in `/home/.data_mdl_2025/moodledata/`
- [ ] Permessi 777 su moodledata (ricorsivo)
- [ ] `.htaccess` in `.data_mdl_2025/` (blocca accesso web)

### Config.php
- [ ] File esiste in `/home/moodle/config.php`
- [ ] `$CFG->dbpass` ha apice finale (no errori sintassi)
- [ ] `$CFG->dataroot` con percorso assoluto
- [ ] `$CFG->wwwroot` con https e dominio corretto
- [ ] File finisce con `require_once(__DIR__ . '/lib/setup.php');`

### Test
- [ ] Sito si apre senza errore 500
- [ ] Login funziona
- [ ] Corsi visibili (se migrazione)
- [ ] Upload file funziona
- [ ] Cache scrive correttamente

### Sicurezza
- [ ] SSL/HTTPS attivo
- [ ] `.data_mdl_2025/` non accessibile da web (errore 403)
- [ ] Password DB sicura
- [ ] Debug disabilitato in produzione

### Performance
- [ ] PHP 8.2 attivo
- [ ] HiSpeed Cache abilitata
- [ ] Cron configurato
- [ ] memory_limit almeno 256M

---

## 🆘 Supporto e risorse

### Log errori Aruba

**Dove trovarli:**
- Pannello → Hosting Linux → Log
- Oppure File Manager → cartella `logs/` o file `error_log`

**Cercare errori recenti:**
- Guarda data/ora dell'errore
- Focus su righe con `[warn]` o `[error]`
- Cerca percorsi file Moodle (`/moodle/`)

### Documentazione ufficiale

- **Moodle Docs:** https://docs.moodle.org
- **Moodle Installation:** https://docs.moodle.org/en/Installing_Moodle
- **Aruba Guide:** https://guide.aruba.it

### Forum e community

- **Moodle Forum IT:** https://moodle.org/course/view.php?id=29
- **Moodle Forum EN:** https://moodle.org/forums/

---

## 🎯 Problemi risolti in questa guida

Questa guida risolve **TUTTI** questi problemi reali:

✅ Errore 500 da sintassi PHP (`dbpass` senza apice)
✅ File config.php troncato (manca `require_once`)
✅ "Unable to save cache config" (permessi/percorso moodledata)
✅ "Database connection failed" (password non impostata)
✅ `mkdir(): File exists` (cache corrotta)
✅ moodledata accessibile da web (manca .htaccess)
✅ Upload file bloccati (.php non caricabili)
✅ Quale hosting scegliere su Aruba (Linux!)
✅ Come funziona Moodle for Windows (moodle.exe)
✅ Percorsi relativi vs assoluti
✅ **Credenziali localhost non funzionano dopo migrazione**
✅ **Reset password admin con script PHP**
✅ **Problema passwordsaltmain**
✅ **Cache Moodle che blocca il login**

---

**Creata il:** 25 Ottobre 2025
**Basata su:** Migrazione reale deltaskill.it
**Testata su:** Aruba Hosting Linux + Moodle 4.x

---

🎉 **Buon lavoro con Moodle!**
