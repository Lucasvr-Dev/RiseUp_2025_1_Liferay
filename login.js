document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const togglePasswordButton = document.getElementById("togglePassword");

  const displayFeedback = (message, isError = true) => {
    const feedbackElement = document.getElementById("feedbackMessage");
    if (feedbackElement) {
      feedbackElement.textContent = message;
      feedbackElement.style.color = isError ? "red" : "green";

      setTimeout(() => {
        feedbackElement.textContent = "";
      }, 3000);
    } else {
      console.log(message);
    }
  };

  if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const username = usernameInput ? usernameInput.value.trim() : "";
      const password = passwordInput ? passwordInput.value.trim() : "";

      if (username === "" || password === "") {
        displayFeedback("Por favor, preencha o nome de usuário e a senha.", true);
        return;
      }

      try {
        // 🔥 Envia o login e senha para o back-end
        const response = await fetch("http://localhost:8080/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            login: username, // campo 'login' do LoginRequest (pode ser nome ou e-mail)
            senha: password
          })
        });

        const resultado = await response.text();

        if (resultado.includes("sucesso")) {
          displayFeedback("Login bem-sucedido! Redirecionando...", false);

          // Redireciona após 2 segundos
          setTimeout(() => {
            window.location.href = "eventos.html"; // ou sua página principal
          }, 2000);
        } else {
          displayFeedback("Nome de usuário ou senha inválidos.", true);
        }
      } catch (error) {
        console.error("Erro ao conectar com o servidor:", error);
        displayFeedback("Erro de conexão com o servidor.", true);
      }
    });
  }

  // 👁 Alternar visibilidade da senha
  if (togglePasswordButton && passwordInput) {
    togglePasswordButton.addEventListener("click", () => {
      const type =
        passwordInput.getAttribute("type") === "password" ? "text" : "password";
      passwordInput.setAttribute("type", type);

      togglePasswordButton.textContent = type === "text" ? "🙈" : "👁";
      passwordInput.focus();
    });
  }

  // (Opcional) Ir para a home
  function goToHome() {
    window.location.href = "homepage.html";
  }
});
