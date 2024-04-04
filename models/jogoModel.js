// jogoModel.js
const mongoose = require('mongoose');

const jogoSchema = new mongoose.Schema({
  nome: String,
  imagem: String,
  descricao: String,
  nota: Number,
});

const Jogo = mongoose.model('Jogo', jogoSchema);

module.exports = Jogo;
