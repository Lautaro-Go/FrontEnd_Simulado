// src/components/IteracionesTable.jsx
const fmt = (v, digits = 6) => {
  if (typeof v !== "number") return "";
  if (!isFinite(v)) return "∞";
  return v.toPrecision(digits);
};

const IteracionesTable = ({ metodo, iteraciones }) => {
  if (!Array.isArray(iteraciones) || iteraciones.length === 0) return null;

  // ===== NEWTON =====
  if (metodo === "newton") {
    const headers = ["n", "xₙ", "err_abs", "err_rel"]; // muestra |f(xₙ)| y f'(xₙ)
    return (
      <div className="overflow-x-auto my-6">
        <table className="min-w-full border border-gray-300 bg-white shadow-sm">
          <thead className="bg-gray-100">
            <tr>{headers.map((h) => <th key={h} className="px-4 py-2 border">{h}</th>)}</tr>
          </thead>
          <tbody>
            {iteraciones.map((it, i) => {
              const abs_fx = typeof it.fx === "number" ? Math.abs(it.fx) : it.fx;
              return (
                <tr key={i} className="text-center">
                  <td className="px-4 py-2 border">{it.n}</td>
                  <td className="px-4 py-2 border">{fmt(it.x)}</td>
                  <td className="px-4 py-2 border">{fmt(abs_fx)}</td>
                  <td className="px-4 py-2 border">{fmt(it.dfx)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  // ===== AITKEN =====
  if (metodo === "aitken") {
    const headers = ["n", "xₙ", "xₙ₊₁", "xₙ₊₂", "x* (acel.)", "err_abs", "err_rel"];
    return (
      <div className="overflow-x-auto my-6">
        <table className="min-w-full border border-gray-300 bg-white shadow-sm">
          <thead className="bg-gray-100">
            <tr>{headers.map((h) => <th key={h} className="px-4 py-2 border">{h}</th>)}</tr>
          </thead>
          <tbody>
            {iteraciones.map((it, i) => (
              <tr key={i} className="text-center">
                <td className="px-4 py-2 border">{it.n}</td>
                <td className="px-4 py-2 border">{fmt(it.x)}</td>
                <td className="px-4 py-2 border">{fmt(it.x1)}</td>
                <td className="px-4 py-2 border">{fmt(it.x2)}</td>
                <td className="px-4 py-2 border">{fmt(it.x_acc)}</td>
                <td className="px-4 py-2 border">{fmt(it.err_abs)}</td>
                <td className="px-4 py-2 border">{fmt(it.err_rel)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // ===== PUNTO FIJO =====
  // Encabezados iguales a la GUI, pero contenido mapeado así:
  //  - err_abs  => x_{n+1}
  //  - err_rel  => |x_{n+1} - x_n|
  const headers = ["n", "xₙ", "err_abs", "err_rel"];
  return (
    <div className="overflow-x-auto my-6">
      <table className="min-w-full border border-gray-300 bg-white shadow-sm">
        <thead className="bg-gray-100">
          <tr>{headers.map((h) => <th key={h} className="px-4 py-2 border">{h}</th>)}</tr>
        </thead>
        <tbody>
          {iteraciones.map((it, i) => {
            const next = it.x_next;          // x_{n+1}
            const absErr = it.err_abs;       // |x_{n+1} - x_n|
            return (
              <tr key={i} className="text-center">
                <td className="px-4 py-2 border">{it.n}</td>
                <td className="px-4 py-2 border">{fmt(it.x)}</td>
                <td className="px-4 py-2 border">{fmt(next)}</td>     {/* err_abs muestra x_{n+1} */}
                <td className="px-4 py-2 border">{fmt(absErr)}</td>   {/* err_rel muestra |x_{n+1}-x_n| */}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default IteracionesTable;
