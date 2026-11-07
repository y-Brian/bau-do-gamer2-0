/* =====================================
        Elementos do site
===================================== */

// endereço da API de jogos grátis
const API = "https://www.gamerpower.com/api/giveaways";

// guarda todos os jogos que vieram da API
let jogos = [];

// menu
const menu = document.getElementById("menu");
const menuMobile = document.getElementById("menuMobile");

// jogos
const listaJogos = document.getElementById("listaJogos");
const carregando = document.getElementById("carregando");
const erro = document.getElementById("erro");

// pesquisa
const pesquisa = document.getElementById("pesquisa");
const filtroJogos = document.getElementById("filtroJogos");
const buscarJogos = document.getElementById("buscarJogos");

// modal
const modal = document.getElementById("modal");
const fecharModal = document.getElementById("fecharModal");
const imagemModal = document.getElementById("imagemModal");
const tituloModal = document.getElementById("tituloModal");
const descricaoModal = document.getElementById("descricaoModal");
const plataformaModal = document.getElementById("plataformaModal");
const linkModal = document.getElementById("linkModal");

// outros
const voltarTopo = document.getElementById("voltarTopo");
const formContato = document.getElementById("formContato");
const avisoFormulario = document.getElementById("avisoFormulario");


/* =====================================
        Menu Mobile
===================================== */

menuMobile.addEventListener("click", function () {

    const aberto = menu.classList.toggle("ativo");

    menuMobile.setAttribute("aria-expanded", aberto);

});

// fecha o menu quando clica em algum link
menu.querySelectorAll("a").forEach(function (link) {

    link.addEventListener("click", function () {

        menu.classList.remove("ativo");
        menuMobile.setAttribute("aria-expanded", false);

    });

});


/* =====================================
        Jogos da API
===================================== */

async function carregarJogos() {

    try {

        const resposta = await fetch(API);

        if (!resposta.ok) {
            throw new Error("Erro ao acessar a API");
        }

        const dados = await resposta.json();

        // se a API não achar nada, ela não devolve uma lista
        jogos = Array.isArray(dados) ? dados : [];

        mostrarJogos(jogos);

    } catch (e) {

        erro.textContent =
            "Não foi possível carregar os jogos agora. Tente novamente mais tarde.";

    } finally {

        carregando.style.display = "none";

    }

}

function mostrarJogos(lista) {

    listaJogos.innerHTML = "";

    if (lista.length === 0) {

        listaJogos.innerHTML =
            "<p class='mensagem'>Nenhum jogo encontrado 😕</p>";

        return;

    }

    lista.forEach(function (jogo) {

        const card = document.createElement("div");
        card.className = "card-jogo";

        card.innerHTML = `
            <img src="${jogo.thumbnail}" alt="${jogo.title}">
            <h3>${jogo.title}</h3>
            <p>${jogo.platforms}</p>
            <p class="preco">${jogo.worth} - Grátis</p>
            <button>Ver detalhes</button>
        `;

        card.querySelector("button").addEventListener("click", function () {
            abrirModal(jogo);
        });

        listaJogos.appendChild(card);

    });

}


/* =====================================
        Pesquisa de Jogos
===================================== */

// tira acento e deixa minúsculo, assim "pokemon" acha "Pokémon"
function limpar(texto) {

    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();

}

function filtrarJogos(texto) {

    const busca = limpar(texto);

    // campo vazio: mostra todos os jogos de novo
    if (busca === "") {
        mostrarJogos(jogos);
        return;
    }

    const encontrados = jogos.filter(function (jogo) {
        return limpar(jogo.title).includes(busca);
    });

    mostrarJogos(encontrados);

}

// barra da seção de jogos
filtroJogos.addEventListener("input", function () {

    pesquisa.value = filtroJogos.value;
    filtrarJogos(filtroJogos.value);

});

// barra do topo
pesquisa.addEventListener("input", function () {

    filtroJogos.value = pesquisa.value;
    filtrarJogos(pesquisa.value);

});

// apertar Enter na barra do topo leva até a lista de jogos
pesquisa.addEventListener("keydown", function (evento) {

    if (evento.key === "Enter") {

        evento.preventDefault();
        filtrarJogos(pesquisa.value);
        listaJogos.scrollIntoView({ behavior: "smooth", block: "start" });

    }

});

// apertar Enter na barra da seção só pesquisa
filtroJogos.addEventListener("keydown", function (evento) {

    if (evento.key === "Enter") {

        evento.preventDefault();
        filtrarJogos(filtroJogos.value);

    }

});

// botão buscar
buscarJogos.addEventListener("click", function () {

    filtrarJogos(filtroJogos.value);

});


/* =====================================
            Modal
===================================== */

function abrirModal(jogo) {

    imagemModal.src = jogo.image;
    imagemModal.alt = jogo.title;

    tituloModal.textContent = jogo.title;

    // a descrição da API pode ser enorme, então corto um pouco
    descricaoModal.textContent = jogo.description.slice(0, 220) + "...";

    plataformaModal.textContent = "Plataformas: " + jogo.platforms;

    linkModal.href = jogo.open_giveaway_url;

    modal.classList.add("ativo");

}

function fechar() {

    modal.classList.remove("ativo");

}

fecharModal.addEventListener("click", fechar);

// fecha clicando fora da caixa
modal.addEventListener("click", function (evento) {

    if (evento.target === modal) {
        fechar();
    }

});

// fecha com a tecla Esc
document.addEventListener("keydown", function (evento) {

    if (evento.key === "Escape") {
        fechar();
    }

});


/* =====================================
            Volta ao Topo
===================================== */

window.addEventListener("scroll", function () {

    if (window.scrollY > 400) {
        voltarTopo.classList.add("ativo");
    } else {
        voltarTopo.classList.remove("ativo");
    }

});

voltarTopo.addEventListener("click", function () {

    window.scrollTo({ top: 0, behavior: "smooth" });

});


/* =====================================
           FAQ
===================================== */

document.querySelectorAll(".perguntaTitulo").forEach(function (botao) {

    botao.addEventListener("click", function () {

        const pergunta = botao.parentElement;
        const sinal = botao.querySelector("span");

        pergunta.classList.toggle("ativo");

        if (pergunta.classList.contains("ativo")) {
            sinal.textContent = "−";
        } else {
            sinal.textContent = "+";
        }

    });

});


/* =====================================
        Formulário de Contato
===================================== */

formContato.addEventListener("submit", function (evento) {

    evento.preventDefault();

    const nome = document.getElementById("nome").value;

    avisoFormulario.textContent =
        "Obrigado, " + nome + "! Sua mensagem foi enviada.";

    formContato.reset();

});

/* =====================================
           Modo Claro e Escuro
===================================== */
function btnTema() {
 
    const modo = localStorage.getItem(btnTema)
    
 
    if (modo === "light") {
 
        document.body.classList.add("light");
 
    } else {
 
        document.body.classList.remove("light");
 
    }
 
    atualizarIconeTema();
 
}
 
function atualizarIconeTema() {
 
    if (document.body.classList.contains("light")) {
 
        tema.textContent = "🌙";
 
    } else {
 
        tema.textContent = "☀️";
 
    }
 
}
 
function alternarTema() {
 
    document.body.classList.toggle("light");
 
    const claro = document.body.classList.contains("light");
 
    localStorage.setItem(
        btnTema,
        claro ? "light" : "dark"
    );
 
    atualizarIconeTema();
 
}

tema.addEventListener("click", alternarTema)

btnTema();

/* =====================================
          Iniciar o site
===================================== */

carregarJogos();