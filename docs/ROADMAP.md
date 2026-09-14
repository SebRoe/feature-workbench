# Next: a shared Codex and Claude skill

The current repository contains a runnable workbench and extension guidance. It does not yet ship an installable skill.

The next step is to design one shared skill contract with host-specific installation notes. Its target-repository folder convention is already confirmed: `.workbench/YYYYMMDD_HHmm_<name>/`, using local creation time, a short kebab-case name, and Git revisions within the same folder. See [architecture](ARCHITECTURE.md#workbench-folders-in-a-target-repository). It should tell an agent how to read target-project context, prepare an isolated workbench, reuse the shared UI/server, create task-specific content, start and verify it, and apply collected feedback on a chat request.

Validate that contract with at least one real Codex use and one real Claude use before claiming both integrations work. Keep target-product source approval separate from workbench experimentation.

Further decisions: skill packaging and installation, durable feedback handoff, complete revision comparison/restoration, promotion into a target product, and the repository license. These are not implemented or silently approved by publication of this prototype.
