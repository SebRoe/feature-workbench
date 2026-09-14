# Installable skill

Scope: package the agreed workbench workflow for Codex and Claude, install it locally, and publish the shared source. Preserve product integration approval and the existing UI. No new runtime features or automatic promotion.

Done: one shared SKILL.md; a reproducible local installer supplies the existing foundation without dependencies, credentials or machine state; both host directories contain valid self-contained skills; installer collision/clean-copy behavior is checked; host discovery is checked where available; documentation accurately distinguishes installed instructions from runtime capabilities.

Implementation: add skill instructions and packaging script, document invocation and folder contents, test installation in temporary directories then install locally, self-review and configured Roborev review, publish the completed scoped changes. Do not claim a full two-host product exercise from metadata checks.
