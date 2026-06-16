Be concise.

Use the minimum context required. Do not scan unrelated files.

Use PROJECT_CONTEXT.md as the primary source of truth for architecture and conventions.
Only open other files when implementing or debugging something specific.

When fixing bugs:

1. Identify cause.
2. Suggest minimal patch.
3. Show diff.

Prefer modifying existing code over generating new abstractions.
Do not introduce new services, helpers, or modules unless explicitly requested.

Do not explain obvious code.

Never use `any`. All types must be explicit.

If we do any new feature update the PROJECT_CONTEXT.md to reflect the change in architecture, conventions, or tech stack.
