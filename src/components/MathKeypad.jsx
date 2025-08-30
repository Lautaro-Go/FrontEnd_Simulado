// src/components/MathKeypad.jsx
import React from "react";

const buttons = [
  { label: "(", value: "(" }, { label: ")", value: ")" },
  { label: "x", value: "x" }, { label: "π", value: "π" }, { label: "ε", value: "ε" },
  { label: "sin", value: "sin(" }, { label: "cos", value: "cos(" }, { label: "tan", value: "tan(" },
  { label: "ln", value: "ln(" }, { label: "log", value: "log(" }, { label: "√", value: "√(" },
  { label: "abs", value: "abs(" }, { label: "exp", value: "exp(" },
  { label: "+", value: "+" }, { label: "−", value: "-" }, { label: "×", value: "×" }, { label: "÷", value: "÷" },
  { label: "^", value: "^" },
];

export default function MathKeypad({ onInsert, onBackspace, onClear }) {
  return (
    <div className="bg-white rounded-lg shadow p-3 space-y-2">
      <div className="flex gap-2">
        <button type="button" onClick={onBackspace} className="px-2 py-1 rounded bg-gray-100">⌫</button>
        <button type="button" onClick={onClear} className="px-2 py-1 rounded bg-gray-100">Clear</button>
      </div>
      <div className="grid grid-cols-6 gap-2">
        {buttons.map((b) => (
          <button
            key={b.label}
            type="button"
            onClick={() => onInsert?.(b.value)}
            className="px-2 py-2 rounded bg-indigo-50 hover:bg-indigo-100 text-sm"
          >
            {b.label}
          </button>
        ))}
      </div>
      <div className="text-xs text-gray-500">
        Tips: <code>sen</code> → sin, <code>ln</code> → log, <code>|x|</code> → abs(x), <code>π</code>=pi, <code>ε</code>=1e-6
      </div>
    </div>
  );
}
