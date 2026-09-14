# Klickbarer Workbench-Entwurf – Execution Plan

**Goal:** Einen lokal gestarteten shadcn-Entwurf mit zwei Beispielseiten, Markierungen, sammelbarem Feedback und demonstriertem Versionswechsel liefern.

**Architecture:** React/Vite stellt den lokalen Entwurf bereit. Gemeinsamer Rahmen, Beispiele und Feedback sind getrennte Module. Feedback bleibt im Browser und ist als JSON exportierbar. Beispielversionen sind keine vollständige Git-Wiederherstellung. Keine Zielproduktdateien oder echten Geschäftsdaten.

**Tech Stack:** React, TypeScript, Vite, Tailwind, offizielle shadcn-Komponenten, Lucide aus deren Standardkonfiguration.

## Umsetzung

- [x] Vite/React-Grundlage unter `prototype/` erstellen, shadcn-Komponenten über die offizielle CLI installieren.
- [x] `src/App.tsx`: Navigation, Version und Feedbackbereich. Freier Seitenwechsel erhält Eingaben und Anmerkungen.
- [x] `src/features/Examples.tsx`: Benachrichtigungszustände sowie echte synthetische Rabattberechnung und visuell markierter Entscheidungspfad.
- [x] `src/features/Feedback.tsx`: Punkte und Rechteckmarkierungen, Kommentarformular, Liste, Löschen und Export. Kein Agent-Startbutton.
- [x] `src/features/model.ts`: Rabattberechnung; Grenzwerte und ungültige Werte mit Regressionen prüfen.
- [x] `src/index.css`: gemeinsame zurückhaltende Gestaltung, Fokus, kleine Bildschirmbreiten und reduzierte Bewegung.

## Prüfplan und Done

- Rabattgrenzen, Mitgliederregel und ungültige Eingaben mit `npm test` prüfen.
- `npm run lint` und `npm run build` bestehen.
- Agent Browser in eigener Session: beide Seiten, Zustandswahl, Regelberechnung, Kommentar anlegen, Seitenwechsel, Reload, Version und Kommentar löschen prüfen.
- Aktuelle Screenshots bei Desktop- und kleiner Breite unter `docs/plans/evidence/` sichern; keine öffentliche Produktabnahme behaupten.
- README mit funktionierendem Startbefehl und konkreten Prototypgrenzen aktualisieren. Dev-Server für Nutzerfeedback offen lassen.

## Ergebnis

Klickbarer Entwurf vollständig im beschriebenen Umfang geliefert. Aktuelle Belege und Grenzen: [Prüfnachweis](evidence/README.md). Das bestätigt keine endgültige Designrichtung oder Produktintegration.
