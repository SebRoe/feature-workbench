# Visual verification evidence

These images record isolated local browser checks with synthetic data. They are test evidence, not normative design references. Start the current application using `prototype/README.md`; screenshots do not imply that a particular server or worktree is still running.

## Shared shell and examples

- `desktop-notification.png`: notification example and shared desktop shell.
- `desktop-rule.png`: runnable discount rule and decision path.
- `desktop-annotations.png`: collected feedback and positional annotations from the initial draft.
- `mobile-rule.png`: narrow-screen navigation and rule layout.

The initial draft used positional marks. The subsequent anchor correction supersedes that limitation for newly anchored marks. The shared shadcn frame and overall layout were accepted as the working basis on 2026-09-14; this is not blanket approval of every screenshot detail or of future product integration.

## Element-bound annotations

- `anchored-zoom.png`: graph marks follow movement and zoom.
- `anchored-mobile.png`: target-relative marks on a narrow layout.

The tests also checked reload, element reordering, missing targets and duplicate IDs. Free legacy marks remain positional. See [annotation plan](../2026-09-14-anchored-annotations.md).

## OCR foundation

- `ocr-desktop.png`: actual local OCR, image/text comparison and a word annotation.
- `ocr-mobile.png`: stacked image/text comparison and retained word annotation.
- `ocr-empty.png`: honest no-text result for a blank image.
- `ocr-invalid.png`: invalid-image error without stale output.
- `ocr-context-region.png`: cross-panel region bound to the OCR context. A subsequent run hides that old mark while retaining its comment.

OCR evidence was captured on 2026-09-14 with synthetic inputs. English is the initial model; these screenshots do not establish general recognition quality. Images and results are not persisted across reload. Full code revision restore, repository feedback synchronization, installable skills and product promotion remain planned capabilities. See [OCR verification](../2026-09-14-ocr-foundation.md).
