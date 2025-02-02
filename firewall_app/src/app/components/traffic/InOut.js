"use client"
import {
  Chart,
  LinearScale,
  CategoryScale, 
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend, 
  Colors
} from "chart.js";
import { Line } from 'react-chartjs-2'


function InOut() {
  // Register necessary components
  Chart.register(LinearScale, CategoryScale, PointElement, LineElement, Title, Tooltip, Legend, Colors);

  const data = {
    labels : [1, 2, 3, 4, 5, 6, 7],
    datasets : [{
      label : "Incoming",
      data : [12, 1, 10, 3, 4, 5],
      borderWith: 1
    }, 
    {
      label : "Outgoing",
      data : [1, 12, 16, 13, 8, 4],
      borderWith: 6
    }
  ]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
      title : {
        display : true,
        text : "Traffic Overview"
      }
    },
    scales: {
      x: {
        type: "category",
        ticks: {
          color: "white", // Color of x-axis tick labels
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)", // Color of x-axis grid lines
        },
        title: {
          display: true,
          text: "Time(Minutes)",
          color: "white", // Color of the x-axis title
          font: {
            size: 16,
          },
        }
      },
      y: {
        type: "linear",
        ticks: {
          color: "white", // Color of y-axis tick labels
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)", // Color of y-axis grid lines
        },
        title: {
          display: true,
          text: "Traffic Volume",
          color: "white", // Color of the y-axis title
          font: {
            size: 16,
          },
        }
      }
    }
  };
  
  return (
    <Line
      options={options}
      data={data}
      />
  )
}

export default InOut