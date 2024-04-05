const mongoose = require('mongoose');
const comentarioSchema = require('./comentarioModel');


const jogoSchema = new mongoose.Schema({
  nome: String,
  imagem:String,
  carrossel: [String], // Vetor de várias imagens
  descricao: String,
  nota: Number,
 
});

const Jogo = mongoose.model('Jogo', jogoSchema);
module.exports = Jogo;
