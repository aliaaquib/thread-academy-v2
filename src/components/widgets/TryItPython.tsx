"use client";

import { useRef, useState } from "react";

const PYODIDE_VERSION = "0.27.5";
const PYODIDE_CDN = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

declare global {
  interface Window {
    loadPyodide?: (opts: { indexURL: string }) => Promise<PyodideInstance>;
  }
}

interface PyodideInstance {
  setStdout: (opts: { batched: (s: string) => void }) => void;
  setStderr: (opts: { batched: (s: string) => void }) => void;
  runPythonAsync: (code: string) => Promise<unknown>;
}

/** Load the Pyodide runtime from CDN on first use only. */
function ensurePyodide(): Promise<PyodideInstance> {
  if (typeof window === "undefined") return Promise.reject(new Error("No window"));
  const w = window as Window & { __pyodidePromise?: Promise<PyodideInstance> };
  if (w.__pyodidePromise) return w.__pyodidePromise;
  w.__pyodidePromise = (async () => {
    if (!w.loadPyodide) {
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = `${PYODIDE_CDN}pyodide.js`;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Could not load the Python runtime. Check your connection and try again."));
        document.head.appendChild(script);
      });
    }
    if (!w.loadPyodide) throw new Error("Python runtime failed to initialise.");
    return w.loadPyodide({ indexURL: PYODIDE_CDN });
  })();
  return w.__pyodidePromise;
}

/**
 * Runnable Python playground reusing the .tryit design.
 * The Pyodide WASM runtime lazy-loads from CDN only when Run is first pressed.
 */
export default function TryItPython({
  title,
  subtitle,
  initialCode,
}: {
  title: string;
  subtitle?: string;
  initialCode: string;
}) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState("");
  const [showOutput, setShowOutput] = useState(false);
  const [status, setStatus] = useState("Ready — press Run.");
  const [running, setRunning] = useState(false);
  const pyRef = useRef<PyodideInstance | null>(null);

  const run = async () => {
    setRunning(true);
    setShowOutput(false);
    setOutput("");
    try {
      if (!pyRef.current) {
        setStatus("Loading Python runtime (first run takes a few seconds)…");
        pyRef.current = await ensurePyodide();
      }
      setStatus("Running…");
      let out = "";
      pyRef.current.setStdout({ batched: (s: string) => { out += s + "\n"; } });
      pyRef.current.setStderr({ batched: (s: string) => { out += s + "\n"; } });
      await pyRef.current.runPythonAsync(code);
      setOutput(out.trimEnd() || "(no output)");
      setStatus("Done in " + new Date().toLocaleTimeString() + ".");
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      // Pyodide prefixes Python tracebacks; keep the useful tail.
      const tail = message.split("\n").slice(-6).join("\n");
      setOutput(tail || message);
      setStatus("Something went wrong — see the output.");
    } finally {
      setShowOutput(true);
      setRunning(false);
    }
  };

  return (
    <div className="tryit">
      <div className="tryit-head">
        <strong>{title}</strong>
        {subtitle && <span>{subtitle}</span>}
      </div>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        spellCheck={false}
        aria-label="Python code editor"
      />
      <div className="tryit-foot">
        <button type="button" className="run-btn" onClick={run} disabled={running}>
          {running ? "Running…" : "Run"}
        </button>
        <span className="tryit-status">{status}</span>
      </div>
      <pre className={`tryit-output${showOutput ? " visible" : ""}`}>{output}</pre>
    </div>
  );
}
