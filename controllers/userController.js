// userController.js
const express = require('express');
const router = express.Router();
const path = require('path');
const session = require('express-session');
const Jogo = require('../models/jogoModel');
const Usuario = require('../models/usuarioModel');
const Comentario = require('../models/comentarioModel');

router.use(session({
  secret: 'segredo', // Uma chave secreta para assinar os cookies de sessão
  resave: false,
  saveUninitialized: true
}));

router.get('/', async (req, res) => {
  try {
    const jogos = await Jogo.find();

    res.render('home', { jogos });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao recuperar os jogos.');
  }
});

router.get('/biblioteca', async (req, res) => {
  try {
    const jogos = await Jogo.find();

    res.render('biblioteca', { jogos });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao recuperar os jogos.');
  }
});


const verificarAutenticacao = (req, res, next) => {
  if (req.session.usuario) {
    next();
  } else {
    res.redirect('/login');
  }
};


router.get('/cadastro-jogo', verificarAutenticacao ,(req, res) => {
  res.sendFile(path.join(__dirname,'..', 'views', 'cadastro-jogo.html'));
});

router.get('/criador', (req, res) => {
  res.sendFile(path.join(__dirname, '..','views', 'criador.html'));
});

router.get('/jogos', (req, res) => {
  res.sendFile(path.join(__dirname, '..','views', 'jogos.html'));
});

router.post('/tela-jogo/:id/comentario', async (req, res) => {
  try {
    const { texto, nota } = req.body;
    const jogoId = req.params.id;

    // Encontre o jogo correspondente pelo ID
    const jogo = await Jogo.findById(jogoId);
    if (!jogo) {
      return res.status(404).send('Jogo não encontrado');
    }

    // Verifique se o usuário está autenticado
    if (!req.session.nomeDeUsuario) {
      return res.status(401).send('Usuário não autenticado');
    }

    // Recupere o nome de usuário da sessão
    const nomeUsuario = req.session.nomeDeUsuario;

    // Crie um novo documento de comentário com o nome de usuário
    const novoComentario = new Comentario({ texto, nota, usuario: nomeUsuario });

    // Adicione o novo comentário ao vetor de comentários do jogo
    jogo.comentarios.push(novoComentario);

    // Salve o jogo atualizado de volta no banco de dados
    await jogo.save();

    res.status(201).send('Comentário enviado com sucesso');
  } catch (error) {
    console.error('Erro ao enviar comentário:', error);
    res.status(500).send('Ocorreu um erro ao enviar o comentário');
  }
});


router.get('/tela-jogo/:id', async (req, res) => {
  try {
    const nome =req.session.nomeDeUsuario;
      const jogo = await Jogo.findById(req.params.id);
      if (!jogo) {
          return res.status(404).send('Jogo não encontrado');
      }
      res.render('tela-jogo', {  jogo, nome });
  } catch (error) {
      console.error(error);
      res.status(500).send('Erro ao recuperar informações do jogo');
  }
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

router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    const usuario = await Usuario.findOne({ email, senha });
    if (!usuario) {
      return res.redirect('/login?erro=Usuario ou senha incorretos');
    }

    req.session.usuario = usuario;
    req.session.nomeDeUsuario=usuario.nome;
    // Definindo a variável nomeUsuario

    // Redirecione para a página desejada após o login bem-sucedido
    res.redirect('/');
  } catch (error) {
    console.error('Erro ao processar login:', error);
    res.status(500).json({ message: 'Erro ao processar login.' });
  }
});


router.get('/registrar', (req, res) => {
  res.sendFile(path.join(__dirname, '..','views','registrar.html'));
});

router.post('/registrar', async (req, res) => {
  try {
    const { nome, nomeDeUsuario, senha, email, dataNascimento } = req.body;

    const usuarioExistente = await Usuario.findOne({ $or: [{ nomeDeUsuario }, { email }] });
    if (usuarioExistente) {
      return res.status(400).json({ message: 'Nome de usuário ou e-mail já está em uso.' });
    }

    const novoUsuario = new Usuario({
      nome,
      nomeDeUsuario,
      senha,
      email,
      dataNascimento
    });

    // Salvar o novo usuário no banco de dados
    const usuarioSalvo = await novoUsuario.save();
    res.status(201).json(usuarioSalvo);
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ message: 'Erro ao registrar usuário.' });
  }
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