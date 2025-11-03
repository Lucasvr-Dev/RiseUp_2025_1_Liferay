document.addEventListener("DOMContentLoaded", () => {
  carregarEventos();
  setupCarousels();
});

// =====================
//  FUNÇÃO PARA CARREGAR OS EVENTOS DO BACK-END
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
      img.src = "/assets/pictures/liferay-devcon.jpg";
      img.alt = evento.nome || "Evento Liferay";

      // Título do evento
      const h3 = document.createElement("h3");
      h3.innerHTML = `
        ${evento.nome || "Evento sem nome"}<br>
        ${evento.data || ""}<br>
        ${evento.descricao || ""}
      `;

      // Monta o card
      card.appendChild(img);
      card.appendChild(h3);

      // Adiciona o card ao carrossel
      track.appendChild(card);
    });

    // Reconfigura o carrossel
    setupCarousels();
  } catch (error) {
    console.error("Erro ao carregar eventos:", error);
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

    let index = 0;
    const cards = carousel.querySelectorAll(".card");
    const totalCards = cards.length;
    const visibleCards = 3; // quantos aparecem por vez

    function updateCarousel() {
      const cardWidth = cards[0]?.offsetWidth || 0;
      track.style.transform = `translateX(-${index * cardWidth}px)`;
    }

    prevButton.addEventListener("click", () => {
      index = Math.max(index - 1, 0);
      updateCarousel();
    });

    nextButton.addEventListener("click", () => {
      index = Math.min(index + 1, totalCards - visibleCards);
      updateCarousel();
    });
  });
}
