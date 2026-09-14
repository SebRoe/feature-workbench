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
