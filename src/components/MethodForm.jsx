import React, { useRef, useState } from 'react';
import { resolverMetodoNumerico } from '../services/apiService';
import MathKeypad from './MathKeypad';
import { normalizeExpression } from '../utils/exprMap';

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

  // Último input enfocado (para insertar desde el keypad)
  const lastFocus = useRef('fx');
  const refs = {
    fx: useRef(null),
    gx: useRef(null),
    dfx: useRef(null),
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFocus = (name) => () => {
    lastFocus.current = name;
  };

  // Inserta token en el input actualmente enfocado
  const insertAtCursor = (name, token) => {
    const el = refs[name]?.current;
    if (!el) return;
    const start = el.selectionStart ?? el.value.length;
    const end = el.selectionEnd ?? el.value.length;
    const newVal = el.value.slice(0, start) + token + el.value.slice(end);
    setFormData((prev) => ({ ...prev, [name]: newVal }));
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
      setFormData((p) => ({ ...p, [name]: newVal }));
      setTimeout(() => {
        el.focus();
        const pos = start - 1;
        el.setSelectionRange(pos, pos);
      }, 0);
      return;
    }
    const newVal = el.value.slice(0, start) + el.value.slice(end);
    setFormData((p) => ({ ...p, [name]: newVal }));
  };
  const handleClear = () => {
    const name = lastFocus.current;
    setFormData((p) => ({ ...p, [name]: '' }));
    refs[name]?.current?.focus();
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
    onResultado?.(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      // Normalizar solo antes de enviar (no tocamos lo que ve el usuario)
      const payload = {
        ...formData,
        fx:  normalizeExpression(formData.fx),
        gx:  normalizeExpression(formData.gx),
        dfx: normalizeExpression(formData.dfx),
        x0:  parseFloat(formData.x0),
        tol: parseFloat(formData.tol),
        max_iter: parseInt(formData.max_iter, 10),
      };
      const resultado = await resolverMetodoNumerico(payload);
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
              ref={refs.fx}
              onFocus={handleFocus('fx')}
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
              ref={refs.gx}
              onFocus={handleFocus('gx')}
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
              ref={refs.dfx}
              onFocus={handleFocus('dfx')}
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

        {/* --- Calculadora/Teclado debajo, sin romper el layout --- */}
        <MathKeypad
          onInsert={handleInsert}
          onBackspace={handleBackspace}
          onClear={handleClear}
        />

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
