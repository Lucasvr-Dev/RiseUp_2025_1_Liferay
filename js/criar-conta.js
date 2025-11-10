document.addEventListener("DOMContentLoaded", () => {
    
    // Seletores DOM
    const registerForm = document.getElementById("register-form");
    const messageDiv = document.getElementById("message");
    const submitButton = document.getElementById("submit-button");
    // const fileInput foi removido

    // setupPhotoPreview() foi removido
    
    // Configura o formulário para submissão
    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        messageDiv.textContent = "";
        messageDiv.className = "";
        submitButton.disabled = true; 
        submitButton.textContent = "Criando conta...";

        // --- 1. COLETA DE TODOS OS DADOS ---
        const nomeUsuario = document.getElementById("nomeUsuario").value;
        const email = document.getElementById("email").value;
        const senha = document.getElementById("senha").value;
        const nomeCompleto = document.getElementById("nomeCompleto").value;
        const titulo = document.getElementById("titulo").value;
        const sobreMim = document.getElementById("sobreMim").value;
        const habilidadesString = document.getElementById("habilidades").value; 
        
        
        // --- 2. PREPARAR O DTO (Apenas JSON) ---
        const registerDto = {
            nomeUsuario: nomeUsuario,
            email: email,
            senha: senha,
            nomeCompleto: nomeCompleto,
            titulo: titulo,
            sobreMim: sobreMim,
            habilidades: habilidadesString.split(',').map(s => s.trim()).filter(s => s.length > 0) 
        };

        // --- 3. FAZER A REQUISIÇÃO (Apenas JSON) ---
        try {
            const response = await fetch("http://localhost:8080/api/auth/register", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json' // Definimos o Content-Type como JSON
                },
                body: JSON.stringify(registerDto) // Enviamos o JSON diretamente
            });

            // --- 4. TRATAMENTO DE SUCESSO (COM LOGIN AUTOMÁTICO) ---
            if (response.ok) {
                const loginData = await response.json(); 
                
                localStorage.setItem("authToken", loginData.token);
                
                messageDiv.textContent = "Conta criada com sucesso! Redirecionando...";
                messageDiv.className = "success";
                
                setTimeout(() => {
                    window.location.href = "homepage.html"; 
                }, 2000);

            } else {
                // Trata erros do servidor
                const responseData = await response.text();
                let errorMessage = "Ocorreu um erro desconhecido no servidor.";
                
                try {
                    const errorJson = JSON.parse(responseData);
                    errorMessage = errorJson.erro || errorMessage;
                } catch (e) {
                    errorMessage = responseData; 
                }

                messageDiv.textContent = errorMessage;
                messageDiv.className = "error";
            }
        } catch (error) {
            console.error("Erro de rede:", error);
            messageDiv.textContent = "Erro de conexão. Verifique se o servidor está rodando.";
            messageDiv.className = "error";
        } finally {
             submitButton.disabled = false;
             submitButton.textContent = "Criar Conta";
        }
    });
});