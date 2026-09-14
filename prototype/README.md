# Interaktiver Workbench-Entwurf

```sh
npm ci
npm run dev -- --host 127.0.0.1 --port 5187 --strictPort
```

Öffne http://127.0.0.1:5187. Node 22.12+ erforderlich (getestet mit 22.22.2). Derselbe Vite-Prozess liefert Oberfläche und `/api/ocr`; kein zweiter Serverstart nötig. Auch `npm run preview -- --host 127.0.0.1 --port 5187 --strictPort` nach dem Build bindet die lokale API ein. Ein bloßes Hosting von `dist/` enthält keine OCR-Schnittstelle.

`npm test`, `npm run lint`, `npm run build` prüfen Logik, Quellcode und Build.

Offizielle shadcn-Komponenten: CLI 4.21.0, Radix Nova, neutral, Geist lokal. Quelle: https://ui.shadcn.com/docs/installation/vite . Installierte Versionen sind im Lockfile festgehalten.

## Bedienung

- Links zwischen Benachrichtigung, Rabattregel und Texterkennung wechseln.
- Texterkennung: PNG/JPEG auswählen oder „Beispiel laden“, dann „Text erkennen“. Original, extrahierten Text und anklickbare Wortbereiche vergleichen. Eigene Anmerkungen sammeln.
- OCR kann abgebrochen und wiederholt werden. „Zurücksetzen“ entfernt Bild/Ergebnis; Seitenwechsel erhält sie, Reload entfernt sie. Anmerkungen bleiben gespeichert, alte Ergebnisziele werden als nicht sichtbar gemeldet.
- Benachrichtigungszustand direkt wählen; Fehler per „Erneut versuchen“ verlassen.
- Betrag/Mitgliedschaft ändern: synthetische Rabattregel wird tatsächlich berechnet.
- Punkt oder Bereich wählen, Vorschau markieren, Kommentar schreiben, Sammeln.
- Unverortete Kommentare direkt im Anmerkungsbereich schreiben. Nummern können im Text referenziert werden.
- Feedback bleibt im Browser über Seitenwechsel und Reload erhalten; JSON-Export zur Weitergabe im Chat.
- V1/V2 sind vorbereitete Beispielstände. Keine echten historischen Codeversionen oder Wiederherstellung.

## Grenzen

Dies ist der beauftragte klickbare Entwurf, kein installierbarer Skill oder Agentendienst. Kommentare werden noch nicht automatisch in Repo-Dateien geschrieben. Neue Punkte und Rechtecke binden sich an eindeutig gekennzeichnete UI-Elemente/Diagrammknoten und folgen Bewegung, Zoom und Layoutwechsel. Fehlende oder doppelte Ziel-IDs blenden die Markierung aus und melden das fehlende Ziel. Alte Markierungen und freie Flächen bleiben positionsbezogen. Kein freies Zeichnen oder automatische Screenshotaufnahme. Reale Überarbeitungsrunden und Promotion sind noch nicht implementiert. Der gemeinsame Rahmen ist als Arbeitsgrundlage bestätigt; die Produktintegration bleibt separat freigabepflichtig.

## Diagramme und eigene Inhalte anbinden

Vergib pro fachlichem Ziel eine eindeutige, dauerhafte `data-annotation-id` und einen lesbaren `data-annotation-label`, etwa am HTML- oder SVG-Knoten. Nutze fachliche IDs, keine Array-Indizes. Die ID muss über Rendern, Sortierung und Neuladen hinweg erhalten bleiben. Für Gruppen kann der gemeinsame Container ebenfalls gekennzeichnet werden; Rechtecke binden sich an das kleinste umschließende gekennzeichnete Ziel. Ungekennzeichnete Flächen werden als freie Fläche gespeichert, nicht nachträglich einem vermeintlichen Knoten zugeordnet.

Der Rabatt-Workflow bietet Plus/Minus zum Zoomen, Ziehen zum Verschieben, Pfeiltasten bei fokussierter Diagrammfläche und Zurücksetzen. Der Annotation-Layer unterstützt Verschiebung und achsenparallele Skalierung innerhalb derselben DOM-Oberfläche. Canvas/WebGL oder Cross-Origin-Iframes benötigen einen eigenen Zieladapter; beliebige Rotation ist nicht abgenommen.

