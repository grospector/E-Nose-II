export const chartBasicData = {
    labels: [],
    datasets: [
      // {
      //   label: 'Pressure',
      //   data: [],
      //   hidden: true,
      //   borderColor: '#e3342f',
      // },
      // {
      //   label: 'Temp',
      //   data: [],
      //   hidden: true,
      //   borderColor: '#f6993f',
      // },
      {
        label: 'Gas 1',
        data: [],
        fill: false,
        borderColor: 'rgba(255, 99, 132, 0.8)',
        tension: 0
      },
      {
        label: 'Gas 2',
        data: [],
        fill: false,
        borderColor: 'rgba(255, 159, 64, 0.8)',
        tension: 0
      },
      {
        label: 'Gas 3',
        data: [],
        fill: false,
        borderColor: 'rgba(255, 205, 86, 0.8)',
        tension: 0
      },
      {
        label: 'Gas 4',
        data: [],
        fill: false,
        borderColor: 'rgba(75, 192, 192, 0.8)',
        tension: 0
      },
      {
        label: 'Gas 5',
        data: [],
        fill: false,
        borderColor: 'rgba(54, 162, 235, 0.8)',
        tension: 0
      },
      {
        label: 'Gas 6',
        data: [],
        fill: false,
        borderColor: 'rgba(153, 102, 255, 0.8)',
        tension: 0
      },
      {
        label: 'Gas 7',
        data: [],
        fill: false,
        borderColor: 'rgba(201, 203, 207, 0.8)',
        tension: 0
      }
    ]
}


export const chartBasicOptions = {
    animation: {
        duration: 0
    },
    plugins: {
        legend: {
            labels: {
                color: '#495057'
            }
        }
    },
    scales: {
      x: {
          ticks: {
              color: '#495057'
          },
          grid: {
              color: '#cdcdcd'
          }
      },
      y: {
          ticks: {
              color: '#495057',
          },
          grid: {
              drawOnChartArea: true,
              color: '#cdcdcd'
          },
          //beginAtZero: true,
          //min:0
          //max: 100,
        }
    },
    interaction: {
      mode: 'index',
      intersect: false,
      callbacks: {
        label: function(tooltipItem:any) {
          //console.log("tooltipItem",tooltipItem);
          var label = tooltipItem.dataset.label || '';
          if (label) {
              label += ': ';
          }
          label += tooltipItem.formattedValue;
          return label;
      }

      }
    },
    clip: {left: false, top: false, right: 1000, bottom: false},
    pointRadius: 1,
    // pointBorderWidth:5,
    // pointHoverBorderWidth:10
}

var delayBetweenPoints = 10;
var started:any = {};

export const chartResultBasicData = {
  
  labels: [],
  datasets: [
    // {
    //   label: 'Pressure',
    //   data: [],
    //   hidden: true,
    //   borderColor: '#e3342f',
    // },
    // {
    //   label: 'Temp',
    //   data: [],
    //   hidden: true,
    //   borderColor: '#f6993f',
    // },
    {
      label: 'Gas 1',
      data: [],
      fill: false,
      borderColor: 'rgba(255, 99, 132, 0.8)',
      tension: 0
    },
    {
      label: 'Gas 2',
      data: [],
      fill: false,
      borderColor: 'rgba(255, 159, 64, 0.8)',
      tension: 0
    },
    {
      label: 'Gas 3',
      data: [],
      fill: false,
      borderColor: 'rgba(255, 205, 86, 0.8)',
      tension: 0
    },
    {
      label: 'Gas 4',
      data: [],
      fill: false,
      borderColor: 'rgba(75, 192, 192, 0.8)',
      tension: 0
    },
    {
      label: 'Gas 5',
      data: [],
      fill: false,
      borderColor: 'rgba(54, 162, 235, 0.8)',
      tension: 0
    },
    {
      label: 'Gas 6',
      data: [],
      fill: false,
      borderColor: 'rgba(153, 102, 255, 0.8)',
      tension: 0
    },
    {
      label: 'Gas 7',
      data: [],
      fill: false,
      borderColor: 'rgba(201, 203, 207, 0.8)',
      tension: 0
    }
  ]
}


export const chartResultBasicOptions = {
  animation: {
    duration: 0
  },
  transitions:{

  },
  plugins: {
      legend: {
          labels: {
              color: '#495057'
          }
      }
  },
  scales: {
    x: {
        ticks: {
            color: '#495057'
        },
        grid: {
            color: '#cdcdcd',
            display: false
        },
        beginAtZero: true,
    },
    y: {
        ticks: {
            color: '#495057',
        },
        grid: {
            drawOnChartArea: true,
            color: '#cdcdcd'
        },
        min: -3000,
        max: 3000,
        //beginAtZero: true,
      }
  },
  interaction: {
    mode: 'index',
    intersect: false,
    callbacks: {
      label: function(tooltipItem:any) {
        //console.log("tooltipItem",tooltipItem);
        var label = tooltipItem.dataset.label || '';
        if (label) {
            label += ': ';
        }
        label += tooltipItem.formattedValue;
        return label;
    }

    }
  },
  clip: {left: false, top: false, right: 1000, bottom: false},
  pointRadius: 1,
  // pointBorderWidth:5,
  // pointHoverBorderWidth:10
}