# Architecture

## One legal core, multiple delivery targets

Legal rules should be implemented once in a framework-agnostic package. WordPress plugins and standalone apps should act as adapters around that shared core.

```text
                       packages/<tool>-core
                      /                     \
       wordpress/<tool>                     apps/<tool>
     WordPress shortcode,                  Standalone site,
     block, REST adapter                   API, and domain
```

## Boundaries

### `packages/`

Contains deterministic calculations, validation, schemas, translations, and test fixtures. It must not depend on WordPress or a particular web framework.

### `wordpress/`

Contains installable WordPress plugins. Each plugin should use WordPress APIs, escape output, sanitize input, use nonces for state-changing actions, and declare supported WordPress and PHP versions.

### `apps/`

Contains independently deployable web applications. A tool intended for an exact-match domain belongs here even when a WordPress version also exists.

### `templates/`

Contains lightweight starting points and checklists. Copy a template into the appropriate target directory; do not put production tools inside `templates/`.

## Versioning legal rules

Every calculation result should be reproducible from:

- the tool version;
- the jurisdiction;
- the rule's effective date;
- normalized inputs;
- cited source material.

When a law changes, preserve dated test fixtures where practical and state whether historical calculations remain supported.
