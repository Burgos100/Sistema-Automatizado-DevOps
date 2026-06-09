// src/app.js
const express = require('express');
const app = express();

app.use(express.json());

// Lógica principal
function calcularPromedioPonderado(notas, ponderaciones) {
  if (!notas || !ponderaciones || notas.length !== ponderaciones.length) {
    throw new Error(
      'Las notas y ponderaciones deben ser arreglos del mismo tamaño'
    );
  }

  let sumaPonderada = 0;
  let sumaPonderaciones = 0;

  for (let i = 0; i < notas.length; i++) {
    // Se asume que la ponderación viene en porcentaje (ej: 30 para 30%)
    sumaPonderada += notas[i] * (ponderaciones[i] / 100);
    sumaPonderaciones += ponderaciones[i] / 100;
  }

  if (sumaPonderaciones === 0)
    throw new Error('La suma de ponderaciones no puede ser cero');

  return (sumaPonderada / sumaPonderaciones).toFixed(2);
}

// Endpoint de la API
app.post('/calcular', (req, res) => {
  try {
    const { notas, ponderaciones } = req.body;
    const resultado = calcularPromedioPonderado(notas, ponderaciones);
    res.status(200).json({
      status: 'success',
      promedio: parseFloat(resultado),
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
});

module.exports = { app, calcularPromedioPonderado };
