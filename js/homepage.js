document.addEventListener("DOMContentLoaded", () => {
  carregarEventos();
  setupCarousels();
});

// =====================
//  FUNÇÃO PARA CARREGAR OS EVENTOS DO BACK-END
// =====================
async function carregarEventos() {
  const API_URL = "http://localhost:8080/api/eventos"; // ajuste se necessário
  const track = document.querySelector('[data-carousel-id="eventos"] .carousel-track');

  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Erro ao buscar eventos.");

    const eventos = await response.json();

    // Limpa os cards fixos existentes
    track.innerHTML = "";

    // Se não houver eventos cadastrados
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

      // Imagem padrão
      const img = document.createElement("img");
      img.src = "/assets/pictures/liferay-devcon.jpg"; // Você pode mudar para evento.imagem se tiver no banco
      img.alt = evento.nome || "Evento Liferay";

      // ==========================================
      // ========= INÍCIO DA MODIFICAÇÃO ========
      // ==========================================

      // 1. Título do evento (H3)
      const h3 = document.createElement("h3");
    
      // 2. O Link (A) que vai DENTRO do H3
      const linkNome = document.createElement("a");
      
      // Linka para a página de detalhes com o ID do evento
      // (Certifique-se que seu 'evento' tem a propriedade 'id')
      linkNome.href = `/detalhes-evento.html?id=${evento.id}`; 
      
      linkNome.textContent = evento.nome || "Evento sem nome";
      
      // Estilo para o link não ficar azul e sublinhado
      linkNome.style.color = "inherit";
      linkNome.style.textDecoration = "none";
      
      // Coloca o link <a> dentro do <h3>
      h3.appendChild(linkNome);

      // 3. Data do evento (P)
      const data = document.createElement("p");
      // Você pode querer formatar essa data
      data.textContent = evento.data || ""; 

      // 4. Descrição do evento (P)
      const descricao = document.createElement("p");
      descricao.textContent = evento.descricao || "";

      // Monta o card
      card.appendChild(img);
      card.appendChild(h3);       // Adiciona <h3><a>Nome</a></h3>
      card.appendChild(data);     // Adiciona <p>Data</p>
      card.appendChild(descricao); // Adiciona <p>Descrição</p>

      // ==========================================
      // =========== FIM DA MODIFICAÇÃO ===========
      // ==========================================
      
      // Adiciona o card ao carrossel
      track.appendChild(card);
    });

    // Reconfigura o carrossel após adicionar os cards
    setupCarousels();
  } catch (error) {
    console.error("Erro ao carregar eventos:", error);
    
    // Adiciona uma mensagem de erro visual para o usuário
    track.innerHTML = ""; // Limpa o track
    const erroMsg = document.createElement("p");
    erroMsg.textContent = "Não foi possível carregar os eventos. Tente novamente mais tarde.";
    erroMsg.style.textAlign = "center";
    erroMsg.style.color = "red";
    track.appendChild(erroMsg);
  }
}

// =====================
//  CONFIGURAÇÃO DO CARROSSEL
// =====================
function setupCarousels() {
  const carousels = document.querySelectorAll(".carousel");

  carousels.forEach((carousel) => {
    const track = carousel.querySelector(".carousel-track");
    const prevButton = carousel.querySelector(".carousel-arrow.prev");
    const nextButton = carousel.querySelector(".carousel-arrow.next");
    
    // Se não houver track ou botões, não faz nada
    if (!track || !prevButton || !nextButton) {
        return;
    }

    let index = 0;
    const cards = carousel.querySelectorAll(".card");
    const totalCards = cards.length;
    const visibleCards = 3; // quantos aparecem por vez

    // Se não há cards, não há o que configurar
    if (totalCards === 0) {
        // Você pode querer esconder os botões se não houver cards
        prevButton.style.display = 'none';
        nextButton.style.display = 'none';
        return;
    } else {
        // Garante que os botões apareçam se os cards foram carregados
        prevButton.style.display = 'block';
        nextButton.style.display = 'block';
    }

    function updateCarousel() {
      // Pega a largura do card (incluindo margem)
      const cardWidth = cards[0].offsetWidth + (parseInt(getComputedStyle(cards[0]).marginRight) || 0);
      
      if (cardWidth === 0) return; // Evita divisão por zero ou erros de cálculo

      track.style.transform = `translateX(-${index * cardWidth}px)`;

      // Habilita/desabilita botões
      prevButton.disabled = index === 0;
      nextButton.disabled = index >= totalCards - visibleCards;
    }

    // Remove listeners antigos para evitar duplicação
    // Esta é uma forma simples; uma abordagem mais robusta usaria .removeEventListener
    // com a função exata, mas para este caso, clonar o nó funciona.
    const newPrevButton = prevButton.cloneNode(true);
    const newNextButton = nextButton.cloneNode(true);
    prevButton.parentNode.replaceChild(newPrevButton, prevButton);
    nextButton.parentNode.replaceChild(newNextButton, nextButton);


    newPrevButton.addEventListener("click", () => {
      index = Math.max(index - 1, 0);
      updateCarousel();
    });

    newNextButton.addEventListener("click", () => {
        // Garante que não ultrapasse o limite
      index = Math.min(index + 1, Math.max(0, totalCards - visibleCards)); 
      updateCarousel();
    });

    // Atualiza o carrossel no início
    updateCarousel();
    
    // Adiciona um listener para redimensionar a tela (importante para responsividade)
    window.addEventListener('resize', updateCarousel);
  });
}