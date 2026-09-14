# Skill and next steps

The repository now ships one shared `skills/feature-workbench/SKILL.md` for Codex and Claude. The local installer packages a self-contained snapshot of the existing foundation; see the root README for installation and invocation. This is an agent workflow, not an autonomous background service.

The target folder convention and minimal task layout are documented in the skill and [architecture](ARCHITECTURE.md#workbench-folders-in-a-target-repository). Feedback is handed off using the existing JSON export; automatic repository synchronization is not implemented.

Validate the workflow with real tasks in both hosts before claiming complete end-to-end integration. Installation and instruction discovery checks alone do not prove task execution quality.

Remaining capabilities/decisions: automatic durable feedback handoff, complete interactive revision comparison/restoration, product promotion tooling, and the repository license. None is silently approved by skill installation.
