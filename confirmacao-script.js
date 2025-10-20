// Carregar dados do evento
document.addEventListener('DOMContentLoaded', function() {
    // Recuperar dados do evento (salvos antes de redirecionar)
    const eventoData = JSON.parse(localStorage.getItem('eventoRecemCriado') || '{}');
    
    if (eventoData.nome) {
        exibirDetalhesEvento(eventoData);
    }
});

// Exibir detalhes do evento
function exibirDetalhesEvento(dados) {
    const detailsDiv = document.getElementById('eventDetails');
    
    let html = `
        <p><strong>Nome:</strong> ${dados.nome}</p>
        <p><strong>Data:</strong> ${formatarData(dados.data)}</p>
        <p><strong>Hora:</strong> ${dados.hora}</p>
    `;
    
    if (dados.local) {
        html += `<p><strong>Local:</strong> ${dados.local}</p>`;
    }
    
    if (dados.categoria) {
        html += `<p><strong>Categoria:</strong> ${capitalize(dados.categoria)}</p>`;
    }
    
    if (dados.vagas) {
        html += `<p><strong>Vagas:</strong> ${dados.vagas}</p>`;
    }
    
    detailsDiv.innerHTML = html;
}

// Formatar data
function formatarData(data) {
    if (!data) return '';
    const partes = data.split('-');
    return partes[2] + '/' + partes[1] + '/' + partes[0];
}

// Capitalizar primeira letra
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Voltar para a página inicial
function voltarInicio() {
    localStorage.removeItem('eventoRecemCriado');
    window.location.href = 'index.html';
}

// Criar outro evento
function criarOutro() {
    localStorage.removeItem('eventoRecemCriado');
    window.location.href = 'criar-evento.html';
}