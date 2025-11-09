document.addEventListener("DOMContentLoaded", () => {
    
    const registerForm = document.getElementById("register-form");
    const messageDiv = document.getElementById("message");
    const submitButton = document.getElementById("submit-button");

    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        messageDiv.textContent = "";
        messageDiv.className = "";
        submitButton.disabled = true; 

        const nomeUsuario = document.getElementById("nomeUsuario").value;
        const email = document.getElementById("email").value;
        const senha = document.getElementById("senha").value;

        const data = {
            nomeUsuario: nomeUsuario,
            email: email,
            senha: senha
        };

        try {
            const response = await fetch("http://localhost:8080/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                messageDiv.textContent = "Conta criada com sucesso! Redirecionando para o login...";
                messageDiv.className = "success";
                
                setTimeout(() => {
                    window.location.href = "login.html";
                }, 2000);

            } else {
                const errorText = await response.text();
                messageDiv.textContent = errorText;
                messageDiv.className = "error";
                submitButton.disabled = false;
            }
        } catch (error) {
            console.error("Erro de rede:", error);
            messageDiv.textContent = "Erro de conexão. O back-end está rodando?";
            messageDiv.className = "error";
            submitButton.disabled = false;
        }
    });
});