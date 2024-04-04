// userController.js
const express = require('express');
const router = express.Router();
const path = require('path');
const Jogo = require('../models/jogoModel');
const Usuario = require('../models/usuarioModel');


router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'home.html')); 
});

router.get('/biblioteca', (req, res) => {
  res.sendFile(path.join(__dirname, '..','views', 'biblioteca.html'));
});

router.get('/cadastro-jogo', (req, res) => {
  res.sendFile(path.join(__dirname,'..', 'views', 'cadastro-jogo.html'));
});

router.get('/criador', (req, res) => {
  res.sendFile(path.join(__dirname, '..','views', 'criador.html'));
});

router.get('/jogos', (req, res) => {
  res.sendFile(path.join(__dirname, '..','views', 'jogos.html'));
});

router.get('/sobre', (req, res) => {
  res.sendFile(path.join(__dirname, '..','views', 'sobre.html'));
});

router.get('/tela-jogo', (req, res) => {
  res.sendFile(path.join(__dirname, '..','views', 'tela-jogo.html'));
});
router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '..','views','login.html'));
});
router.get('/registrar', (req, res) => {
  res.sendFile(path.join(__dirname, '..','views','registrar.html'));
});

router.post('/post-jogo', async (req, res) => {
  try {
    const { nome, imagem,descricao,nota } = req.body;
    const novoJogo = new Jogo({ nome, imagem ,descricao,nota});
    await novoJogo.save();
    res.status(201).send('Jogo criado com sucesso');
  } catch (error) {
    console.error('Erro ao criar jogo:', error);
    res.status(500).send('Ocorreu um erro ao criar o jogo');
  }
});

// Rota POST para criar um novo usuário
router.post('/post-usuario', async (req, res) => {
  try {
    const { nome, nomeDeUsuario, senha, email, dataNascimento } = req.body;
    const novoUsuario = new Usuario({ nome, nomeDeUsuario, senha, email, dataNascimento });
    await novoUsuario.save();
    res.status(201).send('Usuário criado com sucesso');
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).send('Ocorreu um erro ao criar o usuário');
  }
});

module.exports = router;
