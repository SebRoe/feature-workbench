# Product intent

Feature Workbench helps people understand, try and shape a software change before it is integrated into a product. An agent prepares a focused, isolated, runnable surface with suitable examples and direct controls. The person should not have to reconstruct terminal commands or repeat complex product flows merely to inspect a state.

## Core requirements

- Provide an early runnable first draft instead of discussing every detail upfront. Resolve only material choices before dependent work; iterate using the concrete surface.

- A consistent shared shell provides navigation, annotations and feedback. The agent supplies task-specific content: UI examples, business rules, API tests, parser outputs, graphs or agent experiments.
- Several focused pages can be explored freely. Feedback survives page changes and is collected before a human requests a complete revision round in chat.
- The core behavior must run where possible. Simulated dependencies must be visibly distinguished from real execution.
- Existing target-product design and components guide its feature content. Shared design corrections should be applied consistently to affected pages.
- Target-product files remain unchanged until explicit integration approval. Isolation does not replace approval.
- The agent starts and verifies the environment before presenting it for use. Documentation and screenshots alone are not a runnable outcome.
- The reusable workflow should work with Codex, Claude and development workflows such as Superpowers.

## Planned capabilities and current limits

Each complete feedback round should eventually have a comparable, restorable version, with the new checked state shown directly, without a mandatory intermediate change-review screen. Keeping the previous state usable during revision is an optional convenience when inexpensive. Current V1/V2 controls demonstrate prepared UI variants only. Full version restoration, automatic repository feedback synchronization, installable skills and product promotion are not implemented.

## Non-goals

No fixed application or workflow per feature category. No complete development platform built speculatively. No automatic product integration or publication triggered by comments. A mock or screenshot does not prove business correctness, model quality or production readiness.
