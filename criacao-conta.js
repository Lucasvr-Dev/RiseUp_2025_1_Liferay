document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("registerForm");
    const passwordInput = document.getElementById("password");
    const togglePassword = document.getElementById("togglePassword");
    const reqLength = document.getElementById("reqLength"); // Requisito de 8 caracteres
    const emailInput = document.getElementById("email");
    const submitButton = registerForm.querySelector('.btn-primary');

    // Inicializa o botão de submissão como desabilitado
    submitButton.disabled = true;

    // --- Funcionalidade de Mostrar/Esconder Senha ---
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener("click", () => {
            const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
            passwordInput.setAttribute("type", type);
            // Altera o ícone. Você pode usar Font Awesome para ícones melhores.
            togglePassword.textContent = type === "password" ? "👁" : "🙈";
        });
    }

    // --- Validação de Requisitos da Senha ---
    if (passwordInput) {
        passwordInput.addEventListener("keyup", updatePasswordRequirements);
        passwordInput.addEventListener("input", updatePasswordRequirements); // Garante que detecte paste também
    }

    function updatePasswordRequirements() {
        const password = passwordInput.value;
        let allRequirementsMet = true; // Assume que todos estão metidos inicialmente

        // Requisito: mínimo de 8 caracteres
        if (password.length >= 8) {
            reqLength.classList.add("active");
        } else {
            reqLength.classList.remove("active");
            allRequirementsMet = false; // Se um requisito falha, muda para false
        }
        
        // Desabilita o botão de submit se nem todos os requisitos forem atendidos
        submitButton.disabled = !allRequirementsMet;

        // Opcional: Adicione mais requisitos aqui (números, maiúsculas, etc.)
        // Ex:
        // const hasNumber = /[0-9]/.test(password);
        // const hasUpper = /[A-Z]/.test(password);
        // if (hasNumber && hasUpper) { /* ... */ }
    }

    // --- Validação do E-mail e Estilo de Erro ---
    if (emailInput) {
        emailInput.addEventListener("input", () => {
            if (emailInput.value.includes('@') && emailInput.value.includes('.')) {
                emailInput.classList.remove("input-error");
            } else {
                // Não adiciona erro imediatamente, espera o blur ou submit
                // emailInput.classList.add("input-error"); 
            }
        });

        emailInput.addEventListener("blur", () => {
            if (emailInput.value && (!emailInput.value.includes('@') || !emailInput.value.includes('.'))) {
                emailInput.classList.add("input-error");
            } else {
                emailInput.classList.remove("input-error");
            }
        });
    }


    // --- Lógica de Envio do Formulário ---
    if (registerForm) {
        registerForm.addEventListener("submit", (event) => {
            event.preventDefault(); // Previne o envio padrão do formulário

            // Verificações finais antes do envio (poderia ser mais robusto)
            if (!emailInput.value || !passwordInput.value || !document.getElementById("nome").value || !document.getElementById("sobrenome").value) {
                alert("Por favor, preencha todos os campos.");
                return;
            }

            if (passwordInput.value.length < 8) {
                alert("A senha deve ter no mínimo 8 caracteres.");
                return;
            }
            
            // Se tudo estiver OK, você faria uma requisição AJAX ou redirecionaria
            alert("Cadastro realizado com sucesso! (Funcionalidade de envio não implementada)");
            // Exemplo de redirecionamento (descomente se for usar):
            // window.location.href = "sua-pagina-de-sucesso.html";
        });
    }

    // Chama a função de requisitos ao carregar para o estado inicial do botão
    updatePasswordRequirements();
});