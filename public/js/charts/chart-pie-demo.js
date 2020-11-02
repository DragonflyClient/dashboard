// // Set new default font family and font color to mimic Bootstrap's default styling
// Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
// Chart.defaults.global.defaultFontColor = '#858796';

// const servers = [
//   {
//     ip: 'play.pflaumenkuchen.de',
//     playtime: '6'
//   },
//   {
//     ip: 'citybuild.gommehd.net',
//     playtime: '4'
//   },
//   {
//     ip: 'mc.hypixel.net',
//     playtime: '6'
//   }
// ]


// const serverIP = [], serverPlaytime = []
// for (var key in servers) {
//   if (servers.hasOwnProperty(key)) {
//     serverIP.push(servers[key].ip)
//     serverPlaytime.push(servers[key].playtime)
//   }
// }

// document.getElementById('server-pie').innerHTML = `<div class="mt-4 text-center small">
//                       <span class="mr-2">
//                         <i class="fas fa-circle text-primary"></i>
//                         ${serverIP[0]}
//                       </span>
//                       <span class="mr-2">
//                         <i class="fas fa-circle text-success"></i> ${serverIP[1]}
//                       </span>
//                       <span class="mr-2">
//                         <i class="fas fa-circle text-info"></i> ${serverIP[2]}
//                       </span>`

// // Pie Chart Example
// const pieContainer = document.getElementById("myPieChart");
// const myPieChart = new Chart(pieContainer, {
//   type: 'doughnut',
//   data: {
//     labels: serverIP,
//     datasets: [{
//       data: serverPlaytime,
//       backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc'],
//       hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf'],
//       hoverBorderColor: "rgba(234, 236, 244, 1)"
//     }]
//   },
//   options: {
//     maintainAspectRatio: false,
//     tooltips: {
//       backgroundColor: "rgb(255,255,255)",
//       bodyFontColor: "#858796",
//       borderColor: '#dddfeb',
//       borderWidth: 1,
//       xPadding: 15,
//       yPadding: 15,
//       displayColors: false,
//       caretPadding: 10,
//       callbacks: {
//         label: function (tooltipItem, chart) {
//           const datasetLabel =
//             "Playtime";
//           return chart.labels[tooltipItem.index] + ": " + chart.datasets[0].data[tooltipItem.index] + "h";
//         },
//       },
//     },
//     legend: {
//       display: false
//     },
//     cutoutPercentage: 75
//   }
// });
