# SettlementCalculator.guide

An evidence-first personal injury settlement planning tool for the `settlementcalculator.guide` exact-match domain.

## Purpose

The calculator turns documented economic losses, an injury-impact band, and a possible fault share into a transparent low/high planning range. It is educational software, not legal advice, a case valuation, or a promise of recovery.

## Current scope

- U.S.-focused general information
- Client-side calculation with no lead form or input persistence
- General scenario model; selecting a state does not yet apply state law
- Responsive one-page editorial experience

## Method

```text
(economic losses + treatment costs × impact band) × (1 − fault share)
```

The five impact bands currently range from `0.5×–1.25×` for minor impact to `4×–6.5×` for catastrophic impact. These are disclosed scenario assumptions, not legal standards.

## Development

Requires Node.js `>=22.13.0`.

```bash
npm install
npm run dev
npm test
```

## Before production launch

- commission legal review of the calculation model and all claims;
- add cited state-specific rule modules rather than implying the state selector applies local law;
- establish an editorial review date and change log;
- finalize privacy, terms, and contact pages;
- configure analytics only after defining consent and retention requirements.
