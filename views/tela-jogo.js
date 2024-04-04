document.addEventListener('DOMContentLoaded', function(){
    var minhaImagem = document.getElementById('descricao-jogo-imagem');
    var meuParagrafo = document.getElementById('descricao-jogo-div-paragrafo');
    var meuTitulo = document.getElementById('descricao-jogo-titulo');
    var minhaAvaliacao = document.getElementById('descricao-jogo-icone-avaliacao');

    var alturaImagem = minhaImagem.offsetHeight;
    var alturaTitulo = meuTitulo.offsetHeight;
    var alturaAvaliacao = minhaAvaliacao.offsetHeight;
    var alturaParagrafo = alturaImagem - (alturaTitulo + alturaAvaliacao + 20);

    meuParagrafo.style.maxHeight = alturaParagrafo + 'px';
});

function comentar(){
    const conteudoM = document.getElementById('targgetComentaM');
    const conteudoD = document.getElementById('targgetComentaD');
    conteudoM.classList.toggle('comenta');
    conteudoD.classList.toggle('comenta');
}