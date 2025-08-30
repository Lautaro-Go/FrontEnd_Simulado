// src/utils/exprMap.js
export function normalizeExpression(input, { epsilon = "1e-6" } = {}) {
  if (!input || typeof input !== "string") return input;

  let s = input.trim();

  // Espaciolatin y variantes en español
  s = s.replaceAll(/sen/gi, "sin");
  s = s.replaceAll(/tg/gi, "tan");     // opcional: "tg" -> "tan"
  s = s.replaceAll(/ctg/gi, "1/tan");  // opcional: "ctg" -> 1/tan

  // logaritmos
  s = s.replaceAll(/\bln\(/gi, "log(");     // ln -> log (base e)
  // si querés log base 10, habilita: s = s.replaceAll(/\blog10\(/gi, "log10(");

  // raíces y exponenciales
  s = s.replaceAll(/√\(/g, "sqrt(");
  s = s.replaceAll(/\bsqrt\(/gi, "sqrt(");
  s = s.replaceAll(/\bexp\(/gi, "exp(");

  // constantes
  s = s.replaceAll("π", "pi");
  s = s.replaceAll(/\bPI\b/g, "pi");
  s = s.replaceAll(/\bPi\b/g, "pi");
  s = s.replaceAll(/\bE\b/g, "e");     // mayúscula a minúscula
  s = s.replaceAll("ε", epsilon);
  s = s.replaceAll(/\bepsilon\b/gi, epsilon);

  // valor absoluto con barras -> abs()
  // |x+1| -> abs(x+1)
  s = s.replace(/\|([^|]+)\|/g, "abs($1)");

  // operadores visuales -> python
  s = s.replaceAll("×", "*");
  s = s.replaceAll("÷", "/");

  // potencia: dejamos '^' (el backend ya lo convierte a '**').
  // Si querés convertir en el front también, descomentá:
  // s = s.replaceAll("^", "**");

  // limpieza de espacios redundantes
  s = s.replace(/\s+/g, " ");

  return s;
}
