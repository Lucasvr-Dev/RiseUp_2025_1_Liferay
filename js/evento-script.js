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

document
  .getElementById("eventoForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const dataInput = document.getElementById("data").value;
    const horaInput = document.getElementById("hora").value;

    const formData = {
      nome: document.getElementById("nomeEvento").value,
      descricao: document.getElementById("descricao").value,

      data: converterDataParaISO(dataInput),

      hora: horaInput + ":00",

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
        },
        body: JSON.stringify(formData),
      });

      if (!resposta.ok) {
        const erroDetalhado = await resposta
          .json()
          .catch(() => ({ message: resposta.statusText }));
        console.error("Erro do servidor:", erroDetalhado);
        throw new Error(
          "Falha ao criar evento. Detalhes: " + erroDetalhado.message
        );
      }

      window.location.href = "confirmacao.html";
    } catch (erro) {
      console.error("Erro na requisição:", erro);
      alert(
        "Ocorreu um erro ao criar o evento. Verifique o console do navegador para mais detalhes."
      );
    }
  });

document.addEventListener("DOMContentLoaded", function () {
  const hoje = new Date().toISOString().split("T")[0];
  document.getElementById("data").setAttribute("min", hoje);
});
