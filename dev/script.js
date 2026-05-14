// ----------  ESTRUTURA DE DADOS ----------
// Chave para LocalStorage: "clientes_db"
const STORAGE_KEY = "clientes_db";
// Variável global para armazenar array interno de clientes
let clientesArray = [];

// Elementos DOM essenciais
const form = document.getElementById("clienteForm");
const nomeInput = document.getElementById("nomeCliente");
const emailInput = document.getElementById("emailCliente");
const planoSel = document.getElementById("planoCliente");
const cardsContainer = document.getElementById("cardsContainer");
const filtroInput = document.getElementById("filtroBusca");

// ---------- FUNÇÕES AUXILIARES ----------
// Carregar dados do LocalStorage
function carregarClientesDoStorage() {
    const dadosRaw = localStorage.getItem(STORAGE_KEY);
    if (dadosRaw) {
        try {
            clientesArray = JSON.parse(dadosRaw);
            // Garantir que cada objeto tem os campos necessários
            if (!Array.isArray(clientesArray)) clientesArray = [];
        } catch(e) { clientesArray = []; }
    } else {
        clientesArray = [];
    }
    return clientesArray;
}

// Salvar array no localStorage (persistência)
function salvarClientesNoStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clientesArray));
}

// Adicionar cliente (recebe objeto {nome, email, plano})
function adicionarCliente(nome, email, plano) {
    // Evitar duplicatas de e-mail
    const jaExiste = clientesArray.some(cli => cli.email.toLowerCase() === email.toLowerCase());
    if (jaExiste) {
        alert("⚠️ Já existe um cliente cadastrado com este e-mail!");
        return false;
    }
    const novoCliente = {
        id: Date.now() + Math.floor(Math.random() * 10000), // id único
        nome: nome.trim(),
        email: email.trim(),
        plano: plano
    };
    clientesArray.push(novoCliente);
    salvarClientesNoStorage();
    return true;
}

// Remover cliente por id
function removerCliente(id) {
    const index = clientesArray.findIndex(cliente => cliente.id === id);
    if (index !== -1) {
        clientesArray.splice(index, 1);
        salvarClientesNoStorage();
        return true;
    }
    return false;
}

// Validação de e-mail (presença de @ e formato simples)
function validarEmail(emailStr) {
    return emailStr.includes('@') && emailStr.trim() !== '';
}

// Atualizar classe visual do campo e-mail de acordo com validação (blur)
function aplicarValidacaoEmail() {
    const emailValor = emailInput.value;
    const isValid = validarEmail(emailValor);
    if (!isValid && emailValor !== "") {
        emailInput.classList.add("input-invalido");
    } else {
        emailInput.classList.remove("input-invalido");
    }
}

// Renderização dos cards (com filtro em tempo real)
function renderizarCards() {
    // Obter termo de busca
    const termoBusca = filtroInput.value.trim().toLowerCase();
    
    // Filtrar array conforme termo (nome, email, plano)
    let clientesFiltrados = clientesArray;
    if (termoBusca !== "") {
        clientesFiltrados = clientesArray.filter(cliente => {
            return cliente.nome.toLowerCase().includes(termoBusca) ||
                   cliente.email.toLowerCase().includes(termoBusca) ||
                   cliente.plano.toLowerCase().includes(termoBusca);
        });
    }

    // Limpar container
    cardsContainer.innerHTML = "";

    if (clientesFiltrados.length === 0) {
        const msgEmpty = document.createElement("div");
        msgEmpty.className = "sem-clientes-msg";
        msgEmpty.innerText = termoBusca ? "🔎 Nenhum cliente corresponde à busca." : "📭 Nenhum cliente cadastrado. Adicione um cliente!";
        cardsContainer.appendChild(msgEmpty);
        return;
    }

    // Para cada cliente, criar card dinamicamente com document.createElement
    clientesFiltrados.forEach(cliente => {
        const card = document.createElement("div");
        // Define a classe base e a classe específica do plano (minúsculo para estilo)
        let planoClass = "";
        if (cliente.plano === "Gold") planoClass = "plano-gold";
        else if (cliente.plano === "Silver") planoClass = "plano-silver";
        else if (cliente.plano === "Bronze") planoClass = "plano-bronze";
        card.className = `cliente-card ${planoClass}`;
        
        // Parte de informações do card
        const infoDiv = document.createElement("div");
        infoDiv.className = "card-info";
        
        const nomeEl = document.createElement("h3");
        nomeEl.textContent = cliente.nome;
        
        const emailEl = document.createElement("p");
        emailEl.innerHTML = `📧 ${cliente.email}`;
        
        const planoEl = document.createElement("p");
        const badge = document.createElement("span");
        badge.className = "plano-badge";
        badge.textContent = `🎯 Plano: ${cliente.plano}`;
        planoEl.appendChild(badge);
        
        infoDiv.appendChild(nomeEl);
        infoDiv.appendChild(emailEl);
        infoDiv.appendChild(planoEl);
        
        // Botão remover
        const btnRemover = document.createElement("button");
        btnRemover.textContent = "✖";
        btnRemover.className = "btn-remover";
        btnRemover.setAttribute("aria-label", "Remover cliente");
        // Evento de remoção com clique -> atualiza DOM e storage
        btnRemover.addEventListener("click", (event) => {
            event.stopPropagation();
            // Remove do array e salva
            removerCliente(cliente.id);
            // Re-renderiza cards totalmente (já reflete a exclusão)
            renderizarCards();
        });
        
        card.appendChild(infoDiv);
        card.appendChild(btnRemover);
        cardsContainer.appendChild(card);
    });
}

