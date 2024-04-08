const mongoose = require('mongoose');

const comentarioSchema = new mongoose.Schema({
  texto: {
    type: String,
    required: true
  },
  fotoPerfil: {
    type: String, 
  },
  nota: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  usuario: {
    type: String,
    required: true
  },
});

const Comentario = mongoose.model('Comentario', comentarioSchema);

module.exports = Comentario;
