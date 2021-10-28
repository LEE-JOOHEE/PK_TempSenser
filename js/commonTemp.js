function getEmissivityData() {
    $.ajax({
      type: "GET",
      url: "http://localhost:8080/api/emissivity",
      // emissivity ---> {"id":53,"value":0.44,"regDate":"2021-10-22T00:10:09.318+00:00"}
      success: function (data) {
        // alert(JSON.stringify(data.value));
        $("#nowEmissivity").text(data.value);
      },
      error: function (data) {
        console.log('전송실패!');
      },
    });
  }
  
  var globalTempData;
  function getTemperatureData(){
    $.ajax({
      type: "GET",
      url: "http://localhost:8080/api/temperature",
      success: function (data) {
        globalTempData = data
        // alert(JSON.stringify(data));
        $(".temp").text(globalTempData);
      },
      error: function (data) {
        console.log('전송실패!');
      },
    });
  }
  
  var newValue;
  $("#changeEmissivity").on("change keyup paste click", function(){
    newValue = $(this).val();
    console.log(newValue);
  });
  function sendData(){
    $("#changeEmissivity").trigger("click");
    if(newValue == '' || newValue == null){
      alert("변경값을 입력하세요.");
      return false;
    }else {
      // alert('적용하시겠습니까?');
      if (confirm("변경값을 적용하시겠습니까?") == true){
        $.ajax({
          url: 'http://localhost:8080/api/emissivity',
          type: 'POST',
          data: {"emissivity": newValue},
          success: function (data) {
            document.getElementById('changeEmissivity').value = null;
            getEmissivityData();
          },
          error: function (data) {
            console.log('전송실패!');
          },
        });
      }else {
        return false;
      }
    }
  }
  
  function getGraphData(){
    $.ajax({
      url: 'http://localhost:8080/api/graph',
      type: 'GET',
      success: function (response) {
        console.log("그래프데이터 : " + JSON.stringify(response));
  
        var chartLablesDate = [];
        var chartLablesTime = [];
        var chartTempData = [];
        $.each(response, function(key, value){
          var strRegDate = value.regDate.substr(0,10);
          var strRegTime = value.regDate.substr(11,8);
          chartLablesDate.push(strRegDate);
          chartLablesTime.push(strRegTime);
          chartTempData.push(value.temp);
        });
        // console.log(chartLablesDate);
        var set = new Set(chartLablesDate);
        var uniqueArr = [...set];
        // console.log(uniqueArr);
        // console.log(chartLablesTime);
        // console.log(chartTempData);
        var maxTemp = Math.max.apply(Math, chartTempData) + 100;
        var minTemp = Math.min.apply(Math,chartTempData) - 100;
  
        $("#line-chart-gradient").remove();
        $("div.chart").append('<canvas id="line-chart-gradient" class="chart-canvas" height="300px"></canvas>');
        /* 시간대별 온도 그래프 */
        var ctx2 = document.getElementById("line-chart-gradient").getContext("2d");
        var gradientStroke1 = ctx2.createLinearGradient(0, 230, 0, 50);
        gradientStroke1.addColorStop(1, 'rgba(203,12,159,0.2)');
        gradientStroke1.addColorStop(0.2, 'rgba(72,72,176,0.0)');
        gradientStroke1.addColorStop(0, 'rgba(203,12,159,0)'); //purple colors
  
        var myChart = new Chart(ctx2, {
          type: "line",
          data: {
            labels: chartLablesTime,
            datasets: [{
              label: "온도값",
              tension: 0.4,
              borderWidth: 0,
              pointRadius: 0,
              borderColor: "#cb0c9f",
              borderWidth: 3,
              backgroundColor: gradientStroke1,
              fill: true,
              data: chartTempData,
              maxBarThickness: 6
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: "날짜 : " + uniqueArr,
                align: 'end',
                font: {size: 18}
              },
              legend: {
                display: false,
              }
            },
            interaction: {
              intersect: false,
              mode: 'index',
            },
            scales: {
              y: {
                grid: {
                  drawBorder: false,
                  display: true,
                  drawOnChartArea: true,
                  drawTicks: false,
                  borderDash: [5, 5]
                },
                ticks: {
                  display: true,
                  padding: 10,
                  color: '#344767',
                  font: {
                    size: 14,
                    family: "Open Sans",
                    style: 'normal',
                    lineHeight: 2
                  }
                },
                min:  minTemp,
                max: maxTemp
              },
              x: {
                grid: {
                  drawBorder: false,
                  display: false,
                  drawOnChartArea: false,
                  drawTicks: false,
                  borderDash: [5, 5]
                },
                ticks: {
                  display: true,
                  color: '#344767',
                  padding: 10,
                  font: {
                    size: 14,
                    family: "Open Sans",
                    style: 'normal',
                    lineHeight: 2
                  },
                }
              },
            },
          },
        });
  
      },
      error: function (response) {
        console.log('전송실패!');
      },
    });
  }
  