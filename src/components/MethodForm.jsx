import React, { useState } from 'react';
import { resolverMetodoNumerico } from '../services/apiService';

const MethodForm = ({ onResultado }) => {
  const [formData, setFormData] = useState({
    metodo: 'newton',
    fx: 'x^2 - 2',
    gx: '',
    dfx: '',
    x0: '20.92',
    tol: '1e-8',
    max_iter: '5',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.fx) return 'f(x) es requerido';
    if ((formData.metodo === 'punto_fijo' || formData.metodo === 'aitken') && !formData.gx)
      return 'g(x) es requerido para métodos de punto fijo';
    if (isNaN(parseFloat(formData.x0))) return 'x₀ debe ser un número';
    if (isNaN(parseFloat(formData.tol))) return 'Tolerancia debe ser numérica';
    if (isNaN(parseInt(formData.max_iter))) return 'Iteraciones debe ser un entero';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    onResultado?.(null) // limpia el resultado

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      const resultado = await resolverMetodoNumerico(formData);
      onResultado(resultado);
    } catch (err) {
      setError('Error al resolver el método. Verificá los datos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center text-indigo-600">Configuración del Método</h2>

      <div className="grid grid-cols-1 gap-4">
        <select
          name="metodo"
          value={formData.metodo}
          onChange={handleChange}
          className="border rounded p-2"
        >
          <option value="newton">Newton</option>
          <option value="punto_fijo">Punto Fijo</option>
          <option value="aitken">Aitken</option>
        </select>

        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="fx" className="w-32 font-medium text-gray-700">f(x):</label>
            <input
              type="text"
              name="fx"
              id="fx"
              value={formData.fx}
              onChange={handleChange}
              placeholder="Ej: x^2 - 2"
              className="flex-1 border rounded p-2"
            />
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="gx" className="w-32 font-medium text-gray-700">g(x):</label>
            <input
              type="text"
              name="gx"
              id="gx"
              value={formData.gx}
              onChange={handleChange}
              placeholder="Ej: (x^2 + 2)/3"
              className="flex-1 border rounded p-2"
            />
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="dfx" className="w-32 font-medium text-gray-700">f'(x) (opcional):</label>
            <input
              type="text"
              name="dfx"
              id="dfx"
              value={formData.dfx}
              onChange={handleChange}
              placeholder="Ej: 2*x"
              className="flex-1 border rounded p-2"
            />
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="x0" className="w-32 font-medium text-gray-700">x₀ (Inicial):</label>
            <input
              type="text"
              name="x0"
              id="x0"
              value={formData.x0}
              onChange={handleChange}
              placeholder="Ej: 1.5"
              className="flex-1 border rounded p-2"
            />
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="tol" className="w-32 font-medium text-gray-700">Tolerancia:</label>
            <input
              type="text"
              name="tol"
              id="tol"
              value={formData.tol}
              onChange={handleChange}
              placeholder="Ej: 1e-8"
              className="flex-1 border rounded p-2"
            />
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="max_iter" className="w-32 font-medium text-gray-700">Iteraciones máx:</label>
            <input
              type="text"
              name="max_iter"
              id="max_iter"
              value={formData.max_iter}
              onChange={handleChange}
              placeholder="Ej: 50"
              className="flex-1 border rounded p-2"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded transition"
        >
          {loading ? 'Resolviendo...' : 'Resolver'}
        </button>

        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </div>
    </form>
  );
};

export default MethodForm;