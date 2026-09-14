# Initial public repository publication

Authorized target: public `SebRoe/feature-workbench` on GitHub. Publish the tested Feature Workbench as a clean initial snapshot. Keep earlier local history private and intact; push only the new public branch.

## Scope

- [x] Keep application source, dependencies and synthetic examples unchanged.
- [x] Replace personal agent contracts and conversation-specific documentation with portable project guidance.
- [x] Preserve architecture, design, real limits, verification evidence and startup instructions.
- [x] Clearly distinguish the runnable foundation from the planned Codex/Claude skill.
- [x] Check tracked contents, links and sensitive material; verify install, tests and build from this checkout.
- [x] Review the publication diff independently using the configured maintainer workflow.
- [ ] Create a clean initial commit with a GitHub noreply identity, create the public repository, push only the intended branch, and verify visibility/default branch/content.

No workflow automation, deployment, package release or target-product source is included. The project license remains undecided. Earlier local histories and machine-specific context are deliberately excluded from the public commit graph.

## Preparation verification

Fresh checkout: npm ci succeeds, 21 tests pass, lint has no errors (two existing shadcn warnings), TypeScript/build passes. Application source and dependencies are byte-for-byte unchanged from the previously browser-verified OCR foundation. Public tracked-text screening found no personal machine paths, private key markers or common credential patterns; local Markdown links resolve. Screenshots use synthetic data.

The independent documentation/publication review identified stale runtime references, inconsistent acceptance wording, an outdated documentation map, and two omitted intent requirements. These were corrected and checked against the confirmed product intent. No extra implementation or deployment was introduced.
