# law-tools

Reusable tools for legal-information websites, built for two delivery targets:

1. WordPress plugins and embeddable widgets for existing law-related websites.
2. Standalone applications that can power focused, exact-match-domain websites.

## Repository layout

```text
law-tools/
├── apps/                  # Standalone tools and exact-match-domain applications
├── wordpress/             # WordPress plugins and integrations
├── packages/              # Shared framework-agnostic logic, schemas, and UI code
├── templates/             # Starter templates for new tools
├── docs/                  # Architecture, product, legal, and deployment documentation
└── .github/               # GitHub issue and pull-request conventions
```

Each tool should have one clear purpose and live in its own directory. Shared calculations, validation, and schemas belong in `packages/` so WordPress and standalone versions can use the same tested rules.

## Suggested tool structure

```text
apps/example-tool/
wordpress/example-tool/
packages/example-tool-core/
```

Start from the relevant directory in `templates/` and document the tool's jurisdiction, source law, assumptions, update date, data handling, and disclaimer.

## Principles

- Treat legal accuracy and source traceability as product requirements.
- Keep legal rules separate from presentation and CMS integration code.
- State the supported jurisdiction and effective date prominently.
- Minimize collection of personal or case data.
- Make tools accessible, mobile-friendly, and easy to embed.
- Do not present general legal information as individualized legal advice.

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) and [docs/architecture.md](docs/architecture.md) before adding a tool. Security or privacy issues should be reported according to [SECURITY.md](SECURITY.md).

## Status

This repository is an initial foundation. Individual tools will be added as independently documented projects.

## License

MIT. See [LICENSE](LICENSE).
