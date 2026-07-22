# Contributing

## Adding a tool

1. Open an issue describing the user problem, jurisdiction, source law, intended delivery targets, and data sensitivity.
2. Put reusable rules and validation in `packages/<tool-name>-core`.
3. Put the standalone application in `apps/<tool-name>` when needed.
4. Put the WordPress integration in `wordpress/<tool-name>` when needed.
5. Add automated tests for legal rules, boundary conditions, and known examples.
6. Complete the documentation checklist below before release.

## Required tool documentation

Every tool must include a README covering:

- purpose and intended audience;
- supported jurisdiction and language;
- primary legal sources and links;
- effective date or last legal review date;
- inputs, outputs, assumptions, and known limitations;
- privacy and data-retention behavior;
- installation, development, testing, and deployment;
- a clear informational-use disclaimer.

## Naming

Use lowercase kebab-case directory and package names. Prefer descriptive names such as `filing-deadline-calculator` over internal abbreviations.

## Pull requests

Keep each pull request focused. Explain changes to legal rules separately from presentation changes, identify the source supporting each rule change, and add or update tests.
