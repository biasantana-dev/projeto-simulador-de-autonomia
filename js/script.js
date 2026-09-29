const nivelBateria = document.getElementById('nivel-bateria');
const porcentagemAtual = document.getElementById('porcentagem-atual');
const tempoRestante = document.getElementById('tempo-restante');
const wifi = document.getElementById('wifi');
const redesSociais = document.getElementById('redes-sociais');
const jogo = document.getElementById('jogo');
const brilho = document.getElementById('brilho');
const seletorDispositivo = document.getElementById('seletor-dispositivo');
const formCadastro = document.getElementById('form-cadastrar-dispositivo');
const infoLegenda = document.getElementById('info');
const btnReset = document.getElementById('btn-reset');

let bateriaAtual = 100;
let meuTimer = null;

const taxasConsumo = {
   base: 0.001389,
   wifi: 0.0003,
   redes: 0.0008,
   jogo: 0.0030,   
   brilho: 0.0015
};

//busca os aparelhos da API
async function carregarDispositivos() {
   try {
      const resposta = await fetch('https://projeto-simulador-de-autonomia.onrender.com/api/dispositivos');

      if (!resposta.ok) throw new Error('Falha ao conectar com o servidor');

      const dispositivos = await resposta.json();

      seletorDispositivo.innerHTML = '';

      dispositivos.forEach(dispositivo => {
         const option = document.createElement('option');
         option.value = dispositivo.id;
         option.textContent = `${dispositivo.nome} (${dispositivo.bateriamAh}mAh)`;

         // Guardamos o consumoBase e mAh em atributos data-* na própria tag <option>
         option.dataset.consumoBase = dispositivo.consumoBase;
         option.dataset.mah = dispositivo.bateriamAh;

         seletorDispositivo.appendChild(option);
      });

      atualizarDispositivoSelecionado();
   } catch (erro) {
      console.error("Erro na requisição GET:", erro);
      infoLegenda.innerText = "Erro ao carregar aparelhos do servidor.";
   }
}

function atualizarDispositivoSelecionado() {
   const opcaoSelecionada = seletorDispositivo.options[seletorDispositivo.selectedIndex];

   if (opcaoSelecionada) {
      taxasConsumo.base = Number(opcaoSelecionada.dataset.consumoBase);
      infoLegenda.innerHTML = `<i class="fa-solid fa-circle-info" style="color: rgb(255, 255, 255);"></i> Info: Calculado com base em ${opcaoSelecionada.dataset.mah}mAh`;

      recalcularInterface();
   }
}

if (formCadastro) {
   formCadastro.addEventListener('submit', async e => {
      e.preventDefault();

      const novoNome = document.getElementById('novo-nome').value;
      const novoMah = document.getElementById('novo-mah').value;
      const novasHoras = document.getElementById('novas-horas').value;

      try {
         const resposta = await fetch('https://projeto-simulador-de-autonomia.onrender.com/api/dispositivos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
               nome: novoNome,
               bateriamAh: Number(novoMah),
               horasEstimadas: Number(novasHoras)
            })
         });

         if (!resposta.ok) {
            const erroData = await resposta.json();
            alert(`Erro: ${erroData.erro}`);
            return;
         }

         formCadastro.requestFullscreen();
         await carregarDispositivos();
         alert('Aparelho cadastrado com sucesso!');
      } catch (erro) {
         console.error('Erro no POST:', erro);
         alert('Não foi possível conectar ao servidor.')
      }
   });
}

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
   salvarConfiguracoes();
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

function carregarConfiguracoes() {
   const dadosSalvos = localStorage.getItem('simuladorConfig');

   if (dadosSalvos) {
      const config = JSON.parse(dadosSalvos);

      wifi.checked = config.wifi;
      redesSociais.checked = config.redesSociais;
      jogo.checked = config.jogo;
      brilho.value = config.brilho;
   }
}

function resetarSimulacao() {
   bateriaAtual = 100;
   
   if (meuTimer) clearInterval(meuTimer);

   meuTimer = setInterval(drenarBateria, 1000);
   recalcularInterface();
}

// Evento de clique
if (btnReset) {
   btnReset.addEventListener('click', resetarSimulacao);
}

wifi.addEventListener('change', recalcularInterface);
redesSociais.addEventListener('change', recalcularInterface);
jogo.addEventListener('change', recalcularInterface);
brilho.addEventListener('input', recalcularInterface);
seletorDispositivo.addEventListener('change', atualizarDispositivoSelecionado);

carregarConfiguracoes();
carregarDispositivos();
meuTimer = setInterval(drenarBateria, 1000);