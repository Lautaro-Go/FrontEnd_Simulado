import React from "react";
import Plot from "react-plotly.js";

const PLOT_HEIGHT = 420; // altura fija para evitar solapamientos

const FunctionPlot = ({
  title = "Gráfico de funciones",
  functions = [],           // [{ name, color, xValues, yValues, mode? }]
  root = null,              // número o null
  puntos = [],              // [[x,y], ...]
  revision = 0,             // fuerza re-render de react-plotly
}) => {
  const data = [];

  // Series principales (curvas densas f/g)
  functions.forEach(({ name = "serie", color = "blue", xValues = [], yValues = [], mode = "lines" }) => {
    data.push({
      x: xValues,
      y: yValues,
      type: "scatter",
      mode,
      name,
      marker: { color },
      line: { shape: "linear" },
      hovertemplate: "<b>%{x}</b><br>%{y}<extra>" + name + "</extra>",
    });
  });

  // Puntos de iteración
  if (Array.isArray(puntos) && puntos.length > 0) {
    const px = puntos.map(([x]) => x);
    const py = puntos.map(([_, y]) => y);
    data.push({
      x: px,
      y: py,
      type: "scatter",
      mode: "markers+lines",
      name: "Iteraciones",
      marker: { size: 7 },
      hovertemplate: "x=%{x}<br>y=%{y}<extra>Iteración</extra>",
    });
  }

  // Línea y=0 para referencia (usa el rango de la primera serie si existe)
  const baseX = functions?.[0]?.xValues ?? [];
  if (baseX.length > 0) {
    const xMin = baseX[0];
    const xMax = baseX[baseX.length - 1];
    data.push({
      x: [xMin, xMax],
      y: [0, 0],
      type: "scatter",
      mode: "lines",
      line: { dash: "dot" },
      name: "y = 0",
      hoverinfo: "skip",
    });
  }

  // Punto en la raíz
  if (root !== null && isFinite(root)) {
    data.push({
      x: [root],
      y: [0],
      type: "scatter",
      mode: "markers",
      name: "Raíz",
      marker: { size: 10, symbol: "circle" },
      hovertemplate: "x=%{x}<br>y=0<extra>Raíz</extra>",
    });
  }

  return (
    <div className="w-full max-w-3xl mx-auto my-8">
      <h2 className="text-xl font-semibold text-center mb-4">{title}</h2>
      <Plot
        data={data}
        layout={{
          title,
          xaxis: { title: "x" },
          yaxis: { title: "y", zeroline: false },
          autosize: true,
          height: PLOT_HEIGHT, // altura fija
          margin: { l: 50, r: 20, t: 40, b: 40 },
        }}
        style={{ width: "100%", height: PLOT_HEIGHT }} // altura explícita
        useResizeHandler
        config={{ responsive: true, displayModeBar: true }}
        revision={revision} // clave para forzar re-render cuando cambien datos
      />
    </div>
  );
};

export default FunctionPlot;
