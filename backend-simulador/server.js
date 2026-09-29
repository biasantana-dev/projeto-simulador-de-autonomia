const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

const ARQUIVO_DADOS = path.join(__dirname, 'dispositivos.json');

//middlewares
app.use(cors());
app.use(express.json());

function lerDispositivos() {
   if(!fs.existsSync(ARQUIVO_DADOS)) {
      fs.writeFileSync(ARQUIVO_DADOS, '[]', 'utf-8');
      return [];
   }

   const conteudo = fs.readFileSync(ARQUIVO_DADOS, 'utf-8');
   return JSON.parse(conteudo);
}

function salvarDispositivos(lista) {
   fs.writeFileSync(ARQUIVO_DADOS, JSON.stringify(lista, null, 2));
}

//rotas da api
app.get('/api/dispositivos', (req, res) => {
   try {
      const dispositivos = lerDispositivos();
      res.json(dispositivos);
   } catch (erro) {
      res.status(500).json({ erro: "Erro ao ler o arquivo de dados do servidor." });
   }
});

//para cadastrar um novo aparelho enviado pelo usúario
app.post('/api/dispositivos', (req, res) => {
   const { nome, bateriamAh, horasEstimadas } = req.body;

   if (!nome || !bateriamAh || !horasEstimadas || Number(horasEstimadas) <= 0) {
      return res.status(400).json({erro: 'Preench todos os campos!'});
   }

   const segundosTotais = Number(horasEstimadas) * 3600;
   const consumoBaseCalculado = 100 / segundosTotais;

   try {
      const dispositivos = lerDispositivos();

      const proximoId = dispositivos.length > 0 ? Math.max(...dispositivos.map(d => d.id)) + 1 : 1;

      const novoDispositivo = {
         id: proximoId,
         nome: nome.trim(),
         bateriamAh: Number(bateriamAh),
         consumoBase: Number(consumoBaseCalculado.toFixed(6))
      };

      dispositivos.push(novoDispositivo);
      salvarDispositivos(dispositivos);

      //retorna objeto criado com status 201
      res.status(201).json(novoDispositivo);
   } catch (erro) {
      res.status(500).json({ erro: "Erro ao salvar o novo aparelho no arquivo." });
   }
});

//inicialização do servidor
app.listen(PORT, () => {
   console.log(`Servidor rodando em http://localhost:${PORT}`);
});