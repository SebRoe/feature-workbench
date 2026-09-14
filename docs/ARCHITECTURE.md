# Local workbench foundation

Confirmed 2026-09-14: one shared workbench shell and local backend, with OCR as the first real end-to-end case. The agent supplies task-specific views and processing for subsequent cases. shadcn components and dependencies are shared within this application, installed per checkout rather than per page.

## Responsibilities

- `prototype/src/App.tsx`: navigation, version examples and shared annotation tools.
- `prototype/src/features/Ocr.tsx`: image input and review of actual OCR output.
- `prototype/server/api.ts`: local request boundary and execution lifecycle.
- `prototype/server/ocr.ts`: task-specific Tesseract invocation and structured output.
- `prototype/vite.config.ts`: one local server for UI and API in dev and preview.

The first adapter is deliberately concrete. Do not infer a universal engine, graph editor, workflow runner, model provider or installed plugin architecture. Later agents add the smallest appropriate view and backend operation for their assigned task.

Images and extracted text stay in process/browser memory; processing uses local Tesseract, no external provider. Request sizes, image dimensions, concurrency, duration and output are bounded. Browser clients cannot supply shell commands, paths or remote image URLs. The service is local development infrastructure, not an authenticated public upload service.

See [OCR execution plan](plans/2026-09-14-ocr-foundation.md) for acceptance and evidence. Product-source changes still need explicit approval.

## Workbench folders in a target repository

Confirmed convention: each new workbench undertaking gets a directory under the target repository's `.workbench/` folder, in its own worktree on a workbench branch. Commit workbench changes on that branch; merging them into the target project's main branch requires explicit integration approval. Creating this experimental folder does not authorize product-source changes.

```text
.workbench/
└── 20260612_1345_hotkey-overlay/
```

Name format: `YYYYMMDD_HHmm_<name>`. The timestamp is the creation time in local time (24-hour clock); `<name>` is a short descriptive kebab-case name. The timestamp labels the undertaking, not an individual feedback round. Local timestamps are for readability; they are not unique IDs or globally chronological across time zones.

Keep the same folder for subsequent feedback rounds. Version its changes through Git instead of creating a new timestamped copy for each round. Resume using the known folder path recorded for the current task, not a name match alone. Before creating a new folder, check whether it already exists; never overwrite another undertaking. For a collision, append the smallest available numeric suffix to the descriptive name, for example `20260612_1345_hotkey-overlay-2`.

The folder groups the work surface, example inputs, feedback and verification evidence. The skill specifies `PLAN.md`, `app/`, optional `feedback/` JSON exports and `evidence/`. The agent creates this structure; automatic target scaffolding and repository feedback persistence are not implemented. The runnable example in this repository remains under `prototype/`.

Only authorized, suitable content belongs in Git. The folder convention does not authorize committing secrets, private test inputs or target-product source changes. Complete revision comparison/restoration in the UI remains a separate planned capability.
