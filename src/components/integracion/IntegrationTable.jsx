// src/components/IntegrationTable.jsx
const fmt = (v, digits = 8) => {
  if (typeof v !== "number") return "";
  if (!isFinite(v)) return "∞";
  return Number(v).toPrecision(digits);
};

export default function IntegrationTable({ points }) {
  if (!Array.isArray(points) || points.length === 0) return null;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300 bg-white shadow-sm">
        <thead className="bg-gray-100">
          <tr>
            <Th>#</Th>
            <Th>xᵢ</Th>
            <Th>f(xᵢ)</Th>
            <Th>coef</Th>
            <Th>contrib</Th>
          </tr>
        </thead>
        <tbody>
          {points.map((p, i) => (
            <tr key={i} className="text-center">
              <Td>{p.index}</Td>
              <Td>{fmt(p.x)}</Td>
              <Td>{fmt(p.fx)}</Td>
              <Td>{fmt(p.coefficient, 6)}</Td>
              <Td>{fmt(p.contribution)}</Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const Th = ({ children }) => <th className="px-3 py-2 border">{children}</th>;
const Td = ({ children }) => <td className="px-3 py-2 border">{children}</td>;
