// =====================
// (NOVO) 1. VERIFICAÇÃO DE SEGURANÇA (ROTA PROTEGIDA)
// =====================
// Pega o token salvo no login
const token = localStorage.getItem("authToken");
if (!token) {
    // Se NÃO HÁ token, não prossiga.
    // Redireciona para a tela de login.
    alert("Você precisa estar logado para criar um evento.");
    window.location.href = "login.html";
}


// =====================
// FUNÇÕES HELPERS (sem alteração)
// =====================
function voltarPagina() {
  window.history.back();
}

function converterDataParaISO(dataString) {
  if (!dataString) return null;
  const partes = dataString.split("/");
  if (partes.length === 3) {
    return `${partes[2]}-${partes[1]}-${partes[0]}`;
  }
  return dataString;
}

// =====================
// LISTENER DO FORMULÁRIO (com alterações)
// =====================
document
  .getElementById("eventoForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    // Coleta dos dados (sem alteração)
    const dataInput = document.getElementById("data").value;
    const horaInput = document.getElementById("hora").value;

    const formData = {
      nome: document.getElementById("nomeEvento").value,
      descricao: document.getElementById("descricao").value,
      data: converterDataParaISO(dataInput),
      hora: horaInput ? horaInput + ":00" : null, // Adicionado um check para hora vazia
      local: document.getElementById("local").value,
      categoria: document.getElementById("categoria").value,
      vagas: document.getElementById("vagas").value
        ? parseInt(document.getElementById("vagas").value)
        : null,
    };

    console.log("Dados enviados (JSON):", formData);

    try {
      const resposta = await fetch("http://localhost:8080/api/eventos/criar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // =====================
          // (ALTERADO) 2. ENVIO DO TOKEN
          // Esta é a linha mais importante.
          // =====================
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify(formData),
      });

      // =====================
      // (ALTERADO) 3. MELHORIA NO TRATAMENTO DE ERRO
      // =====================
      if (resposta.ok) { // Status 200-299
        // Sucesso
        window.location.href = "confirmacao.html";

      } else if (resposta.status === 401 || resposta.status === 403) {
        // Erro de autenticação (token expirou ou é inválido)
        alert("Sua sessão expirou. Faça login novamente.");
        localStorage.removeItem("authToken"); // Limpa o token inválido
        window.location.href = "login.html"; // Manda para o login

      } else {
        // Outros erros (ex: 400 - Bad Request, 500 - Server Error)
        const erroDetalhado = await resposta
          .json()
          .catch(() => ({ message: resposta.statusText }));
        console.error("Erro do servidor:", erroDetalhado);
        throw new Error(
          "Falha ao criar evento. Detalhes: " + (erroDetalhado.message || "Erro desconhecido")
        );
      }

    } catch (erro) {
      console.error("Erro na requisição:", erro);
      alert(
        "Ocorreu um erro ao criar o evento. Verifique o console do navegador para mais detalhes."
      );
    }
  });

// =====================
// CONFIGURAÇÃO DA DATA MÍNIMA (sem alteração)
// =====================
document.addEventListener("DOMContentLoaded", function () {
  const hoje = new Date().toISOString().split("T")[0];
  document.getElementById("data").setAttribute("min", hoje);
});