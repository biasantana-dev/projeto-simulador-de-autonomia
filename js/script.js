const nivelBateria = document.getElementById('nivel-bateria');
const porcentagemAtual = document.getElementById('porcentagem-atual');
const tempoRestante = document.getElementById('tempo-restante');
const wifi = document.getElementById('wifi');
const jogo = document.getElementById('jogo');
const brilho = document.getElementById('brilho');

const consumo = {
   consumoWifi: 15,
   consumoJogo: 55,
   consumoBrilho: 20
};

function calcularBateria() {
   let bateriaAtual = 100;

   if (wifi.checked) {
      bateriaAtual -= consumo.consumoWifi;
   }
   if (jogo.checked) {
      bateriaAtual -= consumo.consumoJogo;
   }

   let percentualBrilho = brilho.value / 100;
   bateriaAtual -= (consumo.consumoBrilho * percentualBrilho);

   const tempoMaximoMinutos = 750;
   const minutosRestanteTotais = (bateriaAtual / 100) * tempoMaximoMinutos;
   const horas = Math.floor(minutosRestanteTotais / 60);
   const minutos = Math.floor(minutosRestanteTotais % 60);

   nivelBateria.style.width = Math.round(bateriaAtual) + '%';
   porcentagemAtual.innerText = Math.round(bateriaAtual) + '%';

   tempoRestante.innerText = `Tempo Restante: ${horas}h ${minutos}m`;

   if (bateriaAtual <= 20) {
      nivelBateria.style.backgroundColor = "#f44336";
   } else if (bateriaAtual <= 50) {
      nivelBateria.style.backgroundColor = "#ffc107";
   } else {
      nivelBateria.style.backgroundColor = "#4caf50";
   }
}

wifi.addEventListener('change', calcularBateria);
jogo.addEventListener('change', calcularBateria);
brilho.addEventListener('input', calcularBateria);

calcularBateria(); 