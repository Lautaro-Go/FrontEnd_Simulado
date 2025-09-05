import React, { useMemo, useState } from "react";
import IntegracionForm from "../components/integracion/IntegracionForm";
import FunctionPlot from "../components/FunctionPlot";
import IntegrationTable from "../components/integracion/IntegrationTable";

const toXY = (pairs) => {
  if (!Array.isArray(pairs)) return { x: [], y: [] };
  const x = [], y = [];
  for (const p of pairs) {
    if (Array.isArray(p) && p.length >= 2) {
      const [px, py] = p;
      if (typeof px === "number" && (typeof py === "number" || py === null)) {
        x.push(px);
        y.push(py);
      }
    }
  }
  return { x, y };
};

export default function IntegracionPage() {
  const [resultado, setResultado] = useState(null);

  const curva = useMemo(() => toXY(resultado?.curva_f ?? []), [resultado?.curva_f]);
  const functionsToPlot = useMemo(() => {
    if (curva.x.length === 0) return [];
    return [{ name: "f(x)", color: "blue", xValues: curva.x, yValues: curva.y, mode: "lines" }];
  }, [curva]);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-indigo-700 text-center mb-6">
        Integración Numérica · Métodos Newton–Cotes
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        <div className="md:col-span-4">
          <div className="sticky top-4">
            <IntegracionForm onResultado={setResultado} />
          </div>
        </div>

        <div className="md:col-span-8">
          {functionsToPlot.length > 0 ? (
            <FunctionPlot title="Visualización de f(x)" functions={functionsToPlot} />
          ) : (
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
              Completá los parámetros y presioná <b>Resolver</b> para ver el gráfico.
            </div>
          )}
        </div>

        <div className="md:col-span-12">
          {resultado && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 text-sm">
                <Info label="Método" value={resultado.metodo} />
                {"step_size" in resultado && resultado.step_size !== null && (
                  <Info label="h" value={resultado.step_size} />
                )}
                <Info label="Evaluaciones" value={resultado.function_evaluations} />
                {"error_estimate" in resultado && resultado.error_estimate !== null && (
                  <Info label="Estimación de error" value={resultado.error_estimate} />
                )}
              </div>

              <div className="text-center text-lg font-semibold text-indigo-700 mb-4">
                Resultado: {Number(resultado.value).toPrecision(12)}
              </div>

              <IntegrationTable points={resultado.points} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="border rounded p-3">
      <div className="text-gray-500">{label}</div>
      <div className="font-mono">
        {typeof value === "number" ? Number(value).toPrecision(8) : String(value)}
      </div>
    </div>
  );
}
