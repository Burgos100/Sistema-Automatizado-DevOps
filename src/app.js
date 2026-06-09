// src/app.js
const express = require('express');
const app = express();

app.use(express.json());

// Interfaz Web para el navegador
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <title>Calculadora DevOps</title>
        <style>
            body { font-family: Arial, sans-serif; padding: 20px; max-width: 500px; margin: auto; }
            input { width: 100%; padding: 10px; margin: 10px 0; box-sizing: border-box; }
            button { padding: 10px 20px; background-color: #002D62; color: white; border: none; cursor: pointer; width: 100%; font-size: 16px;}
            button:hover { background-color: #004080; }
            .result { margin-top: 20px; font-weight: bold; font-size: 1.2em; text-align: center; }
        </style>
    </head>
    <body>
        <h2>Calculadora de Promedio Ponderado</h2>
        <p>Ingresa las notas y ponderaciones separadas por comas.</p>
        
        <label>Notas (ej: 5.0, 6.0, 4.0):</label>
        <input type="text" id="notas" placeholder="5.0, 6.0, 4.0">
        
        <label>Ponderaciones en % (ej: 30, 30, 40):</label>
        <input type="text" id="ponderaciones" placeholder="30, 30, 40">
        
        <button onclick="calcular()">Calcular Promedio</button>
        
        <div class="result" id="resultado"></div>

        <script>
            function calcular() {
                const notasInput = document.getElementById('notas').value;
                const ponderacionesInput = document.getElementById('ponderaciones').value;

                if (!notasInput || !ponderacionesInput) {
                    document.getElementById('resultado').innerText = 'Error: Llena ambos campos';
                    document.getElementById('resultado').style.color = 'red';
                    return;
                }

                const notas = notasInput.split(',').map(n => parseFloat(n.trim()));
                const ponderaciones = ponderacionesInput.split(',').map(p => parseFloat(p.trim()));

                fetch('/calcular', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ notas, ponderaciones })
                })
                .then(res => res.json())
                .then(data => {
                    if(data.status === 'success') {
                        document.getElementById('resultado').innerText = 'Promedio Final: ' + data.promedio;
                        document.getElementById('resultado').style.color = 'green';
                    } else {
                        document.getElementById('resultado').innerText = 'Error: ' + data.message;
                        document.getElementById('resultado').style.color = 'red';
                    }
                })
                .catch(err => {
                    document.getElementById('resultado').innerText = 'Error de conexión con la API';
                    document.getElementById('resultado').style.color = 'red';
                });
            }
        </script>
    </body>
    </html>
  `);
});

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
