document.addEventListener('DOMContentLoaded', () => {

   
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const togglePasswordButton = document.getElementById('togglePassword'); 

    
    const displayFeedback = (message, isError = true) => {
        const feedbackElement = document.getElementById('feedbackMessage');
        if (feedbackElement) {
            feedbackElement.textContent = message;
            feedbackElement.style.color = isError ? 'red' : 'green';
            
            setTimeout(() => {
                feedbackElement.textContent = '';
            }, 3000); 
        } else {
            console.log(message);
        }
    };

    
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            
            event.preventDefault();

            const username = usernameInput ? usernameInput.value.trim() : '';
            const password = passwordInput ? passwordInput.value.trim() : '';

           
            if (username === '' || password === '') {
                displayFeedback('Por favor, preencha o nome de usuário e a senha.', true);
                
                if (username === '' && usernameInput) {
                    usernameInput.focus();
                } else if (password === '' && passwordInput) {
                    passwordInput.focus();
                }
                
                return; 
            }

           
            if (username === 'admin' && password === 'senha123') {
                 displayFeedback('Login bem-sucedido! Redirecionando...', false);
                
            } else {
                 displayFeedback('Nome de usuário ou senha inválidos.', true);
            }
        });
    }

    
    if (togglePasswordButton && passwordInput) {
        togglePasswordButton.addEventListener('click', () => {
            
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);

            
            if (type === 'text') {
                togglePasswordButton.textContent = '🙈'; 
            } else {
                togglePasswordButton.textContent = '👁'; 
            }
            
            passwordInput.focus(); 
        });
    }

    
    const googleLoginBtn = document.getElementById('googleLogin');
    const facebookLoginBtn = document.getElementById('facebookLogin');
    const linkedinLoginBtn = document.getElementById('linkedinLogin');

    
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', () => {
            
            console.log('Iniciando login com Google...');
            
            
            alert('Botão do Google clicado! (Requer configuração de back-end para funcionar)');
        });
    }
    
    if (facebookLoginBtn) {
        facebookLoginBtn.addEventListener('click', () => {
            console.log('Iniciando login com Facebook...');
            alert('Botão do Facebook clicado! (Requer configuração de back-end para funcionar)');
        });
    }

    if (linkedinLoginBtn) {
        linkedinLoginBtn.addEventListener('click', () => {
            console.log('Iniciando login com LinkedIn...');
            alert('Botão do LinkedIn clicado! (Requer configuração de back-end para funcionar)');
        });
    }
   

}); 