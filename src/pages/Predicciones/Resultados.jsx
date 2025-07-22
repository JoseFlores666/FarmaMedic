import { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const Resultados = () => {
  // Estado para clasificación
  const [accuracy, setAccuracy] = useState(null);
  const [confMatrix, setConfMatrix] = useState([]);

  // Estado para reglas de asociación
  const [rules, setRules] = useState([]);

  // Obtener métricas de clasificación https://pm3flask.onrender.com  http://127.0.0.1:5001
  useEffect(() => {
    axios.get('https://pm3flask.onrender.com/metrics')
      .then(res => {
        setAccuracy(res.data.accuracy);
        setConfMatrix(res.data.confusion_matrix);
      })
      .catch(err => console.error('Error al cargar métricas:', err));
  }, []);

  // Obtener reglas de asociación
  useEffect(() => {
    axios.get('https://pm3flask.onrender.com/rules')
      .then(res => setRules(res.data))
      .catch(err => console.error('Error al cargar reglas:', err));
  }, []);

  const chartData = {
    labels: ['Negativo', 'Positivo'],
    datasets: confMatrix.length ? [
      {
        label: 'Verdaderos',
        backgroundColor: 'rgba(75,192,192,0.6)',
        data: confMatrix[0],
      },
      {
        label: 'Falsos',
        backgroundColor: 'rgba(255,99,132,0.6)',
        data: confMatrix[1],
      }
    ] : [],
  };

  return (
    <div className="container">
      {/* Resultados clasificación */}
      <h2 className="mb-3">Resultados del Modelo</h2>
      {accuracy !== null && <p><strong>Accuracy:</strong> {(accuracy * 100).toFixed(2)}%</p>}
      {confMatrix.length > 0 ? (
        <>
          <h5>Matriz de Confusión</h5>
          <Bar data={chartData} />
        </>
      ) : (
        <p>Cargando datos...</p>
      )}

      {/* Reglas de asociación */}
      <hr />
      <h2 className="mb-3 mt-4">Reglas de Asociación</h2>
      {rules.length > 0 ? (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Antecedentes</th>
              <th>Consecuentes</th>
              <th>Soporte</th>
              <th>Confianza</th>
              <th>Lift</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((rule, i) => (
              <tr key={i}>
                <td>{rule.antecedents}</td>
                <td>{rule.consequents}</td>
                <td>{rule.support.toFixed(3)}</td>
                <td>{rule.confidence.toFixed(3)}</td>
                <td>{rule.lift.toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Cargando reglas...</p>
      )}
    </div>
  );
};

export default Resultados;
