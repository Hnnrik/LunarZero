const mongoose = require('mongoose');

// Definição do schema para usuários
const usuarioSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  nomeDeUsuario: {
    type: String,
    required: true,
    unique: true
  },
  senha: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true 
  },
  dataNascimento: {
    type: Date,
    required:true
  }
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;
