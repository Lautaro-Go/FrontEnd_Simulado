import React, { useState } from "react";
import MethodForm from "./MethodForm";
import FunctionPlot from "./FunctionPlot";
import IteracionesTable from "./IteracionesTable";

const pairListToXY = (pairs) => {
  if (!Array.isArray(pairs)) {
    return { x: [], y: [] };
  }
  const x = [], y = [];
  for (const p of pairs) {
    if (!Array.isArray(p) || p.length < 2) continue;
    const [px, py] = p;
    if (typeof px === "number" && (typeof py === "number" || py === null)) {
      x.push(px);
      y.push(py);
    }
  }
  return { x, y };
};

const CalculoRaices = () => {
  const [resultado, setResultado] = useState(null);
  const [plotRevision, setPlotRevision] = useState(0);

  const handleResultado = (res) => {
    setResultado(res);
    setPlotRevision((n) => n + 1);
  };

  const raiz = resultado?.convergio ? resultado?.resultado ?? null : null;

  const { x: fx, y: fy } = pairListToXY(resultado?.curva_f ?? []);
  const { x: gx, y: gy } = pairListToXY(resultado?.curva_g ?? []);
  const { x: ix, y: iy } = pairListToXY(resultado?.iter_points ?? []);
  const puntos = ix.map((x, i) => [x, iy[i]]);

  const functionsToPlot = [];
  if (fx.length > 0) {
    functionsToPlot.push({ name: "f(x)", color: "blue", xValues: fx, yValues: fy, mode: "lines" });
  }
  if (gx.length > 0) {
    functionsToPlot.push({ name: "g(x)", color: "green", xValues: gx, yValues: gy, mode: "lines" });
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Grid principal:
          - En mobile: 1 columna (form arriba, gráfico debajo, tabla al final).
          - En >= md: 12 columnas -> form (col-span-4) | gráfico (col-span-8) en la misma fila.
          - Tabla abajo ocupando las 12 columnas. */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Columna izquierda: form */}
        <div className="md:col-span-4">
          <div className="sticky top-4"> {/* queda fijo al hacer scroll en pantallas altas */}
            <MethodForm onResultado={handleResultado} />
          </div>
        </div>

        {/* Columna derecha: gráfico */}
        <div className="md:col-span-8">
          {functionsToPlot.length > 0 ? (
            <FunctionPlot
              title="Gráfico de funciones"
              functions={functionsToPlot}
              root={raiz}
              puntos={puntos}
              revision={plotRevision}
            />
          ) : (
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
              Ingresá datos y presioná <b>Resolver</b> para ver el gráfico.
            </div>
          )}
        </div>

        {/* Fila inferior: tabla a lo ancho */}
        <div className="md:col-span-12">
          {resultado ? (
            <>
              <IteracionesTable metodo={resultado.metodo} iteraciones={resultado.iteraciones} />
              <div className="text-center text-lg font-medium text-indigo-700 mt-4">
                {resultado.convergio
                  ? `Resultado: ${Number(resultado.resultado).toPrecision(16)}`
                  : "No convergió"}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default CalculoRaices;
