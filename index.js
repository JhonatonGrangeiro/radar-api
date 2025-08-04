'use strict';

const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

// ===== Configuração do Express =====
const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// Middleware de autenticação apenas para rotas protegidas
const authMiddleware = (req, res, next) => {
  const token = req.headers['x-api-key'];
  if (!token || token !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Não autorizado' });
  }
  next();
};

// ===== Classe sportApi =====
const apiAxios = axios.create({
  baseURL: 'https://stats.fn.sportradar.com',
  Headers: {
    'accept-ranges': 'bytes',
    'cache-control': 'public, max-age=2592000, immutable',
    'content-encoding': 'gzip',
    'content-type': 'application/json; charset=UTF-8',
    'x-powered-by': 'Express'
  }
});

class sportApi {
  constructor(bettingHouse) {
    this.bettingHouse = bettingHouse;
  }

  async modalData(sportId, method) {
    const resp = await apiAxios.get(`${this.bettingHouse}/en/Europe:Berlin/gismo/config_tree_mini/41/0/${sportId}`);
    if (method === 'all') return resp.data;
    if (method === 'categories') return resp.data.doc[0].data[0];
  }

  async liague(ligueId) {
    const resp = await apiAxios.get(`${this.bettingHouse}/en/America:Argentina:Buenos_Aires/gismo/stats_season_meta/${ligueId}`);
    return resp.data;
  }

  async seasonGoals(leagueId) {
    const resp = await apiAxios.get(`${this.bettingHouse}/en/America:Argentina:Buenos_Aires/gismo/stats_season_goals/${leagueId}/main`);
    return resp.data;
  }
}

// ===== Instância =====
const api = new sportApi('https://s5.sir.sportradar.com');

// ===== Rotas públicas =====
app.get('/jogos', async (req, res) => {
  try {
    const sportId = req.query.id || '1234';
    const data = await api.modalData(sportId, 'all');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/mercados', async (req, res) => {
  try {
    const ligueId = req.query.id || '5678';
    const data = await api.liague(ligueId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/odds', async (req, res) => {
  try {
    const leagueId = req.query.id || '9012';
    const data = await api.seasonGoals(leagueId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== Rota protegida de exemplo =====
app.get('/status', authMiddleware, (req, res) => {
  res.json({ status: 'API protegida online 🚀' });
});

// ===== Status geral =====
app.get('/', (req, res) => {
  res.json({ status: 'API online 🚀' });
});

// ===== Start =====
app.listen(PORT, () => {
  console.log(`Servidor Express iniciado na porta ${PORT}`);
});
