// Carrega dados da inscrição quando a página é carregada
document.addEventListener('DOMContentLoaded', function() {
    const inscricaoData = JSON.parse(localStorage.getItem('inscricaoRealizada') || '{}');
    
    if (inscricaoData.eventoNome) {
        exibirDetalhesInscricao(inscricaoData);
    } else {
        // Se não há dados, redireciona para homepage
        window.location.href = 'homepage.html';
    }
});

// Exibe os detalhes da inscrição
function exibirDetalhesInscricao(dados) {
    const detailsDiv = document.getElementById('inscricaoDetails');
    
    let html = `
        <p><strong>📅 Evento:</strong> ${dados.eventoNome}</p>
        <p><strong>📆 Data:</strong> ${dados.eventoData}</p>
        <p><strong>⏰ Horário:</strong> ${dados.eventoHora}</p>
    `;
    
    if (dados.eventoLocal) {
        html += `<p><strong>📍 Local:</strong> ${dados.eventoLocal}</p>`;
    }
    
    detailsDiv.innerHTML = html;
}

// Volta para a página de eventos
function voltarEventos() {
    localStorage.removeItem('inscricaoRealizada');
    window.location.href = 'homepage.html';
}

// Vai para página de inscrições do usuário
function verMinhasInscricoes() {
    localStorage.removeItem('inscricaoRealizada');
    window.location.href = 'minhas-inscricoes.html';
}