// =====================
// (NOVO) 1. VERIFICAÇÃO DE SEGURANÇA (ROTA PROTEGIDA)
// =====================
const token = localStorage.getItem("authToken");
if (!token) {
    alert("Você precisa estar logado para ver os detalhes de um evento.");
    window.location.href = "login.html";
}

// =====================
// ID DO USUÁRIO
// =====================
// ID do usuário logado (em produção, isso viria da sessão)
// NOTA: Como você logou com 'teste@email.com', que é o ID 1, isso funcionará.
// No futuro, o ideal é pegar esse ID do localStorage (que salvamos no login).
const USUARIO_ID = 1;

// Variável global para armazenar dados do evento
let eventoAtual = null;

// =====================
// INICIALIZAÇÃO
// =====================
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

// =====================
// FETCH 1: CARREGAR DETALHES
// =====================
async function carregarDetalhesEvento(eventoId) {
    try {
        // (ALTERADO) Adiciona o cabeçalho de autorização
        const response = await fetch(`http://localhost:8080/api/eventos/${eventoId}`, {
            method: 'GET',
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        // (ALTERADO) Adiciona tratamento de erro de token
        if (response.status === 401 || response.status === 403) {
            alert("Sua sessão expirou. Faça login novamente.");
            localStorage.removeItem("authToken");
            window.location.href = "login.html";
            return;
        }
        if (!response.ok) throw new Error('Erro ao buscar evento.');

        eventoAtual = await response.json();
        preencherDetalhesEvento(eventoAtual);
        verificarStatusInscricao(eventoId); // Chama a próxima função
    } catch (erro) {
        console.error('Erro ao carregar evento:', erro);
        mostrarErro('Erro ao carregar evento.');
    }
}

// =====================
// FETCH 2: VERIFICAR STATUS DA INSCRIÇÃO
// =====================
async function verificarStatusInscricao(eventoId) {
    try {
        // (ALTERADO) Adiciona o cabeçalho de autorização
        const response = await fetch(`http://localhost:8080/api/eventos/${eventoId}/inscricoes/${USUARIO_ID}/status`, {
            method: 'GET',
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        // (ALTERADO) Adiciona tratamento de erro de token (necessário aqui também)
        if (response.status === 401 || response.status === 403) {
            alert("Sua sessão expirou (check status). Faça login novamente.");
            localStorage.removeItem("authToken");
            window.location.href = "login.html";
            return;
        }

        if (response.ok) {
            const status = await response.json();
            atualizarBotaoInscricao(status);
        }
    } catch (erro) {
        console.error('Erro ao verificar inscrição:', erro);
    }
}

// =====================
// FETCH 3: FAZER INSCRIÇÃO
// =====================
async function inscreverEvento() {
    const btn = document.getElementById('inscricaoBtn');
    const msg = document.getElementById('statusMessage');
    btn.disabled = true;

    try {
        const urlParams = new URLSearchParams(window.location.search);
        const eventoId = urlParams.get('id');

        // (ALTERADO) Adiciona o cabeçalho de autorização
        const response = await fetch(`http://localhost:8080/api/eventos/${eventoId}/inscricoes`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({ usuarioId: USUARIO_ID })
        });

        // (ALTERADO) Adiciona tratamento de erro de token
        const resultado = await response.json();
        if (response.status === 401 || response.status === 403) {
             alert("Sua sessão expirou (inscrição). Faça login novamente.");
             localStorage.removeItem("authToken");
             window.location.href = "login.html";
             return;
        }

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


// =====================
// FUNÇÕES AUXILIARES (Sem alteração)
// =====================

// Preenche as informações do evento
function preencherDetalhesEvento(evento) {
    document.getElementById('eventName').textContent = evento.nome;
    document.getElementById('eventDescription').textContent = evento.descricao;
    document.getElementById('eventDate').textContent = formatarData(evento.data);
    document.getElementById('eventTime').textContent = evento.hora.substring(0, 5);
    document.getElementById('eventLocation').textContent = evento.local;
    
    const categoryElement = document.getElementById('eventCategory');
    if (categoryElement) {
        categoryElement.textContent = evento.categoria || '-';
    }

    const vagasElement = document.getElementById('eventVagas');
    if (vagasElement) {
        const vagas = evento.vagas; 
        const textoVagas = (vagas !== undefined && vagas !== null && vagas >= 0)
            ? `${vagas} vagas` 
            : '- vagas';
        vagasElement.textContent = textoVagas;
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
    if (!data) return "--/--/----";
    const partes = data.split('-');
    if (partes.length < 3) return data;
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function mostrarErro(mensagem) {
    document.getElementById('eventName').textContent = 'Erro';
    document.getElementById('eventDescription').textContent = mensagem;
    
    // Esconde o botão se der erro
    const btn = document.getElementById('inscricaoBtn');
    if (btn) btn.style.display = 'none';
}