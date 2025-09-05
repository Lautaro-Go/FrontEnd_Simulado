import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-center text-indigo-700 mb-2">
        Simulador de Cálculo Numérico
      </h1>
      <p className="text-center text-gray-600 mb-10">
        Elegí un módulo para comenzar
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Link
          to="/raices"
          className="block bg-white rounded-xl shadow p-6 hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold text-indigo-600 mb-2">Cálculo de Raíces</h2>
          <p className="text-gray-600 text-sm">
            Newton–Raphson, Punto Fijo y Aceleración de Aitken. Graficá f(x), seguí las iteraciones y observá la convergencia.
          </p>
        </Link>

        <Link
          to="/integracion"
          className="block bg-white rounded-xl shadow p-6 hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold text-indigo-600 mb-2">Integración Numérica</h2>
          <p className="text-gray-600 text-sm">
            Rectángulo (Grado 0), Trapezoidal (Grado 1), Simpson 1/3 (Grado 2), Simpson 3/8 (Grado 3), Boole (Grado 4) y Adaptativo (Simpson).
          </p>
        </Link>
      </div>
    </div>
  );
}
