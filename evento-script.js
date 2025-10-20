// Função para voltar à página anterior
function voltarPagina() {
    window.history.back();
}

// Validação e envio do formulário
document.getElementById('eventoForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Coletar dados do formulário
    const formData = {
        nome: document.getElementById('nomeEvento').value,
        descricao: document.getElementById('descricao').value,
        data: document.getElementById('data').value,
        hora: document.getElementById('hora').value,
        local: document.getElementById('local').value,
        categoria: document.getElementById('categoria').value,
        vagas: document.getElementById('vagas').value
    };
    
    // Exibir dados (em produção, você enviaria para um servidor)
    console.log('Evento criado:', formData);
    
    // Mostrar mensagem de sucesso
    alert('Evento criado com sucesso! 🎉\n\n' + 
          'Nome: ' + formData.nome + '\n' +
          'Data: ' + formatarData(formData.data) + '\n' +
          'Hora: ' + formData.hora);
    
    // Redirecionar de volta para a página principal
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
});

// Função auxiliar para formatar data
function formatarData(data) {
    const partes = data.split('-');
    return partes[2] + '/' + partes[1] + '/' + partes[0];
}

// Definir data mínima como hoje
document.addEventListener('DOMContentLoaded', function() {
    const hoje = new Date().toISOString().split('T')[0];
    document.getElementById('data').setAttribute('min', hoje);
});