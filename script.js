const token = "e8e28909-6ba4-4f64-8ce4-e301adfd7a85";
const variable = "Distance";

async function actualizar() {
  try {
    const res = await fetch(`https://api.tago.io/data?variable=${variable}&qty=1`, {
      headers: { "Device-Token": token }
    });

    const data = await res.json();

    if(data.result && data.result.length > 0){
      let d = parseFloat(data.result[0].value);
      moverCarro(d);
    }

  } catch (e) {
    console.log("Error:", e);
  }
}

function moverCarro(distancia) {
  const carro = document.getElementById("carro");
  const texto = document.getElementById("txt-dist");
  const alerta = document.getElementById("alerta-choque");

  texto.innerText = distancia.toFixed(1) + " cm";

  if (distancia <= 2) {
    carro.style.left = "0%";
    texto.style.color = "#ff4d4d";
    alerta.style.display = "block";
  } else {
    let pos = (distancia / 50) * 90;
    if (pos > 90) pos = 90;

    carro.style.left = pos + "%";
    texto.style.color = "#00ff88";
    alerta.style.display = "none";
  }
}

setInterval(actualizar, 1000);
actualizar();
