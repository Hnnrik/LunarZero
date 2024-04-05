const mongoose = require('mongoose');
const Comentario = require('./comentarioModel'); // Importe o modelo de Comentário

const jogoSchema = new mongoose.Schema({
  nome: String,
  imagem: String,
  carrossel: [String], // Vetor de várias imagens
  descricao: String,
  nota: Number,
  comentarios: [Comentario.schema] // Vetor de comentários usando o esquema de Comentário
});

const Jogo = mongoose.model('Jogo', jogoSchema);
module.exports = Jogo;
