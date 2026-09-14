# Elementgebundene Markierungen

Auftrag: Markierungen an UI-Elementen, Workflow-/Graph-/Baumknoten beim Verschieben, Zoomen und Layoutwechsel erhalten. Bestehende isolierte Vorschau wiederverwenden.

Ursache: Mark speichert nur Prozentkoordinaten der gesamten AnnotationCanvas, ohne Zielidentität.

- [x] Regression: gespeicherter Pin folgt einer verschobenen Zielkarte nicht; Zielrechteck-Geometrie für Zoom/Resize und fehlendes Ziel testen.
- [x] Neues optionales Anchor-Feld mit stabiler data-annotation-id, Zielname und relativen Punkt-/Rechteckkoordinaten. Bestehende freie Markierungen bleiben kompatibel, keine erfundene Migration.
- [x] Treffer unter der Zeichenebene bestimmen; für Bereiche kleinstes umschließendes gekennzeichnetes Element verwenden. Fehlendes/mehrdeutiges Ziel ausblenden und sichtbar melden.
- [x] Markierungsposition bei Transformation, Scroll und Resize nachführen; Animationframe nur bei vorhandenen Markierungen. Verdeckte Bereiche an Scroll-/Clipcontainern beschneiden.
- [x] Beispielziele kennzeichnen; minimale Zoom-/Verschiebesteuerung am vorhandenen Diagramm für realistische Abnahme bereitstellen. Kein Diagrammeditor oder neue Library.
- [x] Tests, Lint, Build und isolierter Browser: Pin, Region, Verschieben, Zoom, Reload, Layoutwechsel, fehlendes Ziel, Export. Screenshots und Grenzen dokumentieren.

## Ergebnis

Vorher im Browser: Zielkarte +80px, Markierung unverändert. Nachher: Pin und Region folgen dem Knoten bei Pan, 120/140-Prozent-Zoom, Panelbreitenwechsel, Mobilansicht und umgeordneter DOM-Reihenfolge; gemessene maximale Abweichung unter 0,02 CSS-Pixel. Reload erhält die Zielbindung. Verstecktes oder doppeltes Ziel führt zu null Markierungen und sichtbarem Hinweis; Testkommentare gezielt entfernt.

Fünf Tests, Lint ohne Fehler (zwei bekannte shadcn-Exporthinweise), TypeScript und Build bestanden. Keine Browserfehler. [Zoom-Beleg](evidence/anchored-zoom.png), [Mobil-Beleg](evidence/anchored-mobile.png). Synthetische Agent-Testkommentare; Bilder sind Prüfnachweise, keine normativen Referenzen.

Freie/alte Markierungen sind weiterhin positionsbezogen. Canvas/WebGL und Cross-Origin-Iframes benötigen Adapter; kein Diagrammeditor/Freihandwerkzeug in diesem Fix.
