# Design contract

## Shared frame

Use the existing shadcn/ui components (Radix Nova, neutral), Tailwind tokens, Geist typography and installed Lucide icons. The shared frame has left navigation, a central working surface, a collapsible annotation panel and an example-version control. On narrow screens, navigation and feedback stack around the working surface.

Keep each page focused with few visible elements and a clear primary action. Reuse existing patterns when adding task-specific content. The current shared surface is accepted as the working basis; screenshots are evidence only, not blanket approval of every visual detail.

## Task content

The agent chooses the smallest useful representation: direct state controls for UI, input/output and a decision graph for business rules, or image/text comparison for OCR. Make real processing, simulation and missing dependencies understandable. Reuse target-product components where authorized and practical; do not modify target source before integration approval.

OCR uses image selection, an explicit start action, side-by-side original and extracted text (stacked on narrow screens), selectable word regions, cancellation and retry. Images/results survive page navigation but not reload. The first engine uses English; recognition quality must be judged on representative task inputs.

## Feedback

Use point and rectangular annotations, stable element IDs and target-relative geometry. Missing or ambiguous targets hide the mark and retain its comment. OCR work surfaces have fresh context IDs; individual result words have run-specific IDs. Free legacy marks remain positional. See `prototype/README.md` for the adapter contract and limitations.

Feedback is collected across pages and revised together on a chat request. Changing an example version does not restore historical source code. Product integration is a separate approval boundary.

## Future workflow

The reusable Codex/Claude skill instructs agents to read versioned context, prepare an isolated workbench, run and inspect it, collect feedback, and repeat. The installer packages the shared skill and foundation locally. Complete version/promotion tooling remains open. See [roadmap](ROADMAP.md).
