// ID do usuário logado (em produção, isso viria da sessão)
const USUARIO_ID = 1; // Simula o ID do usuário logado

// Variável global para armazenar dados do evento
let eventoAtual = null;

// Carrega os detalhes do evento quando a página é carregada
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const eventoId = urlParams.get('id');
    
    if (eventoId) {
        carregarDetalhesEvento(eventoId);
    } else {
        mostrarErro('Evento não encontrado');
    }
});

// Carrega os detalhes do evento do backend
async function carregarDetalhesEvento(eventoId) {
    try {
        const response = await fetch(`http://localhost:8080/api/eventos/${eventoId}`);
        
        if (!response.ok) {
            throw new Error('Erro ao carregar evento');
        }
        
        eventoAtual = await response.json();
        preencherDetalhesEvento(eventoAtual);
        verificarStatusInscricao(eventoId);
        
    } catch (erro) {
        console.error('Erro ao carregar evento:', erro);
        mostrarErro('Não foi possível carregar os detalhes do evento');
    }
}

// Preenche os campos da página com os dados do evento
function preencherDetalhesEvento(evento) {
    document.getElementById('eventName').textContent = evento.nome;
    document.getElementById('eventDescription').textContent = evento.descricao;
    document.getElementById('eventDate').textContent = formatarData(evento.data);
    document.getElementById('eventTime').textContent = evento.hora.substring(0, 5);
    document.getElementById('eventLocation').textContent = evento.local || 'Não informado';
    document.getElementById('eventCategory').textContent = capitalize(evento.categoria);
    
    // Mostra vagas disponíveis
    const vagasTexto = evento.vagas 
        ? `${evento.vagasDisponiveis || evento.vagas} de ${evento.vagas} vagas disponíveis`
        : 'Vagas ilimitadas';
    document.getElementById('eventVagas').textContent = vagasTexto;
}

// Verifica o status de inscrição do usuário
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

// Atualiza o botão de inscrição baseado no status
function atualizarBotaoInscricao(status) {
    const btn = document.getElementById('inscricaoBtn');
    const statusMsg = document.getElementById('statusMessage');
    
    if (status.jaInscrito) {
        // Critério 3: Usuário já está inscrito
        btn.textContent = 'Já Inscrito';
        btn.classList.add('inscrito');
        btn.disabled = true;
        statusMsg.textContent = 'Você já está inscrito neste evento!';
        statusMsg.className = 'status-message success';
    } else if (status.esgotado) {
        // Critério 2: Evento esgotado
        btn.innerHTML = '<i class="fas fa-times-circle"></i> Vagas Esgotadas';
        btn.classList.add('esgotado');
        btn.disabled = true;
        statusMsg.textContent = 'Infelizmente as vagas para este evento estão esgotadas.';
        statusMsg.className = 'status-message warning';
    } else if (status.prazoExpirado) {
        // Critério 2: Prazo de inscrição passou
        btn.innerHTML = '<i class="fas fa-clock"></i> Inscrições Encerradas';
        btn.disabled = true;
        statusMsg.textContent = 'O prazo de inscrição para este evento já encerrou.';
        statusMsg.className = 'status-message warning';
    } else {
        // Pode se inscrever
        btn.innerHTML = '<i class="fas fa-check-circle"></i> Inscrever-se';
        btn.disabled = false;
        statusMsg.textContent = '';
    }
}

// Função principal de inscrição
async function inscreverEvento() {
    const btn = document.getElementById('inscricaoBtn');
    const statusMsg = document.getElementById('statusMessage');
    
    // Desabilita o botão durante o processamento
    btn.disabled = true;
    statusMsg.textContent = 'Processando inscrição...';
    statusMsg.className = 'status-message';
    
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const eventoId = urlParams.get('id');
        
        const response = await fetch(`http://localhost:8080/api/eventos/${eventoId}/inscricoes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                usuarioId: USUARIO_ID
            })
        });
        
        const resultado = await response.json();
        
        if (response.ok) {
            // Critério 1: Inscrição bem-sucedida
            mostrarConfirmacaoInscricao(eventoAtual);
        } else {
            // Trata erros específicos
            if (resultado.erro === 'JA_INSCRITO') {
                statusMsg.textContent = 'Você já está inscrito neste evento!';
                statusMsg.className = 'status-message error';
            } else if (resultado.erro === 'VAGAS_ESGOTADAS') {
                statusMsg.textContent = 'As vagas para este evento estão esgotadas.';
                statusMsg.className = 'status-message warning';
                btn.innerHTML = '<i class="fas fa-times-circle"></i> Vagas Esgotadas';
                btn.classList.add('esgotado');
            } else if (resultado.erro === 'PRAZO_EXPIRADO') {
                statusMsg.textContent = 'O prazo de inscrição já encerrou.';
                statusMsg.className = 'status-message warning';
            } else {
                statusMsg.textContent = resultado.mensagem || 'Erro ao processar inscrição.';
                statusMsg.className = 'status-message error';
                btn.disabled = false;
            }
        }
        
    } catch (erro) {
        console.error('Erro ao inscrever:', erro);
        statusMsg.textContent = 'Erro de conexão. Tente novamente.';
        statusMsg.className = 'status-message error';
        btn.disabled = false;
    }
}

// Redireciona para página de confirmação
function mostrarConfirmacaoInscricao(evento) {
    // Salva dados da inscrição
    localStorage.setItem('inscricaoRealizada', JSON.stringify({
        eventoNome: evento.nome,
        eventoData: formatarData(evento.data),
        eventoHora: evento.hora.substring(0, 5),
        eventoLocal: evento.local
    }));
    
    // Redireciona para página de confirmação
    window.location.href = 'inscricao-confirmacao.html';
}

// Funções auxiliares
function formatarData(data) {
    if (!data) return '';
    const partes = data.split('-');
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function mostrarErro(mensagem) {
    document.getElementById('eventName').textContent = 'Erro';
    document.getElementById('eventDescription').textContent = mensagem;
    document.getElementById('inscricaoBtn').style.display = 'none';
}