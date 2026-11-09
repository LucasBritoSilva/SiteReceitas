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
function normalizar(texto) {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

/* Procura receitas cujo nome contenha o texto digitado.
   Quem começa com o texto vem primeiro; depois quem começa uma palavra; depois o resto. */
function buscar(texto) {
  const termo = normalizar(texto);
  if (termo === "") return [];

  const resultados = [];
  for (const receita of RECEITAS) {
    const nome = normalizar(receita.nome);
    const posicao = nome.indexOf(termo);
    if (posicao === -1) continue;

    let pontos = 3;
    if (posicao === 0) pontos = 1;
    else if (nome.charAt(posicao - 1) === " ") pontos = 2;
    resultados.push({ receita: receita, pontos: pontos });
  }

  resultados.sort(function (a, b) {
    return a.pontos - b.pontos || a.receita.nome.localeCompare(b.receita.nome, "pt-BR");
  });
  return resultados.map(function (item) { return item.receita; });
}

/* Destaca em negrito o trecho digitado dentro do nome da receita */
function destacar(nome, texto) {
  const termo = normalizar(texto);
  const inicio = normalizar(nome).indexOf(termo);
  if (inicio === -1 || termo === "") return escapar(nome);
  const fim = inicio + termo.length;
  return escapar(nome.slice(0, inicio)) + "<mark>" + escapar(nome.slice(inicio, fim)) + "</mark>" + escapar(nome.slice(fim));
}

function escapar(texto) {
  return texto.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/* Liga a pesquisa a cada formulário que tiver a classe "pesquisa" */
function iniciarPesquisa(formulario) {
  const campo = formulario.querySelector("input");
  const lista = formulario.querySelector(".sugestoes");
  const raiz = formulario.dataset.raiz || "";   /* "" na raiz do site, "../" nas subpastas */
  let itemAtivo = -1;

  function fechar() {
    lista.hidden = true;
    lista.innerHTML = "";
    campo.setAttribute("aria-expanded", "false");
    campo.removeAttribute("aria-activedescendant");
    itemAtivo = -1;
  }

  function marcar(indice) {
    const itens = lista.querySelectorAll("li[role='option']");
    itens.forEach(function (item) {
      item.classList.remove("ativa");
      item.setAttribute("aria-selected", "false");
    });
    itemAtivo = indice;
    if (indice >= 0 && itens[indice]) {
      itens[indice].classList.add("ativa");
      itens[indice].setAttribute("aria-selected", "true");
      campo.setAttribute("aria-activedescendant", itens[indice].id);
      itens[indice].scrollIntoView({ block: "nearest" });
    } else {
      campo.removeAttribute("aria-activedescendant");
    }
  }

  function mostrar() {
    const texto = campo.value;
    if (normalizar(texto) === "") { fechar(); return; }

    const encontradas = buscar(texto).slice(0, 8);
    itemAtivo = -1;
    campo.removeAttribute("aria-activedescendant");

    if (encontradas.length === 0) {
      lista.innerHTML = '<li class="sem-resultado" role="option" aria-disabled="true">Nenhuma receita encontrada</li>';
    } else {
      lista.innerHTML = encontradas.map(function (receita, i) {
        return '<li role="option" id="' + lista.id + "-" + i + '" aria-selected="false">' +
               '<a href="' + raiz + receita.arquivo + '" tabindex="-1">' + destacar(receita.nome, texto) + "</a></li>";
      }).join("");
    }
    lista.hidden = false;
    campo.setAttribute("aria-expanded", "true");
  }

  campo.addEventListener("input", mostrar);
  campo.addEventListener("focus", mostrar);

  campo.addEventListener("keydown", function (evento) {
    const itens = lista.querySelectorAll("li[role='option'] a");
    if (evento.key === "ArrowDown" && itens.length > 0) {
      evento.preventDefault();
      marcar(itemAtivo + 1 >= itens.length ? 0 : itemAtivo + 1);
    } else if (evento.key === "ArrowUp" && itens.length > 0) {
      evento.preventDefault();
      marcar(itemAtivo - 1 < 0 ? itens.length - 1 : itemAtivo - 1);
    } else if (evento.key === "Escape") {
      fechar();
    } else if (evento.key === "Enter" && itens.length > 0) {
      /* Enter abre a sugestão marcada; se nenhuma estiver marcada, abre a primeira */
      evento.preventDefault();
      window.location.href = itens[itemAtivo >= 0 ? itemAtivo : 0].getAttribute("href");
    }
  });

  /* Fecha a lista ao clicar fora ou ao sair do formulário com Tab */
  document.addEventListener("click", function (evento) {
    if (!formulario.contains(evento.target)) fechar();
  });
  formulario.addEventListener("focusout", function (evento) {
    if (!formulario.contains(evento.relatedTarget)) fechar();
  });
}

document.querySelectorAll("form.pesquisa").forEach(iniciarPesquisa);
