import { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
} from 'react-bootstrap';

Chart.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement
);

// Opciones para gráfica de barras en porcentaje
const barOptionsPercent = {
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: ctx => `${ctx.dataset.label || ''}: ${ctx.parsed.y.toFixed(2)}%`
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      ticks: {
        callback: value => `${value}%`,
        stepSize: 10,
      }
    }
  }
};

// Opciones para gráfica de barras con totales
const barOptionsTotal = {
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: ctx => `${ctx.dataset.label || ''}: ${ctx.parsed.y}`
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: { stepSize: 1 }
    }
  }
};

const Resultados = () => {
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);
  const [datosHeatmap, setDatosHeatmap] = useState(null);
  const [predicciones, setPredicciones] = useState([]);

  const labelMap = {
    '0': 'No Asiste',
    '1': 'Asiste',
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reporteRes, heatmapRes, prediccionesRes] = await Promise.all([
          axios.get('https://pm3flask.onrender.com/reporte_clasificacion'),
          axios.get('https://pm3flask.onrender.com/datos_heatmap'),
          axios.get('https://pm3flask.onrender.com/predecir'),
        ]);
        setReport(reporteRes.data);
        setDatosHeatmap(heatmapRes.data);
        setPredicciones(prediccionesRes.data);
      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading || !report || !datosHeatmap) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Cargando datos...</p>
      </Container>
    );
  }

  // Pie chart - Distribución real
  const clases = Object.keys(report).filter(key => !['accuracy', 'macro avg', 'weighted avg'].includes(key));
  const etiquetas = clases.map(clase => labelMap[clase] || clase);
  const supports = clases.map(clase => report[clase]['support']);
  const total = supports.reduce((a, b) => a + b, 0);
  const porcentaje = supports.map(s => ((s / total) * 100).toFixed(2));
  const dataPie = {
    labels: etiquetas.map((et, i) => `${et} (${porcentaje[i]}%)`),
    datasets: [{
      data: supports,
      backgroundColor: ['#FF6384', '#36A2EB'],
      hoverOffset: 8,
    }],
  };

  // Datos agrupados por predicción
  const clusterCounts = predicciones.reduce((acc, p) => {
    acc[p.cluster] = (acc[p.cluster] || 0) + 1;
    return acc;
  }, {});
  const riesgoCounts = predicciones.reduce((acc, p) => {
    acc[p.riesgo] = (acc[p.riesgo] || 0) + 1;
    return acc;
  }, {});

  const clustersLabels = Object.keys(clusterCounts).sort();
  const riesgosLabels = Object.keys(riesgoCounts);

  // Cálculo porcentajes para clusters (para la gráfica de porcentaje)
  const totalClusters = Object.values(clusterCounts).reduce((a, b) => a + b, 0);
  const clusterPercentages = clustersLabels.map(cl => (clusterCounts[cl] / totalClusters) * 100);

  // Datos para gráfica clusters en porcentaje
  const dataClustersPredPercent = {
    labels: clustersLabels,
    datasets: [{
      label: 'Pacientes por Cluster (%)',
      data: clusterPercentages,
      backgroundColor: 'rgba(75,192,192,0.6)',
    }],
  };

  // Datos para gráfica riesgos en totales
  const dataRiesgosPred = {
    labels: riesgosLabels,
    datasets: [{
      label: 'Pacientes por Riesgo',
      data: riesgosLabels.map(r => riesgoCounts[r]),
      backgroundColor: 'rgba(255, 159, 64, 0.6)',
    }],
  };

  return (
    <Container className="mb-5">
      <h2 className="text-center mb-4">Análisis de Asistencia Real</h2>

      {/* Distribución real */}
      <Row className="justify-content-center mb-4">
        <Col md={6}>
          <Card>
            <Card.Header className="bg-success text-dark fw-bold">Distribución de Asistencia Real</Card.Header>
            <Card.Body style={{ height: '300px' }}>
              <Pie
                data={dataPie}
                options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <h2 className="text-center mb-4">Análisis de Clustering y Riesgo de Pacientes</h2>

      <Row className="mt-4">
        <Col md={6}>
          <Card>
            <Card.Header className="bg-info text-dark fw-bold">
              Pacientes por Cluster (Predicción)
              <br />
              <small className="fw-bold" style={{ fontWeight: 'normal', fontSize: '0.85rem' }}>
                (Cluster 0: Medio, 1: Alto, 2: Bajo)
              </small>
            </Card.Header>
            <Card.Body style={{ height: '300px' }}>
              <Bar data={dataClustersPredPercent} options={barOptionsPercent} />
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Header className="bg-warning text-dark fw-bold">
              Pacientes por Nivel de Riesgo
            </Card.Header>
            <Card.Body style={{ height: '300px' }}>
              <Bar data={dataRiesgosPred} options={barOptionsTotal} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Resultados;
