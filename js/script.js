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

function calcularConsumoAtual() {
   let gasto = taxasConsumo.base;

   if (wifi.checked) gasto += taxasConsumo.wifi;
   if (redesSociais.checked) gasto += taxasConsumo.redes;
   if (jogo.checked) gasto += taxasConsumo.jogo;

   
   let percentualBrilho = brilho.value / 100;
   gasto += (taxasConsumo.brilho * percentualBrilho);

   return gasto;
}

function recalcularInterface() {
   const gastoAtual = calcularConsumoAtual();
   atualizarVisor(gastoAtual);
}

function drenarBateria() {
   if (bateriaAtual <= 0) {
      bateriaAtual = 0;
      clearInterval(meuTimer);
      atualizarVisor(0);
      return;
   }
   
   const gastoDesseCiclo = calcularConsumoAtual();
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

   tempoRestante.innerText = 'Tempo Restante: ' + calcularTempoRestante(bateriaExibida, taxasDeGasto);
}

function calcularTempoRestante(bateriaRestante, consumoPorSegundo) {
   if (consumoPorSegundo <= 0 || bateriaRestante <= 0) return 'Bateria esgotada';

   const segundosTotais = Math.floor(bateriaRestante / consumoPorSegundo);

   const horas = Math.floor(segundosTotais / 3600);
   const minutos = Math.floor((segundosTotais % 3600) / 60);
   const segundos = segundosTotais % 60; 

   const hStr = String(horas).padStart(2, '0');
   const mStr = String(minutos).padStart(2, '0');
   const sStr = String(segundos).padStart(2, '0');

   if (horas > 0) {
      return `${hStr}h ${mStr}m ${sStr}s`;
   }

   return `${mStr}m ${sStr}s`;
}

function salvarConfiguracoes() {
   const configuracoes = {
      wifi: wifi.checked,
      redesSociais: redesSociais.checked,
      jogo: jogo.checked,
      brilho: brilho.value
   };

   localStorage.setItem('simuladorConfig', JSON.stringify(configuracoes));
}

wifi.addEventListener('change', recalcularInterface);
redesSociais.addEventListener('change', recalcularInterface);
jogo.addEventListener('change', recalcularInterface);

brilho.addEventListener('input', recalcularInterface);

meuTimer = setInterval(drenarBateria, 1000);
atualizarVisor(taxasConsumo.base);