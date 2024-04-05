// server.js
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const controllerRoutes = require('./controllers/userController'); 
require('dotenv').config();

const app = express();
const port = 3000;



app.set('view engine', 'ejs'); // Defina o engine de templates como EJS
app.set('views', path.join(__dirname, 'views')); // Defina o diretório de views

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'views')));

app.use('/', controllerRoutes);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Conectado ao MongoDB Atlas'))
.catch(err => console.error('Erro ao conectar ao MongoDB Atlas:', err));

app.use(session({
  secret: 'segredo', // Uma chave secreta para assinar os cookies de sessão
  resave: false,
  saveUninitialized: true
}));

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
