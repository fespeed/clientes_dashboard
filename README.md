# Sprint 1: Dashboard 

## O Problema Gerador
Sua equipe de desenvolvimento foi contratada para criar uma ferramenta de gestão interna para uma empresa de serviços. Atualmente, os funcionários perdem todos os dados de novos clientes sempre que a página é atualizada ou o navegador é fechado. 

O objetivo deste sprint é construir uma interface funcional onde seja possível **cadastrar**, **visualizar** e **excluir** clientes, garantindo que as informações fiquem salvas no navegador através de persistência local.

---

## Objetivos Técnicos (Conteúdo Atual)
Nesta fase, o grupo deve aplicar os seguintes conceitos:
* **Manipulação de Estrutura:** Usar `document.createElement()` e `appendChild()` para gerar cards de clientes dinamicamente.
* **Interatividade & Eventos:** Capturar e reagir a eventos como `submit`, `input`, `blur` e `click`.
* **Persistência de Dados:** Implementar o ciclo de vida de dados com `JSON.stringify()`, `JSON.parse()` e `LocalStorage`.
* **Gestão de Sessão:** Utilizar o `SessionStorage` para dados voláteis da navegação atual.
* **Feedback Visual:** Manipular classes CSS via `classList` para indicar estados (erro, sucesso, tipos de plano).

---

## Requisitos da Interface

### 1. Painel de Cadastro (Formulário)
* Campos obrigatórios: **Nome**, **E-mail** e **Tipo de Plano** (Select: Gold, Silver ou Bronze).
* Validação visual: Se o e-mail for inválido (sem `@`), o campo deve ficar vermelho ao perder o foco (`onblur`).
* O botão de "Salvar" deve adicionar o cliente à lista sem recarregar a página.

### 2. Painel de Exibição (Cards Dinâmicos)
* Um container vazio onde os cards serão injetados pelo JavaScript.
* Cada card deve exibir os dados do cliente e ter uma cor de destaque baseada no plano escolhido.
* Cada card deve possuir um botão "Remover" que exclua o elemento do DOM e do armazenamento.

### 3. Filtro de Busca (UX)
* Um campo de busca que filtra os clientes exibidos na tela em tempo real conforme o usuário digita (`oninput`).

---

## Regras de Negócio e Lógica

### **A. Persistência com LocalStorage**
Sempre que um cliente for adicionado ou removido, o array de objetos no `LocalStorage` (chave: `clientes_db`) deve ser atualizado. Ao carregar a página, o sistema deve reconstruir os cards automaticamente.

### **B. Identificação com SessionStorage**
Ao abrir a página, o sistema deve perguntar o nome do operador (ou pegar de um input inicial) e salvar no `SessionStorage`. Exiba no topo: "Operador(a) atual: [Nome]". Se a aba for fechada, essa informação deve sumir.

---

## Entrega
* Código fonte organizado em `index.html`, `style.css` e `script.js`.
* O projeto deve permitir: Adicionar cliente -> Recarregar página -> Cliente continua lá.