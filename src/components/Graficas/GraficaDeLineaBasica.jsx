import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Datos simulados
const beneficios = [0, 56, 20, 36, 80, 40, 30, -20, 25, 30, 12, 60];
const otraLinea = [20, 25, 60, 65, 45, 10, 0, 25, 35, 7, 20, 25];
const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

// Dataset
const midata = {
  labels: meses,
  datasets: [
    {
      label: 'Beneficios',
      data: beneficios,
      tension: 0.4,
      fill: true,
      borderColor: '#4bc0c0',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      pointRadius: 4,
      pointHoverRadius: 6,
      pointBackgroundColor: '#4bc0c0',
      pointBorderColor: '#fff',
    },
    {
      label: 'Comparativo',
      data: otraLinea,
      tension: 0.4,
      borderColor: '#ffcd56',
      backgroundColor: 'rgba(255, 205, 86, 0.1)',
      fill: true,
      pointRadius: 3,
      pointHoverRadius: 5,
      pointBackgroundColor: '#ffcd56',
      pointBorderColor: '#fff',
    }
  ]
};

// Opciones del gráfico
const misoptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        color: '#333',
        font: {
          size: 14,
        }
      }
    },
    title: {
      display: true,
      text: 'Beneficios por Mes',
      color: '#333',
      font: {
        size: 20
      },
      padding: {
        top: 10,
        bottom: 30
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        color: '#555',
        font: {
          size: 12
        }
      },
      grid: {
        color: '#eee'
      }
    },
    x: {
      ticks: {
        color: '#555',
        font: {
          size: 12
        }
      },
      grid: {
        color: '#f7f7f7'
      }
    }
  }
};

// Componente
export default function LinesChart() {
  return (
    <div style={{ height: "400px", padding: "20px" }}>
      <Line data={midata} options={misoptions} />
    </div>
  );
}
