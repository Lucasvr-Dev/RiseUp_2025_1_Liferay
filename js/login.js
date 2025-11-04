document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const togglePasswordButton = document.getElementById("togglePassword");

  // ATENÇÃO: Os dados de login corretos estão aqui.
  // QUALQUER UM PODE VER ISSO NO CÓDIGO-FONTE.
  const CORRETO_LOGIN = "analuisa04@liferay.com";
  const CORRETA_SENHA = "12345678";

  const displayFeedback = (message, isError = true) => {
    // ... (Sua função de feedback está ótima, mantive igual)
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
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const username = usernameInput ? usernameInput.value.trim() : "";
      const password = passwordInput ? passwordInput.value.trim() : "";

      if (username === "" || password === "") {
        displayFeedback("Por favor, preencha o nome de usuário e a senha.", true);
        return;
      }

      // 🔥 CORREÇÃO: Verificação feita aqui no JavaScript
      if (username === CORRETO_LOGIN && password === CORRETA_SENHA) {
        
        // Se o login estiver correto, nós "fingimos" um login
        // salvando um "passe" (token) no navegador.
        localStorage.setItem("authToken", "usuario_logado_com_sucesso"); // Pode ser qualquer valor

        displayFeedback("Login bem-sucedido! Redirecionando...", false);

        setTimeout(() => {
          window.location.href = "homepage.html"; // Redireciona para a página restrita
        }, 2000);

      } else {
        // Se o login estiver errado
        displayFeedback("Nome de usuário ou senha inválidos.", true);
      }
    });
  }

  // ... (Sua função 'togglePasswordButton' está ótima, mantive igual)
  if (togglePasswordButton && passwordInput) {
    togglePasswordButton.addEventListener("click", () => {
      const type =
        passwordInput.getAttribute("type") === "password" ? "text" : "password";
      passwordInput.setAttribute("type", type);
      togglePasswordButton.textContent = type === "text" ? "🙈" : "👁";
      passwordInput.focus();
    });
  }
});