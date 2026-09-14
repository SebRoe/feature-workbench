# Feature Workbench

Ein lokaler, interaktiver Arbeitsraum zum Verstehen, Ausprobieren und Kommentieren geplanter Softwareänderungen. Fachliche Inhalte werden vom Agenten passend zum Auftrag ergänzt; Navigation, shadcn-Komponenten und Anmerkungen bilden den gemeinsamen Rahmen.

## Aktueller Stand

Unter `prototype/`: Benachrichtigung, ausführbare Rabattregel und echte lokale OCR. PNG/JPEG oder Beispielbild laden, Texterkennung starten, Original und Text vergleichen und Wortbereiche markieren. V1/V2 sind weiterhin vorbereitete Beispielstände, keine vollständige Codeversionsverwaltung.

## Lokal starten

Voraussetzungen: Node 22.12+ und Tesseract 5 mit englischem Sprachmodell `eng` im PATH. Geprüft mit Node 22.22.2 und Tesseract 5.5.1. Einrichtung und Grenzen: [prototype/README.md](prototype/README.md).

```sh
cd prototype
npm ci
npm run dev -- --host 127.0.0.1 --port 5187 --strictPort
```

http://127.0.0.1:5187 — ein Prozess startet Oberfläche und lokale OCR-Schnittstelle. Dependencies werden pro Checkout installiert; alle Testseiten verwenden dieselben Komponenten. Keine API-Schlüssel nötig. Änderungen an Frontend-Dateien aktualisieren sich automatisch.

## Dokumentation

- [Dokumentationskarte](docs/README.md)
- [Produktintent](docs/INTENT.md)
- [Design](docs/DESIGN.md)
- [Lokales Fundament](docs/ARCHITECTURE.md)

Echte Dateien eines Zielprodukts bleiben bis zum ausdrücklichen Approval unangetastet. Ein öffentlicher früher Prototyp; noch kein veröffentlichtes Paket, installierbarer Skill, Agentendienst oder vollständiger Versions-/Promotionsworkflow.

## Codex und Claude

Der gemeinsame Skill wird als nächster Schritt ausgearbeitet. Heute enthält dieses Repo die ausführbare Grundlage und [Agent-Anweisungen](AGENTS.md). [Roadmap](docs/ROADMAP.md).

## Lizenz

Eine Projektlizenz wurde noch nicht festgelegt. Die Veröffentlichung allein ist keine Open-Source-Lizenz. Abhängigkeiten behalten ihre jeweiligen Lizenzen.
