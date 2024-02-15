import React, { useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js';
import 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import zoomPlugin from 'chartjs-plugin-zoom';
import { ChartOptions } from 'chart.js/auto';

ChartJS.register(zoomPlugin);

type GlucoseChartProps = {
  data: {
    timestamp: Date;
    historicGlucose: number | null;
    scanGlucose: number | null;
  }[];
};

const GlucoseChart: React.FC<GlucoseChartProps> = ({ data }) => {

    const chartRef = useRef<any>(null);

    useEffect(() => {
      if (chartRef.current) {
        console.log(chartRef.current);
        console.log(data);
        if (data.length > 0) {
          const latestTimestamp = data[data.length - 4]?.timestamp;
          console.log(latestTimestamp)
          const oneDayAgo = new Date(
            latestTimestamp.getTime() - 24 * 60 * 60 * 1000
          );
          console.log(oneDayAgo)

          // Apply zoom using type assertion
          chartRef.current.zoomScale("x", {
            min: oneDayAgo,
            max: latestTimestamp,
          });
        }
      }
    }, [data]);

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
          mode: 'x',
          drag: {
            enabled: true,
          },
        },
        pan: {
          enabled: false,
          mode: "x",
        },
      },
    },
  };

  return (
      <Line ref={chartRef} data={chartData} options={options} />
  );

};

export default React.memo(GlucoseChart);
