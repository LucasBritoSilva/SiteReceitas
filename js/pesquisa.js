/* =====================================================
   Pesquisa de receitas com sugestões automáticas.
   Este é o ÚNICO JavaScript do site. Ele faz só isso:
   1) lê o que a pessoa digita
   2) procura receitas parecidas
   3) mostra sugestões
   4) deixa escolher uma (mouse ou teclado)
   5) leva para a página da receita
   ===================================================== */

/* DADOS: uma linha por receita (nome que aparece + caminho do arquivo).
   Ao criar uma receita nova, acrescente uma linha aqui. */
const RECEITAS = [
  { nome: "Arroz", arquivo: "receitas/arroz.html" },
  { nome: "Batata rústica na air fryer", arquivo: "receitas/batata-rustica-na-air-fryer.html" },
  { nome: "Bife acebolado", arquivo: "receitas/bife-acebolado.html" },
  { nome: "Bife à parmegiana", arquivo: "receitas/bife-a-parmegiana.html" },
  { nome: "Bobó de frango", arquivo: "receitas/bobo-de-frango.html" },
  { nome: "Bolo de cenoura", arquivo: "receitas/bolo-de-cenoura.html" },
  { nome: "Bolo de chocolate", arquivo: "receitas/bolo-de-chocolate.html" },
  { nome: "Brigadeiro", arquivo: "receitas/brigadeiro.html" },
  { nome: "Escondidinho de carne", arquivo: "receitas/escondidinho-de-carne.html" },
  { nome: "Filé de peixe empanado", arquivo: "receitas/file-de-peixe-empanado.html" },
  { nome: "Frango com batata", arquivo: "receitas/frango-com-batata.html" },
  { nome: "Hambúrguer do Brito", arquivo: "receitas/hamburguer-do-brito.html" },
  { nome: "Lasanha", arquivo: "receitas/lasanha.html" },
  { nome: "Limonada", arquivo: "receitas/limonada.html" },
  { nome: "Macarrão ao alho e óleo", arquivo: "receitas/macarrao-ao-alho-e-oleo.html" },
  { nome: "Macarrão à bolonhesa", arquivo: "receitas/macarrao-a-bolonhesa.html" },
  { nome: "Macarrão à carbonara", arquivo: "receitas/macarrao-a-carbonara.html" },
  { nome: "Nhoque de batata", arquivo: "receitas/nhoque-de-batata.html" },
  { nome: "Panqueca de carne moída", arquivo: "receitas/panqueca-de-carne-moida.html" },
  { nome: "Strogonoff de carne", arquivo: "receitas/strogonoff-de-carne.html" },
  { nome: "Yakisoba", arquivo: "receitas/yakisoba.html" }
];

/* Remove acentos e deixa tudo minúsculo: "Nhoque" e "nhóque" ficam iguais */
