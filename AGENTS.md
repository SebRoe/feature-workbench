# Feature Workbench — agent instructions

Read `docs/README.md`, `docs/INTENT.md`, `docs/DESIGN.md`, and the relevant execution plan before changes. `prototype/README.md` describes startup, test requirements, extension points and current limitations.

## Working contract

- Build a focused, runnable workbench for the assigned task. Reuse the shared shell, shadcn components and annotation tools.
- Keep changes isolated in a worktree. Do not modify a target product's source files until the human explicitly approves that integration. A worktree alone is not approval.
- Supply suitable examples and direct controls for relevant states. Distinguish real processing from simulated responses. Do not claim provider or model quality from mocked tests.
- Collect feedback across pages. Apply a feedback round only when requested in chat, then show the tested new state.
- Ask about material unresolved choices one at a time. Reuse confirmed decisions; do not add approval gates for already authorized work.
- Before substantial implementation, commit an execution plan with observable acceptance criteria. Review changes against intent and architecture; run appropriate tests and lint; start the application and smoke-test the actual path. Inspect and capture changed UI in an isolated browser. Finish with a diff review and human review.
- Protect unrelated changes, credentials, private inputs and target-project context. Never commit browser state, actual uploaded images, secrets or personal machine paths.
- Repository write access does not authorize publishing target-product code, external messages, deployment or destructive operations. Follow the human's actual delivery scope.
- Screenshots are evidence, not normative design specifications. Record only explicitly confirmed design properties in `docs/DESIGN.md`.

## Commands

From `prototype/`: `npm ci`, `npm test`, `npm run lint`, `npm run build`.
Start UI and local API together: `npm run dev -- --host 127.0.0.1 --port 5187 --strictPort`.
OCR and integration tests require local Tesseract 5 with the `eng` language model. See the README for installation; do not substitute canned results if the engine is missing.

## Maintainer workflow status

- Graphify: declined.
- Headroom: pending; not a runtime dependency.
- Roborev: enabled for maintainer reviews. Use the opposing coding agent explicitly (Codex implementation → Claude Code review; Claude implementation → Codex review) with a single-agent panel. Reviews are read-only and happen after the completed, self-checked step. Evaluate findings, fix in-scope issues, and verify them. Do not install automatic commit/turn hooks or CI jobs.

These tools are not required to run the workbench. No global agent configuration is bundled. The reusable Codex/Claude skill lives in `skills/feature-workbench/SKILL.md`; this file remains project guidance. Use `scripts/install_skill.py` to install a self-contained foundation snapshot.
