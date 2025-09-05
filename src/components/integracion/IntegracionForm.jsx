import React, { useRef, useState } from "react";
import { resolverIntegracion } from "../../services/apiService";
import { normalizeExpression } from "../../utils/exprMap";
import MathKeypad from "../MathKeypad";

const METODOS = [
  { value: "rectangulo", label: "Rectángulo (Grado 0)" },
  { value: "trapezoidal", label: "Trapezoidal (Grado 1)" },
  { value: "simpson_13", label: "Simpson 1/3 (Grado 2)" },
  { value: "simpson_38", label: "Simpson 3/8 (Grado 3)" },
  { value: "boole", label: "Boole (Grado 4)" },
  { value: "adaptativo", label: "Adaptativo (Simpson)" },
];

const EJEMPLOS = [
  { label: "x^2", expr: "x^2" },
  { label: "sin(x)/x", expr: "sin(x)/x" },
  { label: "(e^x-1)/x", expr: "(exp(x)-1)/x" },
  { label: "(1-cos x)/x^2", expr: "(1-cos(x))/x^2" },
];

export default function IntegracionForm({ onResultado }) {
  const [form, setForm] = useState({
    metodo: "trapezoidal",
    fx: "sin(x)/x",
    a: "0",
    b: "pi/2",
    n: "10",
    tol: "1e-6",
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const isAdaptive = form.metodo === "adaptativo";

  // manejo de foco para insertar desde el keypad
  const lastFocus = useRef("fx");
  const refs = {
    fx: useRef(null),
    a: useRef(null),
    b: useRef(null),
    n: useRef(null),
    tol: useRef(null),
  };

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };
  const handleFocus = (name) => () => { lastFocus.current = name; };

  const insertAtCursor = (name, token) => {
    const el = refs[name]?.current;
    if (!el) return;
    const start = el.selectionStart ?? el.value.length;
    const end = el.selectionEnd ?? el.value.length;
    const newVal = el.value.slice(0, start) + token + el.value.slice(end);
    setForm((prev) => ({ ...prev, [name]: newVal }));
    setTimeout(() => {
      el.focus();
      const pos = start + token.length;
      el.setSelectionRange(pos, pos);
    }, 0);
  };
  const handleInsert = (token) => insertAtCursor(lastFocus.current, token);
  const handleBackspace = () => {
    const name = lastFocus.current;
    const el = refs[name]?.current;
    if (!el) return;
    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
    if (start === end && start > 0) {
      const newVal = el.value.slice(0, start - 1) + el.value.slice(end);
      setForm((p) => ({ ...p, [name]: newVal }));
      setTimeout(() => {
        el.focus();
        const pos = start - 1;
        el.setSelectionRange(pos, pos);
      }, 0);
      return;
    }
    const newVal = el.value.slice(0, start) + el.value.slice(end);
    setForm((p) => ({ ...p, [name]: newVal }));
  };
  const handleClear = () => {
    const name = lastFocus.current;
    setForm((p) => ({ ...p, [name]: "" }));
    refs[name]?.current?.focus();
  };

  const validate = () => {
    if (!form.fx) return "f(x) es requerido";
    if (isNaN(parseFloat(form.a)) && !/pi|e|x/i.test(form.a)) {
      return "a debe ser numérico (admite pi, e)";
    }
    if (isNaN(parseFloat(form.b)) && !/pi|e|x/i.test(form.b)) {
      return "b debe ser numérico (admite pi, e)";
    }
    if (!isAdaptive && isNaN(parseInt(form.n))) return "n debe ser un entero";
    if (isAdaptive && isNaN(parseFloat(form.tol))) return "tol debe ser numérica";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    const v = validate();
    if (v) {
      setErr(v);
      return;
    }
    setLoading(true);
    try {
      const payload = {
        metodo: form.metodo,
        fx: normalizeExpression(form.fx),
        a: parseFloat(evalJSExpr(form.a)),
        b: parseFloat(evalJSExpr(form.b)),
        ...(isAdaptive
          ? { tol: parseFloat(form.tol) }
          : { n: parseInt(form.n, 10) }),
      };
      const res = await resolverIntegracion(payload);
      onResultado?.(res);
    } catch (e) {
      setErr("Error al resolver la integración. Verificá los datos.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const setEjemplo = (expr) => setForm((p) => ({ ...p, fx: expr }));

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-3 text-center text-indigo-600">Parámetros de Integración</h2>

      {/* Métodos como menú de botones */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {METODOS.map((m) => (
          <button
            key={m.value}
            type="button"
            onClick={() => setForm((p) => ({ ...p, metodo: m.value }))}
            className={`px-3 py-2 rounded border text-sm ${
              form.metodo === m.value
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-gray-50 hover:bg-gray-100 border-gray-300"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Entradas */}
      <div className="grid grid-cols-1 gap-3">
        <div className="flex items-center gap-2">
          <label className="w-28 font-medium text-gray-700">Función f(x):</label>
          <input
            ref={refs.fx}
            onFocus={handleFocus("fx")}
            name="fx"
            value={form.fx}
            onChange={handleChange}
            placeholder="Ej: sin(x)/x"
            className="flex-1 border rounded p-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2">
            <label className="w-10 font-medium text-gray-700">a:</label>
            <input
              ref={refs.a}
              onFocus={handleFocus("a")}
              name="a"
              value={form.a}
              onChange={handleChange}
              placeholder="Ej: 0"
              className="flex-1 border rounded p-2"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="w-10 font-medium text-gray-700">b:</label>
            <input
              ref={refs.b}
              onFocus={handleFocus("b")}
              name="b"
              value={form.b}
              onChange={handleChange}
              placeholder="Ej: pi/2"
              className="flex-1 border rounded p-2"
            />
          </div>
        </div>

        {form.metodo !== "adaptativo" ? (
          <div className="flex items-center gap-2">
            <label className="w-28 font-medium text-gray-700">Subdivisiones (n):</label>
            <input
              ref={refs.n}
              onFocus={handleFocus("n")}
              name="n"
              value={form.n}
              onChange={handleChange}
              placeholder="Ej: 10"
              className="flex-1 border rounded p-2"
            />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <label className="w-28 font-medium text-gray-700">Tolerancia:</label>
            <input
              ref={refs.tol}
              onFocus={handleFocus("tol")}
              name="tol"
              value={form.tol}
              onChange={handleChange}
              placeholder="Ej: 1e-6"
              className="flex-1 border rounded p-2"
            />
          </div>
        )}

        {/* Ejemplos rápidos */}
        <div>
          <div className="text-sm text-gray-600 mb-1">Ejemplos rápidos:</div>
          <div className="flex flex-wrap gap-2">
            {EJEMPLOS.map((e) => (
              <button
                key={e.label}
                type="button"
                onClick={() => setEjemplo(e.expr)}
                className="px-2 py-1 rounded border text-xs bg-gray-50 hover:bg-gray-100"
              >
                {e.label}
              </button>
            ))}
          </div>
        </div>

        {/* Teclado matemático (tu componente) */}
        <MathKeypad onInsert={handleInsert} onBackspace={handleBackspace} onClear={handleClear} />

        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded transition"
        >
          {loading ? "Resolviendo..." : "Resolver"}
        </button>

        {err && <p className="text-red-600 text-sm">{err}</p>}
        <p className="text-xs text-gray-500">
          Notación: <code>pi</code> = π, <code>e</code> = e. Acepta <code>sen</code>, <code>√</code>, <code>|x|</code>, <code>×</code>, <code>÷</code> (se normalizan).
        </p>
      </div>
    </form>
  );
}

/** Evalúa expresiones simples con pi/e en el front para a/b */
function evalJSExpr(str) {
  const m = String(str).trim()
    .replaceAll(/\bpi\b/gi, `${Math.PI}`)
    .replaceAll(/\be\b/g, `${Math.E}`);
  // eval new Function para evitar eval directa
  // (no hay entrada de usuario peligrosa: solo a/b; aún así, si preferís, parseá a mano)
  return Function(`"use strict";return (${m});`)();
}
