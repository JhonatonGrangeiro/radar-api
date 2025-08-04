const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 10000;

// Middleware para habilitar CORS
app.use(cors());

// Middleware de autenticação simples por token
app.use((req, res, next) => {
  const token = req.headers['authorization'];

  if (token === '#Oficinag3') {
    next();
  } else {
    res.status(401).json({ error: 'Token inválido ou ausente' });
  }
});

// Rota de status da API
app.get('/', (req, res) => {
  res.send('API Radar-Sport ativa!');
});

// Exemplo de rota: /jogos
app.get('/jogos', (req, res) => {
  res.json([
    { id: 1, timeA: 'Brasil', timeB: 'Argentina', horario: '20:00' },
    { id: 2, timeA: 'França', timeB: 'Inglaterra', horario: '18:00' }
  ]);
});

// Exemplo de rota: /mercados
app.get('/mercados', (req, res) => {
  res.json([
    { jogoId: 1, mercado: '1X2', odds: { A: 1.8, X: 3.2, B: 2.1 } },
    { jogoId: 2, mercado: 'Mais de 2.5', odds: { sim: 1.9, nao: 1.9 } }
  ]);
});

// Exemplo de rota: /odds
app.get('/odds', (req, res) => {
  res.json({
    bet365: { Brasil: 1.75, Argentina: 2.3 },
    betano: { Brasil: 1.80, Argentina: 2.1 }
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor Express iniciado na porta ${PORT}`);
});
