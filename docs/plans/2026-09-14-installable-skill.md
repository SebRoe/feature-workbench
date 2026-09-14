# Installable skill

Scope: package the agreed workbench workflow for Codex and Claude, install it locally, and publish the shared source. Preserve product integration approval and the existing UI. No new runtime features or automatic promotion.

Done: one shared SKILL.md; a reproducible local installer supplies the existing foundation without dependencies, credentials or machine state; both host directories contain valid self-contained skills; installer collision/clean-copy behavior is checked; host discovery is checked where available; documentation accurately distinguishes installed instructions from runtime capabilities.

Implementation: add skill instructions and packaging script, document invocation and folder contents, test installation in temporary directories then install locally, self-review and configured Roborev review, publish the completed scoped changes. Do not claim a full two-host product exercise from metadata checks.

## Verification

Three installer regression tests pass: tracked foundation copy and overwrite refusal; exact committed content despite dirty source and untracked skill notes; rejection of committed symlinks without partial installation. Skill format validation passes. Both local host directories were installed with matching skill and 47 prototype files. Roborev job 479 identified snapshot provenance and overwrite-race issues; these were fixed and targeted tests repeated. Diff whitespace checks pass. No UI or runtime behavior changed, so prior prototype evidence remains applicable; no new browser acceptance is claimed.

Host installation is verified at the filesystem/package level. A complete feature task invoked through both Codex and Claude remains a real-use acceptance step; installation is not evidence of that full workflow. The three-part technical path is: committed source → installer snapshot → host skill directory; no additional diagram is needed for this simple copy operation.
