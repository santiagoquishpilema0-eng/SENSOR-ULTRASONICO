const token = "e8e28909-6ba4-4f64-8ce4-e301adfd7a85";
const variable = "Distance";

let historial = [];

// 🔊 sonido
const beep = new Audio("https://www.soundjay.com/button/beep-07.wav");


// 📊 gráfica
const ctx = document.getElementById("grafica").getContext("2d");

const chart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [],
    datasets: [{
      label: "Distancia (cm)",
      data: [],
      borderColor: "lime",
      tension: 0.3
    }]
  }
});


async function actualizar() {
  try {
    const res = await fetch(`https://api.tago.io/data?variable=${variable}&qty=1`, {
      headers: { "Device-Token": token }
    });

    const data = await res.json();

    if (!data.result || data.result.length === 0) return;

    let d = parseFloat(data.result[0].value);
    if (isNaN(d)) return;

    moverCarro(d);
    actualizarGrafica(d);

  } catch (e) {
    console.log(e);
  }
}


function moverCarro(distancia) {
  const carro = document.getElementById("carro");
  const texto = document.getElementById("txt-dist");
  const alerta = document.getElementById("alerta-choque");

  texto.innerText = distancia.toFixed(1) + " cm";

  if (distancia <= 5) {
    carro.style.left = "0%";
    texto.style.color = "red";
    alerta.style.display = "block";

    beep.play(); // 🔊 sonido
  } else {
    let pos = (distancia / 50) * 90;
    if (pos > 90) pos = 90;

    carro.style.left = pos + "%";
    texto.style.color = "#00ff88";
    alerta.style.display = "none";
  }
}


function actualizarGrafica(valor) {
  const tiempo = new Date().toLocaleTimeString();

  chart.data.labels.push(tiempo);
  chart.data.datasets[0].data.push(valor);

  if (chart.data.labels.length > 10) {
    chart.data.labels.shift();
    chart.data.datasets[0].data.shift();
  }

  chart.update();
}


// 🔄 tiempo real
setInterval(actualizar, 1000);
actualizar();
