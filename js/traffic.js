window.drawNetwork = function () {
    const canvas = document.getElementById("network");
    if (!canvas) return;
  
    const ctx = canvas.getContext("2d");
  
    canvas.width = 600;
    canvas.height = 400;
  
    const nodes = {
        glasgow:   { x: 300, y: 300 },
        edinburgh: { x: 360, y: 310 },
        dundee:    { x: 400, y: 220 },
        inverness: { x: 360, y: 110 }
      };
  
    const edges = [
      { from: "glasgow", to: "edinburgh", traffic: 50 },
      { from: "dundee", to: "edinburgh", traffic: 90 },
      { from: "inverness", to: "dundee", traffic: 30 },
      { from: "glasgow", to: "dundee", traffic: 70 }
    ];
  
    function getThickness(traffic) {
      const min = 1;
      const max = 10;
      const normalized = Math.pow(traffic / 100, 1.5);
      return min + normalized * (max - min);
    }
  
    function getColor(traffic) {
      const t = traffic / 100;
      let r, g, b = 0;
  
      if (t < 0.5) {
        const ratio = t / 0.5;
        r = Math.floor(255 * ratio);
        g = 255;
      } else {
        const ratio = (t - 0.5) / 0.5;
        r = 255;
        g = Math.floor(255 * (1 - ratio));
      }
  
      return `rgb(${r}, ${g}, ${b})`;
    }
  
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      // Draw edges
      edges.forEach(edge => {
        const from = nodes[edge.from];
        const to = nodes[edge.to];
  
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
  
        ctx.lineWidth = getThickness(edge.traffic);
        ctx.strokeStyle = getColor(edge.traffic);
        ctx.lineCap = "round";
  
        ctx.globalAlpha = 0.85;
        ctx.stroke();
        ctx.globalAlpha = 1;
  
        const midX = (from.x + to.x) / 2;
        const midY = (from.y + to.y) / 2;
  
        ctx.fillStyle = "black";
        ctx.font = "10px Arial";
        ctx.fillText(edge.traffic, midX + 5, midY - 5);
      });
  
      // Draw nodes
      Object.entries(nodes).forEach(([id, pos]) => {
        const isTarget = id === "dundee";
  
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, isTarget ? 14 : 10, 0, Math.PI * 2);
  
        ctx.fillStyle = isTarget ? "red" : "black";
        ctx.fill();
  
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.stroke();
  
        ctx.fillStyle = "black";
        ctx.font = "12px Arial";
        ctx.fillText(id, pos.x + 12, pos.y + 4);
      });
    }
  
    draw();
  };