"use client";

import { useMemo, useState, type KeyboardEvent } from "react";
import { states } from "@/lib/states";

type MoneyKey = "medical" | "futureMedical" | "lostIncome" | "property" | "other";
type MoneyFields = Record<MoneyKey, number>;
type LawTabId = "deadline" | "fault" | "damages" | "coverage";

const moneyLabels: Array<{ key: MoneyKey; label: string; hint: string }> = [
  { key: "medical", label: "Medical expenses", hint: "Bills paid or outstanding" },
  { key: "futureMedical", label: "Expected future care", hint: "Treatment you may still need" },
  { key: "lostIncome", label: "Lost income", hint: "Wages or earnings already missed" },
  { key: "property", label: "Property damage", hint: "Vehicle or other property" },
  { key: "other", label: "Other documented costs", hint: "Travel, care, equipment, etc." },
];

const severityBands = [
  { label: "Minor", detail: "Short recovery, limited treatment", low: 0.5, high: 1.25 },
  { label: "Moderate", detail: "Weeks of treatment or disruption", low: 1, high: 2.25 },
  { label: "Significant", detail: "Long recovery or lasting symptoms", low: 1.75, high: 3.5 },
  { label: "Severe", detail: "Major treatment or long-term effects", low: 2.75, high: 4.75 },
  { label: "Catastrophic", detail: "Permanent, life-changing injury", low: 4, high: 6.5 },
];

const lawTabs: Array<{
  id: LawTabId;
  label: string;
  heading: (stateName: string) => string;
  summary: (stateName: string) => string;
  checks: string[];
}> = [
  {
    id: "deadline",
    label: "Filing deadline",
    heading: (stateName) => `Which ${stateName} filing deadline controls?`,
    summary: (stateName) => `The time limit may change with the defendant, claim type, accrual date, discovery rules, the claimant’s age or capacity, and any required pre-suit notice. Confirm the current ${stateName} statute before relying on a date.`,
    checks: ["Date the claim accrued", "Defendant and claim type", "Notice or tolling rules"],
  },
  {
    id: "fault",
    label: "Fault rules",
    heading: (stateName) => `How does ${stateName} treat shared fault?`,
    summary: (stateName) => `Identify the current ${stateName} negligence framework and whether a claimant’s share of responsibility reduces or prevents recovery. The calculator’s fault slider is only a planning adjustment and does not apply that legal rule.`,
    checks: ["Liability standard", "Effect of shared fault", "Fault evidence and defenses"],
  },
  {
    id: "damages",
    label: "Damages",
    heading: (stateName) => `Which damages may be recoverable in ${stateName}?`,
    summary: (stateName) => `Review current ${stateName} authority for economic, non-economic, and punitive damages, including limitations that depend on the claim, defendant, or forum. The range above does not apply statutory caps or exclusions.`,
    checks: ["Recoverable damage categories", "Claim-specific limitations", "Proof required for each loss"],
  },
  {
    id: "coverage",
    label: "Insurance",
    heading: (stateName) => `What coverage may respond in ${stateName}?`,
    summary: (stateName) => `Map every potentially applicable policy and current ${stateName} coverage requirement before treating the estimate as collectible. Policy language, exclusions, limits, priority, and notice duties can change the practical recovery.`,
    checks: ["Liability policy limits", "First-party or UM/UIM coverage", "Notice, exclusions, and priority"],
  },
];

const fmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

type SettlementCalculatorProps = {
  initialState?: string;
  stateCode?: string;
};

