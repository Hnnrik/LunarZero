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

router.get('/logout', (req, res) => {
  // Limpe a sessão do usuário
  req.session.destroy((err) => {
    if (err) {
      console.error('Erro ao fazer logout:', err);
      res.status(500).send('Erro ao fazer logout');
    } else {
      // Redirecione para a página inicial após o logout
      res.redirect('/');
    }
  });
});
router.get('/deletar-jogo/:id', async (req, res) => {
  try {
    const jogoId = req.params.id;
    const jogo = await Jogo.findById(jogoId);
    if (!jogo) {
      return res.status(404).send('Jogo não encontrado');
    }
    await Jogo.findByIdAndDelete(jogoId);
    res.status(200).send('Jogo deletado com sucesso');
  } catch (error) {
    console.error('Erro ao deletar jogo:', error);
    res.status(500).send('Ocorreu um erro ao deletar o jogo');
  }
});




router.get('/', async (req, res) => {
  try {
    const jogos = await Jogo.find();
    // Verifique se o usuário está autenticado
    const nomeUsuario = req.session.usuario ? req.session.usuario.nome : null;

    res.render('home', { jogos, nomeUsuario });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao recuperar os jogos.');
  }
});
// Adicione a importação do modelo de Jogo no início do arquivo

router.get('/biblioteca', async (req, res) => {
  try {
    // Verifique se o usuário está autenticado
    if (!req.session.usuario) {
      // Redirecione para a página inicial (home) com uma mensagem de alerta na query string
      return res.redirect('/?alert=Você precisa estar logado para acessar sua biblioteca');
    }

    // Obtenha o ID do usuário atualmente logado
    const usuarioId = req.session.usuario._id;

    // Consulte os jogos publicados pelo usuário logado
    const jogos = await Jogo.find({ usuario: usuarioId });

    // Renderize a página com os jogos encontrados, passando também o nome do usuário
    res.render('biblioteca', { jogos, nomeUsuario: req.session.usuario.nome });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao recuperar os jogos da biblioteca');
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

router.get('/jogos', async (req, res) => {
  try {
    const jogos = await Jogo.find();
    // Verifique se o usuário está autenticado
    const nomeUsuario = req.session.usuario ? req.session.usuario.nome : null;

    res.render('jogos', { jogos, nomeUsuario });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao recuperar os jogos.');
  }
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
      return res.redirect('/tela-jogo/'+jogoId+'?alert=Faça login para comentar nos jogos');

    }

    // Recupere o nome de usuário da sessão
    const nomeUsuario = req.session.nomeDeUsuario;

    // Crie um novo documento de comentário com o nome de usuário
    const novoComentario = new Comentario({ texto, nota, usuario: nomeUsuario });

    // Adicione o novo comentário ao vetor de comentários do jogo
    jogo.comentarios.push(novoComentario);

    // Salve o jogo atualizado de volta no banco de dados
    await jogo.save();

    return res.redirect('/tela-jogo/'+jogoId+'?alert=Comentário enviado com sucesso');

  } catch (error) {
    console.error('Erro ao enviar comentário:', error);
    res.status(500);
    return res.redirect('/?alert=Ocorreu um erro');

  }
});

router.get('/buscar-jogo', async (req, res) => {
  try {
      const nomeJogo = req.query.nomeJogo;
      nomeJogo
      // Procure o jogo pelo nome no banco de dados
      const jogo = await Jogo.findOne({ nome: nomeJogo });
      if (!jogo) {
          return res.status(404).send('Jogo não encontrado');
      }

      // Redirecione para a página do jogo com o ID correspondente
      res.redirect(`/tela-jogo/${jogo._id}`);
  } catch (error) {
      console.error('Erro ao buscar jogo:', error);
      res.status(500).send('Ocorreu um erro ao buscar o jogo');
  }
});

router.get('/tela-jogo/:id', async (req, res) => {
  try {
    const nome =req.session.nomeDeUsuario;
      const jogo = await Jogo.findById(req.params.id);
      if (!jogo) {
          return res.redirect('/tela-jogo/'+jogoId+'?alert=Faça login');
      }
      res.render('tela-jogo', {  jogo, nome });
  } catch (error) {
      console.error(error);
      res.status(500);
      return res.redirect('/tela-jogo/'+jogoId+'?alert=Faça login');
  }
}); 

router.get('/editar-jogo/:id', async (req, res) => {
  try {
    const nome =req.session.nomeDeUsuario;
      const jogo = await Jogo.findById(req.params.id);
      if (!jogo) {
          return res.status(404).send('Jogo não encontrado');
      }
      res.render('editar-jogo', {  jogo, nome });
  } catch (error) {
      console.error(error);
      res.status(500).send('Erro ao recuperar informações do jogo');
  }
}); 

router.post('/editar-jog/:id', async (req, res) => {
  try {
    const jogoId = req.params.id;
    const { nome, imagem, descricao, carrossel } = req.body;

    // Verifique se o jogo existe no banco de dados
    const jogo = await Jogo.findById(jogoId);
    if (!jogo) {
      return res.status(404).send('Jogo não encontrado');
    }

    // Atualize as informações do jogo com os novos dados
    jogo.nome = nome;
    jogo.imagem = imagem;
    jogo.descricao = descricao;
    jogo.carrossel = carrossel.split(',');

    // Salve as alterações no jogo de volta ao banco de dados
    await jogo.save();

    // Redirecione para a página de visualização do jogo atualizado
    res.redirect(`/tela-jogo/${jogoId}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao editar o jogo');
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
      return res.redirect('/registrar?alert=Erro ao cadastrar, nome de usuário ou email já existe');
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
    return res.redirect('/?alert=Usuário cadastrado');
    res.status(201).json(usuarioSalvo);
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    return res.redirect('/registrar?alert=Erro ao cadastrar, por favor tente novamente');

  }
});
router.post('/post-jogo', async (req, res) => {
  try {
    const { nome, imagem, descricao, carrossel } = req.body;

    // Obtenha o ID do usuário atual da sessão
    const usuarioId = req.session.usuario._id;

    // Definindo o valor padrão para nota como null
    const nota = null;
    const carrosselArray = carrossel.split(',');

    // Definindo o valor padrão para comentários como um vetor vazio
    const comentarios = [];

    // Criando um novo jogo com os valores fornecidos e os valores padrão
    const novoJogo = new Jogo({ nome, imagem, descricao, nota, usuario: usuarioId, carrossel: carrosselArray, comentarios });

    // Salvando o novo jogo no banco de dados
    await novoJogo.save();

    // Enviando uma resposta de sucesso
    res.status(201);
    return res.redirect('/?alert=Jogo cadastrado com sucesso');

  } catch (error) {
    console.error('Erro ao criar jogo:', error);
    res.status(500);
    return res.redirect('/?alert=Erro ao cadastrar jogo, tente novamente');

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