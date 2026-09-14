---
name: feature-workbench
description: Build an isolated, runnable feature workbench with shared navigation, visual annotations and task-specific controls before product integration. Use for interactive UI drafts or business-logic experiments and collected feedback rounds.
---

# Feature Workbench

Prepare an early runnable draft that the person can inspect and manipulate. Keep the shared frame consistent; choose focused pages and suitable controls for the actual task. A graph, workflow or tree is useful when it explains behavior, but should not replace real input/output controls.

## Foundation and context

The installed skill contains `assets/foundation/` with the maintained `prototype/` application and `docs/`. Read its `docs/DESIGN.md`, `docs/ARCHITECTURE.md` and `prototype/README.md` before adapting it. In a source checkout these are at the repository root, two levels above this skill; run `python3 scripts/install_skill.py` from that root to create a self-contained installation. Do not fetch an unpinned replacement during a task.

Read the target repository's instructions, documentation map, intent, design rules and relevant source. Use the applicable Superpowers workflow when available; otherwise perform its relevant planning, implementation, self-review and verification steps directly. Reuse existing tool decisions. Ask one material unresolved question at a time and continue independent authorized work.

## Isolation and folders

Use a dedicated worktree and workbench branch, respecting target-repository conventions. Product source stays unchanged until explicit human integration approval, even in that worktree. Reading product source does not authorize publishing it.

Create `.workbench/YYYYMMDD_HHmm_<name>/` there, using local creation time and a short kebab-case name. Keep this path for the entire undertaking, including later feedback rounds. Resume by its known task path. On a new-folder collision, append the smallest available numeric suffix to the name; never overwrite another task. Local timestamps are readable labels, not unique global time IDs.

Use the following minimal layout (create optional directories only when needed):

```text
<undertaking>/
  PLAN.md             task scope, source references, acceptance and checks
  app/                copy of foundation/prototype, adapted for this task
  feedback/           exported annotation JSON and round decisions
  evidence/           screenshots and concise verification notes
```

Commit the execution plan on the workbench branch before substantial implementation. Record the actual folder, foundation revision from `assets/foundation/REVISION`, startup command, URL and task-owned process when known. Keep task artifacts in this folder; a target project's required plan location may be used with a pointer instead of duplicate plans. Commit only authorized, suitable artifacts. Do not change ignore rules to force private inputs into Git.

## Build and present

Copy the supplied prototype into `app/`, excluding generated files if using a source checkout. Install its locked dependencies once per checkout with `npm ci`; reuse the same app, shadcn components, tokens and local server for all pages. Do not install a design stack per page. Read the template's extension guidance and keep only examples relevant to the task.

Retain shared navigation, point/rectangle annotations and the feedback panel. Use stable `data-annotation-id` values on meaningful task content. Follow the template's anchor lifecycle: IDs must not silently rebind previous comments to new results. Custom graph surfaces need DOM anchors or a deliberate coordinate adapter; canvas/WebGL and cross-origin frames are not automatically supported.

For UI work, expose relevant states directly instead of making the person repeat the full product flow. Apply confirmed shared design corrections across affected pages. For business logic, provide actual inputs, execution controls, results and helpful intermediate states. Use the existing local UI/API process; add the smallest case-specific adapter. OCR is one included real example, not a required engine for every workbench. Mark mocks clearly and never imply a simulated result tests a provider.

Run appropriate tests and lint, start the isolated app on an available loopback port with strict port selection, and smoke-test the actual path before presenting its URL. Follow repository runtime adapters when present. Reuse task-owned running processes. Verify relevant states in an authorized isolated browser and capture UI evidence; report any missing live verification honestly. Keep the environment available during joint review and record ownership for later cleanup.

## Feedback rounds and integration

Collect notes across pages. The existing app persists comments in browser localStorage and exports JSON; it does not automatically write them to the repository. Use its export to save the complete batch under `feedback/` when supplied or retrievable within authorized browser access. Otherwise request the export in chat; never invent unseen annotations. Preserve stable IDs and the original export, and record which notes were applied or remain unresolved.

Only on the person's chat trigger, apply all collected notes in one coherent round, inspect every affected page, add missing regression tests and repeat the relevant checks. Record round decisions and commit on the workbench branch; keep the same folder. Show the new verified state directly. The existing V1/V2 selector contains prepared examples, not source-history restoration; do not represent it as real revisions. Full interactive compare/restore remains unimplemented.

Finish with self-review against plan and architecture, configured reviews, tests/lint, actual smoke-test evidence and a final diff review. Human review remains the integration boundary. Neither notes nor a positive reaction authorizes changing product source, merging into its main branch, deploying or publishing private target context.
