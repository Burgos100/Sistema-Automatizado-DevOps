// tests/app.test.js
const { calcularPromedioPonderado } = require('../src/app');

describe('Calculadora de Promedio Ponderado', () => {
  test('Debe calcular el promedio correctamente con porcentajes válidos', () => {
    const notas = [5.0, 6.0, 4.0];
    const ponderaciones = [30, 30, 40];

    // (5.0 * 0.3) + (6.0 * 0.3) + (4.0 * 0.4) = 1.5 + 1.8 + 1.6 = 4.90
    const resultado = calcularPromedioPonderado(notas, ponderaciones);

    expect(resultado).toBe('4.90');
  });

  test('Debe arrojar un error si los arreglos tienen distinto tamaño', () => {
    const notas = [5.0, 6.0];
    const ponderaciones = [30, 30, 40];

    expect(() => calcularPromedioPonderado(notas, ponderaciones)).toThrow(
      'Las notas y ponderaciones deben ser arreglos del mismo tamaño'
    );
  });
});
