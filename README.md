# Feature Workbench

Ein lokaler, interaktiver Arbeitsraum zum Verstehen, Ausprobieren und Kommentieren geplanter Softwareänderungen. Fachliche Inhalte werden vom Agenten passend zum Auftrag ergänzt; Navigation, shadcn-Komponenten und Anmerkungen bilden den gemeinsamen Rahmen.

## Aktueller Stand

Unter `prototype/`: Benachrichtigung, ausführbare Rabattregel und echte lokale OCR. PNG/JPEG oder Beispielbild laden, Texterkennung starten, Original und Text vergleichen und Wortbereiche markieren. V1/V2 sind weiterhin vorbereitete Beispielstände, keine vollständige Codeversionsverwaltung.

## Lokal starten

Voraussetzungen: Node 22.12+ und Tesseract 5 mit englischem Sprachmodell `eng` im PATH. Geprüft mit Node 22.22.2 und Tesseract 5.5.1. Einrichtung und Grenzen: [prototype/README.md](prototype/README.md).

```sh
git clone https://github.com/SebRoe/feature-workbench.git
cd feature-workbench/prototype
npm ci
npm run dev -- --host 127.0.0.1 --port 5187 --strictPort
```

http://127.0.0.1:5187 — ein Prozess startet Oberfläche und lokale OCR-Schnittstelle. Dependencies werden pro Checkout installiert; alle Testseiten verwenden dieselben Komponenten. Keine API-Schlüssel nötig. Änderungen an Frontend-Dateien aktualisieren sich automatisch.

## Dokumentation

- [Dokumentationskarte](docs/README.md)
- [Produktintent](docs/INTENT.md)
- [Design](docs/DESIGN.md)
- [Lokales Fundament](docs/ARCHITECTURE.md)

Echte Dateien eines Zielprodukts bleiben bis zum ausdrücklichen Approval unangetastet. Ein öffentlicher früher Prototyp; ein installierbarer Skill mit Vorlage, aber kein Paketrelease, Agentendienst oder vollständiger Versions-/Promotionsworkflow.

## Codex und Claude

Der [gemeinsame Skill](skills/feature-workbench/SKILL.md) lässt sich aus dem geklonten Repository installieren (Python 3 und Git erforderlich):

```sh
# Im Repository-Root:
python3 scripts/install_skill.py --host codex
python3 scripts/install_skill.py --host claude
```

Ziele: `$CODEX_HOME/skills/feature-workbench` (sonst `~/.codex/skills/feature-workbench`) und `~/.claude/skills/feature-workbench`. Der Installer kopiert ausschließlich den eingecheckten Stand (`HEAD`) von Skill und Vorlage ohne `node_modules` oder lokale Laufzeitdaten. Er überschreibt keine vorhandene Installation; für ein Update diese bewusst außerhalb des Skill-Verzeichnisses sichern und erneut installieren.

Aufruf in Codex: `$feature-workbench …`; in Claude Code: `/feature-workbench …`. In einer neuen Sitzung verwenden, falls die laufende Sitzung ihre Skill-Liste noch nicht aktualisiert hat. Die Vorlage wird erst im jeweiligen Aufgaben-Worktree angepasst und mit `npm ci` eingerichtet; die Skill-Installation startet keinen Server.

Ablauf: isolierten Worktree vorbereiten, frühen Draft ausführen, Anmerkungen sammeln, auf Chat-Auftrag gemeinsam umsetzen, prüfen und neuen Stand zeigen. Vollständiges Compare/Restore und automatische Feedback-Synchronisierung bleiben offen. [Roadmap](docs/ROADMAP.md).

## Workbench-Ordner im Zielprojekt

Bestätigte Konvention für den Skill: `.workbench/YYYYMMDD_HHmm_<name>/`, zum Beispiel `.workbench/20260612_1345_hotkey-overlay/`. Der Zeitstempel steht für die lokale Erstellungszeit, der Name ist kurzes kebab-case. Feedbackrunden bleiben im selben Ordner und werden über Git versioniert. Die automatische Anlage ist noch nicht implementiert. Details: [Architektur](docs/ARCHITECTURE.md#workbench-folders-in-a-target-repository).

## Lizenz

Eine Projektlizenz wurde noch nicht festgelegt. Die Veröffentlichung allein ist keine Open-Source-Lizenz. Abhängigkeiten behalten ihre jeweiligen Lizenzen.
