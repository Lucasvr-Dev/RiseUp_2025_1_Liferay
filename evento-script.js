// Função para voltar à página anterior
function voltarPagina() {
    window.history.back();
}

// Validação e envio do formulário
document.getElementById('eventoForm').addEventListener('submit', async function(e) {
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

    try {
        // Enviar dados para o back-end
        const resposta = await fetch("http://localhost:8080/api/eventos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        if (!resposta.ok) {
            throw new Error("Erro ao criar evento");
        }

        const resultado = await resposta.json();

        // Mostrar mensagem de sucesso
        alert('Evento criado com sucesso! 🎉\n\n' + 
              'Nome: ' + resultado.nome + '\n' +
              'Data: ' + formatarData(resultado.data) + '\n' +
              'Hora: ' + resultado.hora);

        // Redirecionar de volta para a página principal
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);

    } catch (erro) {
        console.error("Erro:", erro);
        alert("Ocorreu um erro ao criar o evento. Tente novamente.");
    }
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
