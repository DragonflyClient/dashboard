// Set new default font family and font color to mimic Bootstrap's default styling
(Chart.defaults.global.defaultFontFamily = "Nunito"),
  '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = "#858796";

function number_format(number, decimals, dec_point, thousands_sep) {
  // *     example: number_format(1234.56, 2, ',', ' ');
  // *     return: '1 234,56'
  number = (number + "").replace(",", "").replace(" ", "");
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = typeof thousands_sep === "undefined" ? "," : thousands_sep,
    dec = typeof dec_point === "undefined" ? "." : dec_point,
    s = "",
    toFixedFix = function (n, prec) {
      var k = Math.pow(10, prec);
      return "" + Math.round(n * k) / k;
    };
  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec) : "" + Math.round(n)).split(".");
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || "").length < prec) {
    s[1] = s[1] || "";
    s[1] += new Array(prec - s[1].length + 1).join("0");
  }
  return s.join(dec);
}

const ctx = document.getElementById("myAreaChart");
let playTimeYear = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var myLineChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: getPreviousMonths(12),
    datasets: [{
      label: "Playtime",
      lineTension: 0.3,
      backgroundColor: "rgba(78, 115, 223, 0.05)",
      borderColor: "rgba(78, 115, 223, 1)",
      pointRadius: 3,
      pointBackgroundColor: "rgba(78, 115, 223, 1)",
      pointBorderColor: "rgba(78, 115, 223, 1)",
      pointHoverRadius: 3,
      pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
      pointHoverBorderColor: "rgba(78, 115, 223, 1)",
      pointHitRadius: 10,
      pointBorderWidth: 2,
      data: playTimeYear,
    }],
  },
  options: {
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 10,
        right: 25,
        top: 25,
        bottom: 0
      }
    },
    scales: {
      xAxes: [{
        time: {
          unit: 'date',
          tooltipFormat: 'MMM YYYY'
        },
        gridLines: {
          display: false,
          drawBorder: false
        },
        ticks: {
          maxTicksLimit: 7
        }
      }],
      yAxes: [
        {
          ticks: {
            maxTicksLimit: 10,
            padding: 10,
            // Include a dollar sign in the ticks
            callback: function (value, index, values) {
              return formatHours(value)
            },
          },
          gridLines: {
            circular: true,
            color: "rgb(234, 236, 244)",
            zeroLineColor: "rgb(234, 236, 244)",
            drawBorder: false,
            borderDash: [2],
            drawTicks: true,
            zeroLineBorderDash: [2],
          },
        },
      ],
    },
    legend: {
      display: false
    },
    tooltips: {
      backgroundColor: "rgb(255,255,255)",
      bodyFontColor: "#858796",
      titleMarginBottom: 10,
      titleFontColor: '#6e707e',
      titleFontSize: 14,
      borderColor: '#dddfeb',
      borderWidth: 1,
      xPadding: 15,
      yPadding: 15,
      displayColors: false,
      intersect: false,
      mode: 'index',
      caretPadding: 10,
      callbacks: {
        label: function (tooltipItem, chart) {
          const datasetLabel =
            chart.datasets[tooltipItem.datasetIndex].label || "";
          return datasetLabel + ": " + formatHours(tooltipItem.yLabel);
        },
      },
    }
  }
});
window.addEventListener('load', () => {
  loadData()
})
async function loadData() {
  const result = await fetch("https://dashboard.playdragonfly.net/statistics/ot/month/all")
  const json = await result.json()
  playTimeYear = json.playTimeYear
  console.log(json, "DONE")

  myLineChart.data.datasets[0].data = playTimeYear
  myLineChart.update()
}

function formatHours(value) {
  const raw = value * 60
  const hours = Math.trunc(raw / 60);
  const minutes = raw % 60
  return hours > 0 && minutes > 0 ? `${hours}h ${minutes}m` : hours > 0 ? `${hours}h` : `${minutes}m`;
}

function getPreviousMonths(length) {
  var months = [];
  const thisMonth = new Date().getMonth();
  months = Array.apply(0, Array(length + 1)).map(function (_, i) {
    return moment()
      .month(i - (length - thisMonth)).format('MMM YYYY')
  });

  return months;
}

function addData(chart, length, current) {
  if (length == 12) {
    chart.data.datasets[0].data = playTimeYear
  } else {
    chart.options.animation.duration = 500
    const monthly = playTimeYear.slice(Math.max(playTimeYear.length - 7, 1))
    chart.data.datasets[0].data = monthly
  }
  chart.data.labels = 0;
  chart.data.labels = getPreviousMonths(length);
  chart.update();
}

function updateScales(chart) {
  var xScale = chart.scales["x-axis-0"];
  var yScale = chart.scales["y-axis-0"];
  chart.options.scales = {
    xAxes: [
      {
        id: "newId",
        display: true,
      },
    ],
    yAxes: [
      {
        display: true,
        type: "logarithmic",
      },
    ],
  };
  chart.update();
  // need to update the reference
  xScale = chart.scales["newId"];
  yScale = chart.scales["y-axis-0"];
}
