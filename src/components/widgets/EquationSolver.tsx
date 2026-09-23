"use client";

import { useState } from "react";

interface Step {
  text: string;
  result?: boolean;
}

/** Parse a decimal or fraction string to a number. */
function parseNum(s: string): number | null {
  const t = s.trim().replace(/\s+/g, "");
  if (t === "" || t === "+" || t === "-") return t.startsWith("-") ? -1 : 1;
  if (/^[+-]?\d+(\.\d+)?$/.test(t)) return parseFloat(t);
  const frac = t.match(/^([+-]?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/);
  if (frac) {
    const den = parseFloat(frac[2]);
    if (den === 0) return null;
    return parseFloat(frac[1]) / den;
  }
  return null;
}

/**
 * Parse one side of a linear equation into { a, b } meaning a·x + b.
 * Supports terms like 3x, -x, x/2, 2(x+3), constants, decimals and fractions.
 */
function parseSide(expr: string): { a: number; b: number } | null {
  let s = expr.replace(/\s+/g, "");
  if (s === "") return null;
  // Expand k*(...) with a numeric k and linear inner expression.
  const expandable = s.match(/^([+-]?\d+(?:\.\d+)?)\*\(([^()]*)\)$/);
  if (expandable) {
    const k = parseFloat(expandable[1]);
    const inner = parseSide(expandable[2]);
    if (inner === null) return null;
    return { a: k * inner.a, b: k * inner.b };
  }
  // Split into signed terms.
  const terms = s.replace(/-/g, "+-").split("+").filter((t) => t !== "");
  let a = 0;
  let b = 0;
  for (let term of terms) {
    // x/2 or 3x/2 style division by a number
    const divMatch = term.match(/^([+-]?\d*(?:\.\d+)?)x\/(\d+(?:\.\d+)?)$/);
    if (divMatch) {
      const coef = divMatch[1] === "" || divMatch[1] === "+" ? 1 : divMatch[1] === "-" ? -1 : parseFloat(divMatch[1]);
      a += coef / parseFloat(divMatch[2]);
      continue;
    }
    if (/[a-zA-Z]/.test(term)) {
      const coefStr = term.replace(/x/i, "");
      if (/[a-wy-zA-WY-Z]/.test(term.replace(/x/i, ""))) return null; // only x allowed
      const coef = coefStr === "" || coefStr === "+" ? 1 : coefStr === "-" ? -1 : parseNum(coefStr);
      if (coef === null) return null;
      a += coef;
    } else {
      const n = parseNum(term);
      if (n === null) return null;
      b += n;
    }
  }
  return { a, b };
}

function fmt(n: number): string {
  const r = Math.round(n * 1e10) / 1e10;
  return Number.isInteger(r) ? String(r) : String(r);
}

function fmtTerm(coef: number, constant: number): string {
  const parts: string[] = [];
  if (coef !== 0) {
    const c = fmt(Math.abs(coef));
    parts.push(`${coef < 0 ? "−" : ""}${c === "1" ? "" : c}x`);
  }
  if (constant !== 0 || parts.length === 0) {
    const sign = constant < 0 ? (parts.length ? " − " : "−") : parts.length ? " + " : "";
    parts.push(`${sign}${fmt(Math.abs(constant))}`);
  }
  return parts.join("");
}

/** Solve ax + b = cx + d, returning human-readable steps. */
function solve(equation: string): Step[] | { error: string } {
  const sides = equation.split("=");
  if (sides.length !== 2) return { error: "Write the equation with exactly one '=' sign, e.g. 3x + 2 = 14." };
  const L = parseSide(sides[0]);
  const R = parseSide(sides[1]);
  if (!L || !R) {
    return {
      error:
        "I can only solve linear equations in x — like 3x + 2 = 14, x/2 − 5 = 11 or 2(x + 3) = 4x − 1.",
    };
  }
  const steps: Step[] = [];
  steps.push({ text: `Start:  ${fmtTerm(L.a, L.b)} = ${fmtTerm(R.a, R.b)}` });

  const a = L.a - R.a; // bring x-terms left
  const b = R.b - L.b; // bring constants right
  if (R.a !== 0) steps.push({ text: `Collect the x-terms on the left:  ${fmtTerm(a, 0)} = ${fmt(b)}` });
  else if (L.b !== 0 || R.b !== 0) steps.push({ text: `Isolate the x-term:  ${fmtTerm(a, 0)} = ${fmt(b)}` });

  if (a === 0) {
    if (b === 0) return [{ text: "0 = 0 — every value of x works. Infinitely many solutions!", result: true }];
    return [{ text: `${fmt(b)} = 0 is false — no value of x can satisfy this equation.`, result: true }];
  }
  const x = b / a;
  if (a !== 1) steps.push({ text: `Divide both sides by ${fmt(a)}:  x = ${fmt(b)} ÷ ${fmt(a)}` });
  steps.push({ text: `x = ${fmt(x)}`, result: true });
  return steps;
}

/** Client-side linear equation solver / balancer, styled to the design. */
export default function EquationSolver() {
  const [input, setInput] = useState("3x + 2 = 14");
  const [steps, setSteps] = useState<Step[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = () => {
    const res = solve(input);
    if ("error" in res) {
      setError(res.error);
      setSteps(null);
    } else {
      setError(null);
      setSteps(res);
    }
  };

  return (
    <div className="solver">
      <div className="solver-head">
        <strong>Linear equation solver</strong>
        <span>Type any linear equation in x — it is solved step by step, entirely in your browser.</span>
      </div>
      <div className="solver-body">
        <form
          className="solver-input-row"
          onSubmit={(e) => {
            e.preventDefault();
            run();
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            aria-label="Linear equation"
            placeholder="e.g. 3x + 2 = 14"
            spellCheck={false}
          />
          <button type="submit" className="run-btn">Solve</button>
        </form>
        {error && <p className="solver-error">{error}</p>}
        {steps && (
          <ol className="solver-steps">
            {steps.map((s, i) => (
              <li key={i} className={s.result ? "solver-result" : ""}>
                {s.text}
              </li>
            ))}
          </ol>
        )}
        {!steps && !error && (
          <p className="empty-note">Press Solve to see each step — then cover the steps and try the next one yourself.</p>
        )}
      </div>
    </div>
  );
}
