const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

//middlewares
app.use(cors());
app.use(express.json())

//banco de dados temporário em memória
let dispositivos = [
   { id: 1, nome: "Galaxy A56", bateriamAh: 5000, consumoBase: 0.1 },
   { id: 2, nome: "Notebook Lenovo IdeaPad", bateriamAh: 4500, consumoBase: 0.25 },
   { id: 3, nome: "Modelo Gamer Pro", bateriamAh: 6000, consumoBase: 0.4 }
];

//para retornar a lista de aparelhos para o front-end
app.get('/api/dispositivos', (req, res) => {
   res.json(dispositivos);
});

//para cadastrar um novo aparelho enviado pelo usúario
app.post('/api/dispositivos', (req, res) => {
   const { nome, bateriamAh, consumoBase } = req.body;

   if (!nome || !bateriamAh || !consumoBase) {
      return res.status(400).json({erro: 'Preench todos os campos!'});
   }

   const novoDispositivo = {
      id: dispositivos.length + 1,
      nome,
      bateriamAh: Number(bateriamAh),
      consumoBase: Number(consumoBase)
   };

   dispositivos.push(novoDispositivo);
   res.status(201).json(novoDispositivo);
});

//inicialização do servidor
app.listen(PORT, () => {
   console.log(`Servidor rodando em http://localhost:${PORT}`);
});