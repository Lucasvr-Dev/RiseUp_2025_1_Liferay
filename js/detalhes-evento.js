// ID do usuário logado (em produção, isso viria da sessão)
const USUARIO_ID = 1;

// Variável global para armazenar dados do evento
let eventoAtual = null;

// Ao carregar a página, busca o evento pelo ID
document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const eventoId = urlParams.get('id');

    if (eventoId) {
        carregarDetalhesEvento(eventoId);
    } else {
        mostrarErro('Evento não encontrado.');
    }
});

// Carrega os detalhes do evento
async function carregarDetalhesEvento(eventoId) {
    try {
        const response = await fetch(`http://localhost:8080/api/eventos/${eventoId}`);
        if (!response.ok) throw new Error('Erro ao buscar evento.');

        eventoAtual = await response.json();
        preencherDetalhesEvento(eventoAtual);
        verificarStatusInscricao(eventoId);
    } catch (erro) {
        console.error('Erro ao carregar evento:', erro);
        mostrarErro('Erro ao carregar evento.');
    }
}

// Preenche as informações do evento
function preencherDetalhesEvento(evento) {
    document.getElementById('eventName').textContent = evento.nome;
    document.getElementById('eventDescription').textContent = evento.descricao;
    document.getElementById('eventDate').textContent = formatarData(evento.data);
    document.getElementById('eventTime').textContent = evento.hora.substring(0, 5);
    document.getElementById('eventLocation').textContent = evento.local;
}

// Verifica se o usuário já está inscrito
async function verificarStatusInscricao(eventoId) {
    try {
        const response = await fetch(`http://localhost:8080/api/eventos/${eventoId}/inscricoes/${USUARIO_ID}/status`);
        if (response.ok) {
            const status = await response.json();
            atualizarBotaoInscricao(status);
        }
    } catch (erro) {
        console.error('Erro ao verificar inscrição:', erro);
    }
}

// Atualiza o botão de acordo com o status
function atualizarBotaoInscricao(status) {
    const btn = document.getElementById('inscricaoBtn');
    const msg = document.getElementById('statusMessage');

    if (status.jaInscrito) {
        btn.textContent = 'Já Inscrito';
        btn.disabled = true;
        msg.textContent = 'Você já está inscrito neste evento.';
    } else if (status.esgotado) {
        btn.textContent = 'Vagas Esgotadas';
        btn.disabled = true;
        msg.textContent = 'Vagas esgotadas.';
    } else {
        btn.textContent = 'Inscrever-se';
        btn.disabled = false;
        msg.textContent = '';
    }
}

// Faz a inscrição
async function inscreverEvento() {
    const btn = document.getElementById('inscricaoBtn');
    const msg = document.getElementById('statusMessage');
    btn.disabled = true;

    try {
        const urlParams = new URLSearchParams(window.location.search);
        const eventoId = urlParams.get('id');

        const response = await fetch(`http://localhost:8080/api/eventos/${eventoId}/inscricoes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuarioId: USUARIO_ID })
        });

        const resultado = await response.json();

        if (response.ok) {
            mostrarConfirmacaoInscricao(eventoAtual);
        } else {
            msg.textContent = resultado.mensagem || 'Erro ao se inscrever.';
            btn.disabled = false;
        }
    } catch (erro) {
        console.error('Erro na inscrição:', erro);
        msg.textContent = 'Erro ao conectar ao servidor.';
        btn.disabled = false;
    }
}

// Redireciona para página de confirmação
function mostrarConfirmacaoInscricao(evento) {
    localStorage.setItem('inscricaoRealizada', JSON.stringify({
        eventoNome: evento.nome,
        eventoData: formatarData(evento.data),
        eventoHora: evento.hora.substring(0, 5),
        eventoLocal: evento.local
    }));

    window.location.href = 'inscricao-confirmacao.html';
}

// Funções auxiliares
function formatarData(data) {
    const partes = data.split('-');
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function mostrarErro(mensagem) {
    document.getElementById('eventName').textContent = 'Erro';
    document.getElementById('eventDescription').textContent = mensagem;
    document.getElementById('inscricaoBtn').style.display = 'none';
}
