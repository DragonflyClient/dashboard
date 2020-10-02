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

const playTimeYear = [1];

fetch("https://dashboard.playdragonfly.net/statistics/ot/total")
  .then(res => res.json())
  .then(data => {
    console.log(data)
  })


// Area Chart Example
const ctx = document.getElementById("myAreaChart");
const myLineChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: getPreviousMonths(12),
    datasets: [
      {
        label: "Playtime",
        lineTension: 0.1,
        backgroundColor: "rgba(78, 115, 223, 0.05)",
        borderColor: "rgba(78, 115, 223, 1)",
        pointRadius: 3,
        pointBackgroundColor: "rgba(78, 115, 223, 1)",
        pointBorderColor: "rgba(78, 115, 223, 1)",
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
        pointHoverBorderColor: "rgba(78, 115, 223, 1)",
        pointHitRadius: 15,
        pointBorderWidth: 1,
        data: playTimeYear,
      },
    ],
  },
  options: {

    animation: {
      tension: {
        easing: 'easeInOutCubic',
        duration: 500 // general animation time
      }
    },
    hover: {
      animationDuration: 200 // duration of animations when hovering an item
    },
    responsiveAnimationDuration: 00, // animation duration after a resize
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 10,
        right: 25,
        top: 25,
        bottom: 10,
      },
    },
    scales: {
      xAxes: [
        {
          type: 'time',
          time: {
            unit: 'month',
            tooltipFormat: 'MMM YYYY'
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          ticks: {
            maxTicksLimit: 12,
            beginAtZero: false,
          },
        },
      ],
      yAxes: [
        {
          ticks: {
            maxTicksLimit: 10,
            padding: 10,
            // Include a dollar sign in the ticks
            callback: function (value, index, values) {
              return value + "h";
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
      display: false,
    },
    tooltips: {
      backgroundColor: "rgb(255,255,255)",
      bodyFontColor: "#858796",
      titleMarginBottom: 10,
      titleFontColor: "#6E707E",
      titleFontSize: 14,
      borderColor: "#DDDFEB",
      borderWidth: 1,
      xPadding: 15,
      yPadding: 15,
      displayColors: false,
      intersect: false,
      mode: "index",
      caretPadding: 10,
      callbacks: {
        label: function (tooltipItem, chart) {
          const datasetLabel =
            chart.datasets[tooltipItem.datasetIndex].label || "";
          return datasetLabel + ": " + tooltipItem.yLabel + "h";
        },
      },
    },
  },
});

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
    console.log(chart.data.datasets[0].data)
    console.log(monthly)
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
