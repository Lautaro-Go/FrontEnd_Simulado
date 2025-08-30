export function getExpressionFromMethod({ metodo, fx, gx }) {
  switch (metodo) {
    case 'newton':
      return fx;
    case 'punto_fijo':
    case 'aitken':
      return gx;
    default:
      return 'x'; // fallback
  }
}