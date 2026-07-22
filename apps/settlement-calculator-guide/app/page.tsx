"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { states } from "@/lib/states";

type MoneyKey =
  | "medical"
  | "futureMedical"
  | "lostIncome"
  | "property"
  | "other";

type MoneyFields = Record<MoneyKey, number>;

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

const stateGroups = [
  { label: "A–G", states: states.filter((item) => item.name[0] <= "G") },
  { label: "H–M", states: states.filter((item) => item.name[0] >= "H" && item.name[0] <= "M") },
  { label: "N–R", states: states.filter((item) => item.name[0] >= "N" && item.name[0] <= "R") },
  { label: "S–Z", states: states.filter((item) => item.name[0] >= "S") },
];

const fmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function scrollToCalculator() {
  document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" });
}

export default function Home() {
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
  const [state, setState] = useState("Not selected");

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

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Settlement Calculator Guide home">
          <span className="brand-mark">SC</span>
          <span>Settlement Calculator<span className="brand-domain">.guide</span></span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#method">Method</a>
          <a href="#factors">Claim factors</a>
          <a href="#states">State guides</a>
          <a href="#faq">FAQ</a>
        </nav>
        <button className="header-action" onClick={scrollToCalculator}>Estimate a claim</button>
      </header>

      <section className="hero" id="top" aria-labelledby="page-title">
        <div className="hero-copy">
          <p className="eyebrow"><span>Independent methodology</span> · Updated July 2026</p>
          <h1 id="page-title">Personal Injury Settlement Calculator</h1>
          <p className="hero-lede">
            Build a documented settlement range from the costs you know, the impact of the injury,
            and your share of fault. See the reasoning—not a mystery number.
          </p>
          <div className="hero-proof">
            <div><strong>5</strong><span>damage inputs</span></div>
            <div><strong>2</strong><span>range scenarios</span></div>
            <div><strong>0</strong><span>contact details required</span></div>
          </div>
          <p className="byline">Concept and information architecture by <strong>Koray Tuğberk Gübür</strong></p>
        </div>

        <div className="calculator-shell" id="calculator">
          <div className="case-tab"><span>Working file</span><strong>CLAIM / 001</strong></div>
          <div className="calculator-grid">
            <form className="calculator-form" onSubmit={(event) => event.preventDefault()}>
              <div className="form-heading">
                <span>01</span>
                <div><h2>Estimate your personal injury settlement range</h2><p>Use documented amounts where possible.</p></div>
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
              <h2 className="result-title" id="estimate-heading">Your estimated settlement range</h2>
              <div className="result-range">
                <span>{fmt.format(result.low)}</span>
                <i>to</i>
                <span>{fmt.format(result.high)}</span>
              </div>
              <p className="range-context">for a {caseType.toLowerCase()} claim {state !== "Not selected" ? `in ${state}` : "before state-specific rules"}</p>

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
              <p className="fine-print">This educational estimate is not legal advice, a valuation, or a promise of recovery.</p>
            </aside>
          </div>
        </div>
      </section>

      <section className="method-strip" aria-label="Methodology summary">
        <p>THE RANGE, EXPOSED</p>
        <div><span>Known losses</span><b>+</b><span>Human impact</span><b>−</b><span>Responsibility</span><b>=</b><strong>Planning range</strong></div>
      </section>

      <section className="section method" id="method" aria-labelledby="method-heading">
        <div className="section-heading">
          <p className="eyebrow">Method before marketing</p>
          <h2 id="method-heading">How a personal injury settlement estimate is calculated</h2>
          <p>Most claim values cannot be reduced to one precise number. We publish the assumptions so you can challenge them, replace them, or take them to a qualified lawyer.</p>
        </div>
        <div className="method-cards">
          <article><span>Input</span><h3>Add documented economic damages</h3><p>Medical bills, future care, missed earnings, damaged property, and other receipts create the economic base.</p></article>
          <article><span>Range</span><h3>Estimate pain and suffering impact</h3><p>An impact band creates low and high scenarios. It is intentionally broad because injuries and evidence differ.</p></article>
          <article><span>Adjustment</span><h3>Apply a comparative fault adjustment</h3><p>A possible fault share reduces the range. Your jurisdiction may cap damages or apply different negligence rules.</p></article>
        </div>
        <div className="editorial-note">
          <div className="note-index">K / 01</div>
          <blockquote>“The useful answer is not the biggest number. It is the clearest model of what could change the number.”</blockquote>
          <p>— Editorial principle, SettlementCalculator.guide</p>
        </div>
      </section>

      <section className="section factors" id="factors" aria-labelledby="factors-heading">
        <div className="section-heading split-heading">
          <div><p className="eyebrow">Value drivers</p><h2 id="factors-heading">What factors affect a personal injury settlement value?</h2></div>
          <p>The calculator covers a starting model. Real negotiations also turn on evidence quality, coverage, causation, and local law.</p>
        </div>
        <div className="factor-grid">
          {[
            ["01", "Medical evidence", "Consistent records can connect the event, diagnosis, treatment, and future care."],
            ["02", "Income proof", "Pay records, tax returns, and expert analysis can support time away and reduced capacity."],
            ["03", "Liability evidence", "Reports, photographs, witnesses, video, and admissions can clarify responsibility."],
            ["04", "Recovery duration", "A longer, documented disruption can affect non-economic damages."],
            ["05", "Insurance limits", "Available coverage can constrain recovery even when losses are higher."],
            ["06", "State law", "Fault rules, damage caps, deadlines, and admissible evidence vary by jurisdiction."],
          ].map(([index, title, copy]) => <article key={index}><span>{index}</span><h3>{title}</h3><p>{copy}</p></article>)}
        </div>
      </section>

      <section className="section states-section" id="states" aria-labelledby="states-heading">
        <div className="section-heading split-heading states-heading">
          <div>
            <p className="eyebrow">Geographic topic cluster</p>
            <h2 id="states-heading">Personal injury settlement calculators by state</h2>
          </div>
          <p>Explore the calculation framework in a state context. These guides identify what still requires jurisdiction-specific legal review before any estimate can reflect local law.</p>
        </div>
        <div className="state-directory">
          {stateGroups.map((group) => (
            <div className="state-group" key={group.label}>
              <h3>{group.label}</h3>
              <ul>
                {group.states.map((item) => (
                  <li key={item.code}>
                    <Link href={`/states/${item.slug}`}>
                      <span>{item.name}</span><small>{item.code}</small><i aria-hidden="true">↗</i>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="state-disclaimer"><strong>Scope note:</strong> The current estimator is a general educational model. State pages do not yet apply statutes, damage caps, limitation periods, or negligence rules.</p>
      </section>

      <section className="section scope-section" aria-labelledby="interpret-heading">
        <div className="scope-card">
          <p className="eyebrow">Information gain</p>
          <h2 id="interpret-heading">How to interpret your settlement estimate</h2>
          <ol>
            <li><span>Is every loss supported by a record?</span><small>Replace memory with bills, reports, wage statements, and dates.</small></li>
            <li><span>Which facts could weaken causation?</span><small>Prior injuries and treatment gaps often need context, not concealment.</small></li>
            <li><span>What does local law change?</span><small>Check deadlines, comparative fault, caps, and recoverable damages.</small></li>
            <li><span>What coverage is actually available?</span><small>Identify responsible parties and relevant insurance policies.</small></li>
          </ol>
        </div>
        <div className="scope-aside">
          <span className="scope-stamp">NO LEAD FORM</span>
          <h3>Your case facts stay in your browser.</h3>
          <p>This first version sends no calculator inputs to a server and asks for no name, email, or phone number.</p>
          <button onClick={scrollToCalculator}>Recalculate privately <span>↗</span></button>
        </div>
      </section>

      <section className="section faq" id="faq" aria-labelledby="faq-heading">
        <div className="section-heading"><p className="eyebrow">Plain answers</p><h2 id="faq-heading">Frequently asked questions about settlement calculators</h2></div>
        <div className="faq-list">
          <details open><summary><h3>Is this settlement estimate accurate?</h3><span>+</span></summary><p>It is a planning model, not a prediction. It uses the values you provide and a disclosed impact range. Evidence, insurance, jurisdiction, negotiation, and many case-specific facts can produce a materially different outcome.</p></details>
          <details><summary><h3>Why does the calculator give a range?</h3><span>+</span></summary><p>A range makes uncertainty visible. A single dollar result suggests a level of precision that a general-purpose calculator cannot support.</p></details>
          <details><summary><h3>How are pain and suffering damages estimated?</h3><span>+</span></summary><p>The calculator applies a disclosed impact band to treatment costs for scenario planning. This multiplier is an educational shortcut, not a legal standard or a method that insurers, lawyers, judges, or juries must use.</p></details>
          <details><summary><h3>Does selecting a state apply that state’s settlement law?</h3><span>+</span></summary><p>Not yet. The current state field provides context only. State-specific rule modules and cited legal sources are planned for later releases.</p></details>
        </div>
      </section>

      <section className="final-cta" aria-labelledby="final-heading">
        <p>Estimate the range. Inspect the assumptions.</p>
        <h2 id="final-heading">Calculate your personal injury settlement range</h2>
        <button onClick={scrollToCalculator}>Open the calculator <span>↑</span></button>
      </section>

      <footer>
        <a className="brand footer-brand" href="#top"><span className="brand-mark">SC</span><span>Settlement Calculator<span className="brand-domain">.guide</span></span></a>
        <p>Independent educational tools for understanding personal injury claim variables.</p>
        <div><a href="#method">Methodology</a><a href="#faq">FAQ</a><span>© 2026</span></div>
      </footer>
    </main>
  );
}
