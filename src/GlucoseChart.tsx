import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart } from 'chart.js';
import 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import zoomPlugin from 'chartjs-plugin-zoom';
import { ChartOptions } from 'chart.js/auto';

Chart.register(zoomPlugin);

type GlucoseChartProps = {
  data: {
    timestamp: Date;
    historicGlucose: number | null;
    scanGlucose: number | null;
  }[];
};

const GlucoseChart: React.FC<GlucoseChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map(d => d.timestamp),
    datasets: [
      {
        label: 'Historic Glucose',
        data: data.map(d => d.historicGlucose),
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        showLine: false,
      },
      {
        label: 'Scan Glucose',
        data: data.map(d => d.scanGlucose),
        fill: false,
        backgroundColor: 'rgba(255,99,132,0.4)',
        borderColor: 'rgba(255,99,132,1)',
        showLine: false,
      }
    ]
  };

  const options: ChartOptions<"line"> = {
    scales: {
      x: {
        type: "time",
        time: {
          unit: "hour",
          displayFormats: {
            hour: "MMM dd yyyy hh:mm a",
          },
        },
        ticks: {
          maxRotation: 90, // Rotate the ticks to 90 degrees to display them vertically
          autoSkip: true,
          autoSkipPadding: 30, // Adjust the padding as needed
          padding: 0, // Adjust the padding to handle the distance from the grid lines
        },
      },
      y: {
        beginAtZero: true,
      },
    },
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
            speed: 0.01,
          },
          pinch: {
            enabled: true,
          },
          mode: "x", // Zoom on the x-axis
        },
        pan: {
          enabled: true, // Enable panning
          mode: "x", // Pan on the x-axis
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default React.memo(GlucoseChart);
