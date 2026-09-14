# OCR foundation — execution and verification record

## Goal

Provide a real local end-to-end example using the shared workbench: load a PNG/JPEG or synthetic sample, run OCR, compare original/text/word regions, and annotate the result. A single process starts UI and backend; navigation preserves the current run.

## Implementation

- [x] Add same-origin Vite API middleware for development and local preview.
- [x] Invoke local Tesseract with fixed arguments and stdin, parse word positions, and return structured results.
- [x] Bound upload bytes, image dimensions, output, concurrency and execution time. Restrict requests to the local workbench; accept no user-supplied paths, URLs or commands.
- [x] Normalize selected PNG/JPEG images in the browser and add image/text comparison using existing components.
- [x] Support empty/error states, cancellation, retries, navigation and explicit reset.
- [x] Reuse annotations with source/run/context identities so old comments are not attached to new output.
- [x] Test actual local OCR, request validation, lifecycle handling and the browser user path.

## Verification

21 tests pass, including actual sample OCR and HTTP processing. The synthetic sample produces 25 words, including `WORKBENCH OCR` and `42.50 EUR`. A separate JPEG upload recognizes `UPLOAD TEST 9876` and `Invoice: 72.90 EUR`. Blank and invalid images produce honest empty/error states.

Desktop and 390px browser checks cover word selection, point/region annotation, page navigation, reload, input replacement and cancellation with delayed response. No horizontal overflow; measured pin drift under 0.01 CSS pixels. Delayed-response testing simulates transport timing only; the successful recognition checks use the actual local engine.

Independent Claude Code review identified four low-severity issues: early execution-slot release during abort, inaccurate limit errors, unbound cross-panel annotations and missing boundary tests. All were corrected and specifically verified. Process promises now settle on close; timeout/output limits are distinct; cross-panel annotations bind to a fresh context; chunked uploads and deadline/retry paths have tests.

TypeScript/build passes. Lint has no errors and two existing generated shadcn Fast Refresh export warnings. The timer test emits Node's informational experimental MockTimers warning.

## Evidence and limits

See [evidence](evidence/README.md). Screenshots contain synthetic data and are verification artifacts, not normative design references. The engine defaults to English. Images/results are memory-only; comments persist in the browser. PDF, RAG, automatic screenshot capture, full historical runs and an installable skill are outside this step.

Source for engine behavior: [Tesseract CLI documentation](https://tesseract-ocr.github.io/tessdoc/Command-Line-Usage.html).