// Função que sincroniza cards com o estado atual do clientesArray + filtro
function atualizarInterfaceCompleta() {
    renderizarCards(); // já aplica filtro e constrói os cards dinâmicos
}

// ---------- GERENCIAMENTO DE SESSIONSTORAGE (OPERADOR) ----------
function inicializarOperadorSession() {
    // Recupera ou pergunta o nome do operador
    let operadorNome = sessionStorage.getItem("operador_nome");
    const operadorSpan = document.getElementById("operadorNomeSpan");
    
    if (!operadorNome) {
        // Pergunta ao usuário via prompt (única vez por aba/sessão)
        let nomeDigitado = prompt("✨ Bem-vindo(a)! Digite seu nome para registrar como Operador(a) atual:", "Operador");
        if (nomeDigitado && nomeDigitado.trim() !== "") {
            operadorNome = nomeDigitado.trim();
            sessionStorage.setItem("operador_nome", operadorNome);
        } else {
            operadorNome = "Não informado";
            sessionStorage.setItem("operador_nome", operadorNome);
        }
    }
    operadorSpan.textContent = operadorNome;
}

// ---------- EVENTOS E VALIDAÇÃO FORMULÁRIO ----------
// 1) Validação e-mail no blur (campo fica vermelho se inválido)
emailInput.addEventListener("blur", () => {
    aplicarValidacaoEmail();
});

// Opcional: ao digitar limpa o estilo de erro
emailInput.addEventListener("input", () => {
    if (validarEmail(emailInput.value)) {
        emailInput.classList.remove("input-invalido");
    } else if (emailInput.value === "") {
        emailInput.classList.remove("input-invalido");
    } else {
        if(validarEmail(emailInput.value)) emailInput.classList.remove("input-invalido");
    }
});

// Evento de submit: cadastra novo cliente sem recarregar página
form.addEventListener("submit", (event) => {
    event.preventDefault();
    
    // Capturar valores
    const nome = nomeInput.value.trim();
    const email = emailInput.value.trim();
    const plano = planoSel.value;
    
    // Validações básicas
    if (nome === "") {
        alert("❌ O campo Nome é obrigatório.");
        nomeInput.focus();
        return;
    }
    if (email === "") {
        alert("❌ O campo E-mail é obrigatório.");
        emailInput.focus();
        return;
    }
    if (!validarEmail(email)) {
        alert("❌ E-mail inválido! Deve conter '@'.");
        emailInput.classList.add("input-invalido");
        emailInput.focus();
        return;
    }
    
    // Adicionar cliente ao sistema (persistência local)
    const sucesso = adicionarCliente(nome, email, plano);
    if (sucesso) {
        // Limpar formulário (apenas nome e email, plano mantém padrão Gold)
        nomeInput.value = "";
        emailInput.value = "";
        planoSel.value = "Gold";
        emailInput.classList.remove("input-invalido");
        // Atualizar cards na tela
        atualizarInterfaceCompleta();
    }
});

// Evento de filtro (oninput) - atualiza dinamicamente enquanto digita
filtroInput.addEventListener("input", () => {
    renderizarCards();  // Filtro em tempo real
});

// Carregamento inicial da página:
function init() {
    // 1) Carregar clientes do localStorage
    carregarClientesDoStorage();
    // 2) Inicializar operador (SessionStorage)
    inicializarOperadorSession();
    // 3) Renderizar cards (com base nos dados)
    atualizarInterfaceCompleta();
    // 4) Preparar validação extra de email
    emailInput.classList.remove("input-invalido");
}

init();