export function SettlementCalculator({ initialState = "Not selected", stateCode }: SettlementCalculatorProps) {
  const [money, setMoney] = useState<MoneyFields>({
    medical: 18500,
    futureMedical: 6000,
    lostIncome: 4200,
    property: 3500,
    other: 750,
  });
  const [severity, setSeverity] = useState(2);
  const [fault, setFault] = useState(0);
  const [caseType, setCaseType] = useState("Auto collision");
  const [state, setState] = useState(initialState);
  const [activeLawTab, setActiveLawTab] = useState<LawTabId>("deadline");

  const result = useMemo(() => {
    const economic = Object.values(money).reduce((sum, value) => sum + Math.max(0, value || 0), 0);
    const treatmentBase = Math.max(0, money.medical + money.futureMedical);
    const band = severityBands[severity];
    const reduction = Math.max(0, Math.min(100, fault)) / 100;
    const low = (economic + treatmentBase * band.low) * (1 - reduction);
    const high = (economic + treatmentBase * band.high) * (1 - reduction);
    return { economic, low, high, band };
  }, [money, severity, fault]);

  const updateMoney = (key: MoneyKey, raw: string) => {
    setMoney((current) => ({ ...current, [key]: Number(raw) || 0 }));
  };

  const moveLawTabFocus = (event: KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
    let nextIndex = currentIndex;
    if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % lawTabs.length;
    else if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + lawTabs.length) % lawTabs.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = lawTabs.length - 1;
    else return;

    event.preventDefault();
    const nextTab = lawTabs[nextIndex];
    setActiveLawTab(nextTab.id);
    requestAnimationFrame(() => document.getElementById(`law-tab-${nextTab.id}`)?.focus());
  };

  const isStateContext = initialState !== "Not selected";
  const heading = !isStateContext
    ? "Estimate your personal injury settlement range"
    : `Calculate a ${initialState} personal injury settlement range`;
  const resultHeading = isStateContext
    ? `${initialState} settlement planning range`
    : "Your estimated settlement range";
  const claimArticle = /^[aeiou]/i.test(caseType) ? "an" : "a";
  const lawState = state !== "Not selected" ? state : initialState;
  const lawStateCode = states.find((item) => item.name === lawState)?.code ?? stateCode ?? "STATE";

  return (
    <div className="calculator-shell" id="calculator">
      <div className="case-tab">
        <span>{isStateContext ? `${initialState} context` : "Working file"}</span>
        <strong>{stateCode ? `GENERAL MODEL / ${stateCode}` : "CLAIM / 001"}</strong>
      </div>
      <div className="calculator-grid">
        <form className="calculator-form" onSubmit={(event) => event.preventDefault()}>
          <div className="form-heading">
            <span>01</span>
            <div><h2>{heading}</h2><p>{isStateContext ? `${initialState} is preselected. Use documented amounts where possible.` : "Use documented amounts where possible."}</p></div>
          </div>

          <div className="field-pair">
            <label>Claim type
              <select value={caseType} onChange={(event) => setCaseType(event.target.value)}>
                <option>Auto collision</option>
                <option>Slip and fall</option>
                <option>Workplace injury</option>
                <option>Medical malpractice</option>
                <option>Other personal injury</option>
              </select>
            </label>
            <label>State
              <select value={state} onChange={(event) => setState(event.target.value)}>
                <option>Not selected</option>
                {states.map((item) => <option key={item.code}>{item.name}</option>)}
              </select>
            </label>
          </div>

          <fieldset>
            <legend>Documented losses</legend>
            <div className="money-grid">
              {moneyLabels.map((field) => (
                <label className="money-field" key={field.key}>
                  <span>{field.label}<small>{field.hint}</small></span>
                  <span className="currency-input"><i>$</i><input type="number" min="0" step="100" value={money[field.key]} onChange={(event) => updateMoney(field.key, event.target.value)} /></span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>Impact and responsibility</legend>
            <label className="range-label">
              <span>Injury impact <strong>{severityBands[severity].label}</strong></span>
              <input aria-label="Injury impact" type="range" min="0" max="4" value={severity} onChange={(event) => setSeverity(Number(event.target.value))} />
              <small>{severityBands[severity].detail}</small>
            </label>
            <label className="range-label fault-range">
              <span>Your possible share of fault <strong>{fault}%</strong></span>
              <input aria-label="Your possible share of fault" type="range" min="0" max="80" step="5" value={fault} onChange={(event) => setFault(Number(event.target.value))} />
              <small>This reduces the planning range. State rules may work differently.</small>
            </label>
          </fieldset>
        </form>

        <aside className="result-panel" aria-labelledby="estimate-heading" aria-live="polite">
          <p className="result-kicker">Planning range</p>
          <h2 className="result-title" id="estimate-heading">{resultHeading}</h2>
          <div className="result-range">
            <span>{fmt.format(result.low)}</span>
            <i>to</i>
            <span>{fmt.format(result.high)}</span>
          </div>
          <p className="range-context">for {claimArticle} {caseType.toLowerCase()} claim {state !== "Not selected" ? `in ${state}` : "before state-specific rules"}</p>

          <div className="range-track"><span style={{ left: "18%", right: "15%" }} /></div>
          <div className="result-breakdown">
            <div><span>Economic losses</span><strong>{fmt.format(result.economic)}</strong></div>
            <div><span>Impact band</span><strong>{result.band.low}×–{result.band.high}×</strong></div>
            <div><span>Fault adjustment</span><strong>−{fault}%</strong></div>
          </div>

          <div className="calculation-note">
            <span>How this was calculated</span>
            <p>(Economic losses + treatment costs × impact band) − your fault adjustment.</p>
          </div>
          <button type="button" className="copy-button" onClick={() => navigator.clipboard?.writeText(`Settlement planning range: ${fmt.format(result.low)}–${fmt.format(result.high)}. Generated at settlementcalculator.guide.`)}>
            Copy estimate summary
          </button>
          <p className="fine-print">{isStateContext ? `This general educational estimate does not apply ${initialState} statutes, deadlines, damage caps, or negligence rules.` : "This educational estimate is not legal advice, a valuation, or a promise of recovery."}</p>
        </aside>
      </div>
      {isStateContext && (
        <section className="related-law" aria-labelledby="related-law-heading">
          <div className="related-law-heading">
            <div>
              <p>Related law segment · {lawStateCode}</p>
              <h2 id="related-law-heading">Legal checks for a {lawState} settlement estimate</h2>
            </div>
            <span>Research status: verify current primary law</span>
          </div>
          <div className="law-tablist" role="tablist" aria-label={`${lawState} related law topics`}>
            {lawTabs.map((tab, index) => (
              <button
                key={tab.id}
                type="button"
                id={`law-tab-${tab.id}`}
                role="tab"
                aria-selected={activeLawTab === tab.id}
                aria-controls={`law-panel-${tab.id}`}
                tabIndex={activeLawTab === tab.id ? 0 : -1}
                onClick={() => setActiveLawTab(tab.id)}
                onKeyDown={(event) => moveLawTabFocus(event, index)}
              >
                <span>0{index + 1}</span>{tab.label}
              </button>
            ))}
          </div>
          {lawTabs.map((tab) => (
            <div
              className="law-tabpanel"
              key={tab.id}
              id={`law-panel-${tab.id}`}
              role="tabpanel"
              aria-labelledby={`law-tab-${tab.id}`}
              hidden={activeLawTab !== tab.id}
            >
              <div>
                <p className="law-topic">{tab.label} · {lawStateCode}</p>
                <h3>{tab.heading(lawState)}</h3>
                <p>{tab.summary(lawState)}</p>
              </div>
              <ul aria-label={`${tab.label} research checklist`}>
                {tab.checks.map((check) => <li key={check}>{check}</li>)}
              </ul>
            </div>
          ))}
          <p className="related-law-disclaimer">Educational issue-spotting only. This segment does not state the controlling law or replace advice from a licensed {lawState} attorney.</p>
        </section>
      )}
    </div>
  );
}