## Lokale OCR einrichten

Tesseract 5 und das englische Sprachmodell `eng` müssen lokal verfügbar sein:

```sh
tesseract --version
tesseract --list-langs
```

Getestet mit Tesseract 5.5.1. Für einen neuen Rechner: [offizielle Installationsanleitung](https://tesseract-ocr.github.io/tessdoc/Installation.html). Auf macOS mit Homebrew: `brew install tesseract`; auf Debian/Ubuntu: `sudo apt install tesseract-ocr tesseract-ocr-eng`. Fehlende Engine/Sprachdaten werden als Fehler mit Einrichtungshinweis angezeigt, niemals durch Beispielausgaben ersetzt. Kein automatischer Systeminstallationsschritt in `npm ci`.

Verarbeitung mit `eng`, automatischer Seitensegmentierung und TSV-Wortpositionen, gemäß [Tesseract CLI](https://tesseract-ocr.github.io/tessdoc/Command-Line-Usage.html). Englisch ist der Teststandard; kein universelles Qualitätsversprechen für Sprachen, Handschrift oder Tabellen. Die Konfidenz ist ein Engine-Wert, keine kalibrierte Genauigkeitsgarantie. PDF, RAG und automatische Screenshotaufnahme sind noch nicht Teil dieser Arbeitsfläche.

PNG/JPEG, maximal 8 MiB, 12 Megapixel und 8000 Pixel pro Seite. Der Browser normalisiert Bilder zu PNG (inklusive weißem Hintergrund für Transparenz); das Backend akzeptiert nur begrenzte PNG-Bytes, keine Dateipfade/URLs oder frei übergebene Kommandos. Ein aktiver Lauf; Engine-Zeitlimit 30 Sekunden, gesamte Anfrage 35 Sekunden. Fremde Origins/Hosts werden abgelehnt, keine CORS-Freigabe. Nur für lokale Entwicklung, kein öffentliches Upload-Backend.

Originale und Ergebnisse werden nicht serverseitig gespeichert oder an externe Dienste gesendet. Feedback einschließlich Zielbeschriftungen (Dateiname bzw. ausgewähltes OCR-Wort) wird wie bisher im Browser gespeichert und kann exportiert werden. Ausgewähltes Bild und Ergebnis müssen nach Reload neu erstellt werden; neue Lauf- und Kontext-IDs verhindern falsche Wiederzuordnung alter Kommentare, auch bei Markierungen über mehrere Panels.

## Einen weiteren Fall ergänzen

1. Vorhandenen Produktkontext lesen und eine fokussierte Testseite unter `src/features/` erstellen; gemeinsame shadcn-Komponenten und Markierungskonvention verwenden.
2. Falls Verarbeitung außerhalb des Browsers nötig ist, einen konkreten Backend-Handler unter `server/` ergänzen und über `vite.config.ts` einbinden. Grenzen, Abbruch und echte Fehler abdecken. Zugriff auf Produktdateien/Provider nur im freigegebenen Umfang.
3. Navigation und Feedback-Seitenbezeichnung in `App.tsx` / `Feedback.tsx` ergänzen. Zustände beim Seitenwechsel erhalten; Ergebnisziele stabil und pro Lauf eindeutig markieren.
4. Einen repräsentativen echten Lauf, Fehlerfälle und die bedienbare Oberfläche prüfen. Keine separate Design-Library oder neue Frontend-App pro Seite installieren.

Dies ist eine dokumentierte Erweiterungskonvention, noch kein dynamisches Plugin-/Adapter-System.

## Tests und Beispieldaten

`npm test` enthält echte OCR-Integrationsprüfungen und benötigt deshalb Tesseract plus `eng`. `tests/fixtures/` und `public/ocr-sample.png` enthalten ausschließlich synthetische Eingaben. Der Testbeleg wurde lokal mit Pillow und Helvetica erzeugt; Pillow ist keine Laufzeitabhängigkeit der Workbench. Browserprüfungen und Screenshots: [OCR-Plan](../docs/plans/2026-09-14-ocr-foundation.md).
