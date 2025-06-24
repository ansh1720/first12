// src/components/SymptomChart.js
import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function SymptomChart({ disease }) {
  console.log("Received disease for chart:", disease);

  if (!disease || !disease.symptoms || disease.symptoms.length === 0) {
    return <p>No symptoms to display for this disease.</p>;
  }

  const symptomCounts = {};
  disease.symptoms.forEach(symptom => {
    const key = symptom.toLowerCase();
    symptomCounts[key] = (symptomCounts[key] || 0) + 1;
  });

  const labels = Object.keys(symptomCounts);
  const dataValues = Object.values(symptomCounts);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Symptom Distribution',
        data: dataValues,
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56',
          '#8E44AD', '#2ECC71', '#E67E22',
          '#1ABC9C', '#E74C3C', '#3498DB'
        ],
        borderColor: '#fff',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <div style={{ maxWidth: 500, margin: '30px auto' }}>
      <h3 style={{ textAlign: 'center' }}>🧬 Symptom Distribution</h3>
      <Pie data={chartData} options={options} />
    </div>
  );
}

export default SymptomChart;
