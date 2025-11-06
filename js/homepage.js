// =====================
//  VERIFICAÇÃO DE SEGURANÇA E INICIALIZAÇÃO
// =====================
const token = localStorage.getItem("authToken");

// 1. ROTA PROTEGIDA: Verifica se o token existe
if (!token) {
    // Se NÃO HÁ token, não prossiga. Redireciona para o login.
    alert("Você precisa estar logado para ver esta página.");
    window.location.href = "login.html";
}

// 2. Ouve o carregamento do DOM
document.addEventListener("DOMContentLoaded", () => {
    carregarEventos();
    setupCarousels();
    setupLogout(); // Configura o botão de sair
});

// =====================
//  FUNÇÃO PARA SAIR (LOGOUT)
// =====================
function setupLogout() {
    const logoutButton = document.getElementById("logout-button");
    if (logoutButton) {
        logoutButton.addEventListener("click", (e) => {
            e.preventDefault(); // Impede o link de navegar
            localStorage.removeItem("authToken"); // Limpa o token
            alert("Você saiu da sua conta.");
            window.location.href = "login.html"; // Volta para o login
        });
    }
}

// =====================
//  FUNÇÃO PARA CARREGAR OS EVENTOS DO BACK-END
// =====================
async function carregarEventos() {
    const API_URL = "http://localhost:8080/api/eventos"; // ajuste se necessário
    const track = document.querySelector(
        '[data-carousel-id="eventos"] .carousel-track'
    );

    // Se o track não for encontrado, para a execução
    if (!track) {
        console.error("Elemento .carousel-track não encontrado.");
        return;
    }

    try {
        // 3. REQUISIÇÃO SEGURA: Enviando o token no cabeçalho
        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                // Envia o token para o back-end
                "Authorization": "Bearer " + token 
            }
        });

        // 4. TRATAMENTO DE ERRO DE AUTENTICAÇÃO
        if (response.status === 401 || response.status === 403) {
            // Token inválido ou expirado
            alert("Sua sessão expirou. Faça login novamente.");
            localStorage.removeItem("authToken"); // Limpa o token inválido
            window.location.href = "login.html"; // Manda para o login
            return;
        }

        if (!response.ok) {
            throw new Error("Erro ao buscar eventos.");
        }

        const eventos = await response.json(); 

        track.innerHTML = ""; // Limpa os cards fixos existentes

        if (eventos.length === 0) {
            const aviso = document.createElement("p");
            aviso.textContent = "Nenhum evento disponível no momento.";
            aviso.style.textAlign = "center";
            aviso.style.color = "#555";
            track.appendChild(aviso);
            return;
        } 

        // Cria um card para cada evento do banco
        eventos.forEach((evento) => {
            const card = document.createElement("div");
            card.classList.add("card"); 

            const img = document.createElement("img");
            img.src = "assets/pictures/liferay-devcon.jpg"; // Ajuste para evento.imagemUrl se tiver
            img.alt = evento.nome || "Evento Liferay"; 

            // 1. Título do evento (H3)
            const h3 = document.createElement("h3");
            // 2. O Link (A) que vai DENTRO do H3
            const linkNome = document.createElement("a");
            linkNome.href = `/detalhes-evento.html?id=${evento.id}`;
            linkNome.textContent = evento.nome || "Evento sem nome"; 
            linkNome.style.color = "inherit";
            linkNome.style.textDecoration = "none"; 
            h3.appendChild(linkNome); 

            // 3. Data do evento (P)
            const data = document.createElement("p");
            // Formata a data para ficar mais legível (ex: 20/12/2025)
            if (evento.data) {
                const dataFormatada = new Date(evento.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
                data.textContent = dataFormatada;
            }

            // 4. Descrição do evento (P)
            const descricao = document.createElement("p");
            // Limita a descrição para não quebrar o card
            if (evento.descricao) {
                descricao.textContent = evento.descricao.substring(0, 100) + (evento.descricao.length > 100 ? "..." : "");
            }

            // Monta o card
            card.appendChild(img);
            card.appendChild(h3); 
            card.appendChild(data); 
            card.appendChild(descricao); 

            // Adiciona o card ao carrossel
            track.appendChild(card);
        }); 

        // Reconfigura o carrossel após adicionar os cards
        setupCarousels();

    } catch (error) {
        console.error("Erro ao carregar eventos:", error); 
        track.innerHTML = ""; // Limpa o track
        const erroMsg = document.createElement("p");
        erroMsg.textContent =
            "Não foi possível carregar os eventos. Tente novamente mais tarde.";
        erroMsg.style.textAlign = "center";
        erroMsg.style.color = "red";
        track.appendChild(erroMsg);
    }
}

// =====================
//  CONFIGURAÇÃO DO CARROSSEL
// =====================
function setupCarousels() {
    const carousels = document.querySelectorAll(".carousel");

    carousels.forEach((carousel) => {
        const track = carousel.querySelector(".carousel-track");
        const prevButton = carousel.querySelector(".carousel-arrow.prev");
        const nextButton = carousel.querySelector(".carousel-arrow.next");

        if (!track || !prevButton || !nextButton) {
            return;
        }

        let index = 0;
        const cards = carousel.querySelectorAll(".card");
        const totalCards = cards.length;
        
        // Se não há cards, esconde os botões e para
        if (totalCards === 0) {
            prevButton.style.display = "none";
            nextButton.style.display = "none";
            return;
        }

        // Calcula quantos cards são visíveis
        // Isso é uma aproximação, um CSS mais robusto lidaria com isso
        const visibleCards = 3; 

        prevButton.style.display = "block";
        nextButton.style.display = "block";

        function updateCarousel() {
            // Pega a largura do card (incluindo margem)
            if (cards.length === 0) return; // Não faz nada se não há cards
            
            const cardStyle = getComputedStyle(cards[0]);
            const cardWidth = cards[0].offsetWidth + parseInt(cardStyle.marginRight) + parseInt(cardStyle.marginLeft);
            
            if (cardWidth === 0) return; 

            track.style.transform = `translateX(-${index * cardWidth}px)`;

            // Habilita/desabilita botões
            prevButton.disabled = index === 0;
            nextButton.disabled = index >= totalCards - visibleCards;
        }

        // Remove listeners antigos para evitar duplicação
        const newPrevButton = prevButton.cloneNode(true);
        const newNextButton = nextButton.cloneNode(true);
        prevButton.parentNode.replaceChild(newPrevButton, prevButton);
        nextButton.parentNode.replaceChild(newNextButton, nextButton);

        newPrevButton.addEventListener("click", () => {
            index = Math.max(index - 1, 0);
            updateCarousel();
        });

        newNextButton.addEventListener("click", () => {
            index = Math.min(index + 1, Math.max(0, totalCards - visibleCards));
            updateCarousel();
        });

        updateCarousel();
        window.addEventListener("resize", updateCarousel);
    });
}