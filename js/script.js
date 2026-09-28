const nivelBateria = document.getElementById('nivel-bateria');
const porcentagemAtual = document.getElementById('porcentagem-atual');
const tempoRestante = document.getElementById('tempo-restante');
const wifi = document.getElementById('wifi');
const redesSociais = document.getElementById('redes-sociais');
const jogo = document.getElementById('jogo');
const brilho = document.getElementById('brilho');

let bateriaAtual = 100;
let meuTimer = null;

const taxasConsumo = {
   base: 0.1,
   wifi: 0.3,
   redes: 0.5,
   jogo: 1.5,
   brilho: 0.8
};

function drenarBateria() {
   if (bateriaAtual <= 0) {
      bateriaAtual = 0;
      clearInterval(meuTimer);
      atualizarVisor(0);
      return;
   }

   let gastoDesseCiclo = taxasConsumo.base;
   if (wifi.checked) gastoDesseCiclo += taxasConsumo.wifi;
   if (redes.checked) gastoDesseCiclo += taxasConsumo.redes;
   if (jogo.checked) gastoDesseCiclo += taxasConsumo.jogo;

   let percentualBrilho = brilho.value / 100;
   gastoDesseCiclo += (taxasConsumo.brilho * percentualBrilho);
   
   bateriaAtual -= gastoDesseCiclo;

   atualizarVisor(gastoDesseCiclo);
}

function atualizarVisor(taxasDeGasto) {
   const bateriaExibida = Math.max(0, bateriaAtual);

   nivelBateria.style.width = Math.round(bateriaExibida) + '%';
   porcentagemAtual.innerText = Math.round(bateriaExibida) + '%';

   if (bateriaExibida <= 20) {
      nivelBateria.style.backgroundColor = '#E8504F';
   } else if (bateriaExibida <= 40) {
      nivelBateria.style.backgroundColor = '#F7751F';
   } else if (bateriaExibida <= 60) {
      nivelBateria.style.backgroundColor = '#FAA91C';
   } else if (bateriaExibida <= 80) {
      nivelBateria.style.backgroundColor = '#F2E217';
   } else {
      nivelBateria.style.backgroundColor = '#4caf50'
   }

   if (taxasDeGasto > 0 && bateriaExibida > 0) {
      const ciclosRestantes = Math.floor(bateriaExibida / taxasDeGasto);
      const minutos = Math.floor(ciclosRestantes / 60);
      const segundos = ciclosRestantes % 60;

      tempoRestante.innerText = `Tempo Restante: ${minutos}m ${segundos}s`;
   } else if (bateriaExibida === 0) {
      tempoRestante.innerText = 'Bateria Esgotada';
   }
}

meuTimer = setInterval(drenarBateria, 1000);
atualizarVisor(taxasConsumo.base);