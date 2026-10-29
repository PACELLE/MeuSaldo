// Recebendo itens do formulário
const formTransacao = document.getElementById('formLancamento');
const tipoInput = document.getElementById('Tipo');
const descricaoInput = document.getElementById('Categoria');
const dataInput = document.getElementById('Data');
const valorInput = document.getElementById('Valor');
const saldoTotalElement = document.getElementById('saldoTotal');
const listaTransacoesElement = document.getElementById('listaLancamentos');
const mensagemErroElement = document.getElementById('mensagemErro');

// Listando transações ou iniciando lista do zero
let transacoes = JSON.parse(localStorage.getItem('transacoes_meusaldo')) || [];

// Salvar transações no localStorage
function salvarNoLocalStorage() {
    localStorage.setItem('transacoes_meusaldo', JSON.stringify(transacoes));
}

// Formatação em Real (R$)
function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Adicionar nova transação
function adicionarTransacao(event) {
    event.preventDefault();
    mensagemErroElement.textContent = ''; // Limpa aviso de erro anterior

    const tipo = tipoInput.value;
    const descricao = descricaoInput.value.trim();
    const data = dataInput.value;
    const valor = parseFloat(valorInput.value);

    // Validação de entrada vazia ou inválida (Sem quebrar o app)
    if (!descricao || isNaN(valor) || valor <= 0 || !data) {
        mensagemErroElement.textContent = 'Por favor, preencha todos os campos com valores válidos.';
        return;
    }

    // Criar objeto da transação
    const novaTransacao = {
        tipo,
        descricao,
        data,
        valor
    };

    transacoes.push(novaTransacao);
    salvarNoLocalStorage();
    atualizarSaldo();
    renderizarLista();

    // Limpar campos após inserção
    formTransacao.reset();
}

// Atualizar o saldo na tela
function atualizarSaldo() {
    const total = transacoes.reduce((acumulador, t) => {
        return t.tipo === 'receita' ? acumulador + t.valor : acumulador - t.valor;
    }, 0);

    saldoTotalElement.textContent = formatarMoeda(total);

    if (total < 0) {
        saldoTotalElement.style.color = '#e74c3c';
    } else {
        saldoTotalElement.style.color = '#27ae60';
    }
}

// Criação de função renderizarLista atualizar tela a cada adição de transações 
function renderizarLista() {
    listaTransacoesElement.textContent = ''; // Limpa a lista com segurança

    if (transacoes.length === 0) {
        const itemVazio = document.createElement('li');
        itemVazio.textContent = 'Nenhum lançamento registrado.';
        itemVazio.style.textAlign = 'center';
        itemVazio.style.color = '#777';
        listaTransacoesElement.appendChild(itemVazio);
        return;
    }

    transacoes.forEach((transacao, index) => {
        const li = document.createElement('li');
        li.className = `item-transacao ${transacao.tipo}`;

        // Div de detalhes
        const divDetalhes = document.createElement('div');
        
        const infoTexto = document.createElement('p');
        infoTexto.textContent = `${transacao.descricao} (${transacao.data})`;

        const valorTexto = document.createElement('strong');
        const sinal = transacao.tipo === 'receita' ? '+' : '-';
        valorTexto.textContent = `${sinal} ${formatarMoeda(transacao.valor)}`;

        divDetalhes.appendChild(infoTexto);
        divDetalhes.appendChild(valorTexto);

        // Botão de remoção
        const btnRemover = document.createElement('button');
        btnRemover.textContent = 'X';
        btnRemover.className = 'btn-remover';
        btnRemover.addEventListener('click', () => removerTransacao(index));

        li.appendChild(divDetalhes);
        li.appendChild(btnRemover);

        listaTransacoesElement.appendChild(li);
    });
}

// Remover transação pelo índice
function removerTransacao(index) {
    transacoes.splice(index, 1);
    salvarNoLocalStorage();
    atualizarSaldo();
    renderizarLista();
}

// Evento de submit do botão
formTransacao.addEventListener('submit', adicionarTransacao);

// Inicialização da tela ao carregar a página
atualizarSaldo();
renderizarLista();