function drawBarChart(canvasId, data, labels, title) {
  //get canvas and drawing context
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext("2d");

  //clear previous drawings
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //chart layout settings
  const barWidth = 60;     
  const gap = 45;           
  const chartHeight = 200;  
  const offsetX = 60;       
  const offsetY = 250;      

  //colours for bars
  const colors = ["#F7464A", "#46BFBD", "#FDB45C", "#949FB1"];

  //find max value for scaling
  const maxValue = Math.max(...data);

  //set styles
  ctx.strokeStyle = "black";
  ctx.fillStyle = "black";
  ctx.font = "14px Arial";

  //draw axes
  ctx.beginPath();
  ctx.moveTo(offsetX, 40);   
  ctx.lineTo(offsetX, offsetY);
  ctx.lineTo(canvas.width - 20, offsetY); 
  ctx.stroke();

  //draw Y-axis ticks and labels
  for (let i = 0; i <= 5; i++) {
    const value = Math.round((maxValue / 5) * i);
    const y = offsetY - (i / 5) * chartHeight;

    ctx.fillText(value, 20, y + 4);

    ctx.beginPath();
    ctx.moveTo(offsetX - 5, y);
    ctx.lineTo(offsetX, y);
    ctx.stroke();
  }

  //draw bars
  data.forEach((value, i) => {
    const x = offsetX + i * (barWidth + gap);
    const height = (value / maxValue) * chartHeight;
    const y = offsetY - height;

    //bar colour
    ctx.fillStyle = colors[i];

    //draws bar
    ctx.fillRect(x, y, barWidth, height);

    //draw labels under bars
    ctx.fillStyle = "black";
    ctx.fillText(labels[i], x - 5, offsetY + 20);

    //show value above bar
    ctx.fillText(value, x + 18, y - 8);
  });

  //draw chart title
  ctx.fillStyle = "black";
  ctx.font = "bold 16px Arial";
  ctx.fillText(title, offsetX, 25);
}