// Função para voltar à página anterior
function voltarPagina() {
  window.history.back();
}

// Validação e envio do formulário
document
  .getElementById("eventoForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    // Coletar dados do formulário
    const formData = {
      nome: document.getElementById("nomeEvento").value,
      descricao: document.getElementById("descricao").value,
      data: document.getElementById("data").value,
      hora: document.getElementById("hora").value,
      local: document.getElementById("local").value,
      categoria: document.getElementById("categoria").value,
      vagas: document.getElementById("vagas").value,
    };

    try {
      // Enviar dados para o back-end
      const resposta = await fetch("http://localhost:8080/api/eventos/criar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!resposta.ok) {
        throw new Error("Erro ao criar evento");
      }

      const resultado = await resposta.json();

      // Mostrar mensagem de sucesso

      window.location.href = "confirmacao.html";
    } catch (erro) {
      console.error("Erro:", erro);
      alert("Ocorreu um erro ao criar o evento. Tente novamente.");
    }
  });

// Função auxiliar para formatar data
function formatarData(data) {
  const partes = data.split("-");
  return partes[2] + "/" + partes[1] + "/" + partes[0];
}

// Definir data mínima como hoje
document.addEventListener("DOMContentLoaded", function () {
  const hoje = new Date().toISOString().split("T")[0];
  document.getElementById("data").setAttribute("min", hoje);
});
