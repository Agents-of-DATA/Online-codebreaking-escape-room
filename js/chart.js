function drawBarChart(canvasId, data, label) {
  // get the canvas element by id and its 2d drawing context 
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext("2d");
  // chart layout settings 
  // width of each bar
  const barWidth = 60;
  // gap between each bar
  const gap = 40;
  // max height of chart in pixels
  const chartHeight = 200;
  // margin for x and y axis 
  const offsetX = 60;
  const offsetY = 250;
  // bar colours 
  const colors = ["#F7464A", "#46BFBD", "#FDB45C", "#949FB1"];
  // find max value in data to scale bars
  const maxValue = Math.max(...data);

  // store bar positions for hover
  const bars = [];
  // function for drawing the chart including hover effects
  function draw(mouseX = null, mouseY = null) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw axes
    ctx.beginPath();
    // start of y-axis
    ctx.moveTo(offsetX, 50);
    // y-axis line
    ctx.lineTo(offsetX, offsetY);
    // x-axis line
    ctx.lineTo(canvas.width - 20, offsetY);
    ctx.stroke();

    //  draw y-axis labels and ticks
    // text colour
    ctx.fillStyle = "black";
    // font for scale labels 
    ctx.font = "10px Arial";

    // 5 ticks for y-axis 
    for (let i = 0; i <= 5; i++) {
      // tick label
      const value = Math.round((maxValue / 5) * i);
      // position on canvas
      const y = offsetY - (i / 5) * chartHeight;
      // draw tick label
      ctx.fillText(value, 20, y + 3);
      // draw small tick line
      ctx.beginPath();
      ctx.moveTo(offsetX - 5, y);
      ctx.lineTo(offsetX, y);
      ctx.stroke();
    }

    bars.length = 0;

    // bars
    data.forEach((value, i) => {
      const x = offsetX + i * (barWidth + gap);
      const height = (value / maxValue) * chartHeight;
      const y = offsetY - height;

      ctx.fillStyle = colors[i];
      ctx.fillRect(x, y, barWidth, height);

      // label
      ctx.fillStyle = "black";
      ctx.fillText(cities[i], x, offsetY + 15);

      // save bar for hover
      bars.push({ x, y, width: barWidth, height, value, label: cities[i] });
    });

    // title
    ctx.fillText(label, offsetX, 30);

    // hover tooltip
    if (mouseX !== null && mouseY !== null) {
      bars.forEach(bar => {
        if (
          mouseX >= bar.x &&
          mouseX <= bar.x + bar.width &&
          mouseY >= bar.y &&
          mouseY <= bar.y + bar.height
        ) {
          // tooltip box
          ctx.fillStyle = "black";
          ctx.fillRect(mouseX + 10, mouseY - 25, 80, 20);

          ctx.fillStyle = "white";
          ctx.fillText(`${bar.label}: ${bar.value}`, mouseX + 15, mouseY - 10);
        }
      });
    }
  }

  // initial draw
  draw();

  // click event
  canvas.onclick = function (e) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    draw(mouseX, mouseY);
  };

  // clear tooltip when leaving
  canvas.onmouseleave = function () {
    draw();
  };
}