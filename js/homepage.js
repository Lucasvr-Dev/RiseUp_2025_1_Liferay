// Espera o documento carregar completamente
// Isso garante que todos os elementos HTML (como botões e tracks) existam antes do script tentar encontrá-los
document.addEventListener("DOMContentLoaded", () => {
      
  // Encontra todos os carrosséis da página
  const carousels = document.querySelectorAll(".carousel");

  // Configura cada carrossel individualmente
  // Isso permite que ambos "Próximos eventos" e "Cursos" funcionem de forma independente
  carousels.forEach(setupCarousel);
  tornarCardsClicaveis();
});



/**
 * Configura um único carrossel.
 * Encontra seus botões, track, slides e adiciona os eventos de clique.
 * @param {HTMLElement} carousel - O elemento principal do carrossel (com a classe .carousel)
 */
function setupCarousel(carousel) {
  const track = carousel.querySelector(".carousel-track");
  if (!track) return; // Se não houver track, não faz nada

  const viewport = carousel.querySelector(".carousel-viewport");
  const prevButton = carousel.querySelector(".carousel-arrow.prev");
  const nextButton = carousel.querySelector(".carousel-arrow.next");
  const paginationContainer = carousel.querySelector(".carousel-pagination");
  
  let slides = Array.from(track.children);
  let currentIndex = 0;
  
  // --- Cálculo de slides ---
  // Pega a largura do viewport (a área visível)
  const viewportWidth = viewport.getBoundingClientRect().width;
  // Pega a largura do primeiro card
  const slideWidth = slides[0].getBoundingClientRect().width;
  // Pega o 'gap' (espaço) entre os slides definido no CSS
  const slideGap = parseInt(getComputedStyle(track).gap) || 0;
  
  // Quantos slides cabem de uma vez? (Ex: 1200 / (370 + 30) = 3)
  const slidesPerView = Math.floor(viewportWidth / (slideWidth + slideGap)) || 1;
  
  // Número total de "páginas" ou "movimentos"
  // (Ex: 4 slides - 3 por vez = 1 movimento máximo)
  const maxIndex = slides.length - slidesPerView;

  // --- Cria os Dots de Paginação ---
  let dots = [];
  if (paginationContainer) {
    // Limpa dots existentes (caso existam)
    paginationContainer.innerHTML = ""; 
    
    // Cria um dot para cada "página" (cada movimento possível)
    for (let i = 0; i <= maxIndex; i++) {
        const dot = document.createElement("span");
        dot.classList.add("dot");
        if (i === 0) dot.classList.add("active"); // Ativa o primeiro dot
        
        // Adiciona evento de clique ao dot
        dot.addEventListener("click", () => {
            moveToSlide(i);
        });
        
        paginationContainer.appendChild(dot);
        dots.push(dot); // Armazena o dot para referência futura
    }
  }

  // --- Funções de Navegação ---
  
  /**
   * Função principal para mover o carrossel.
   * @param {number} targetIndex - O índice da "página" para a qual mover.
   */
  function moveToSlide(targetIndex) {
    // Calcula o quanto mover: (largura do slide + gap) * índice
    const moveAmount = (slideWidth + slideGap) * targetIndex;
    track.style.transform = `translateX(-${moveAmount}px)`;
    currentIndex = targetIndex;
    updateControls();
  }

  /**
   * Atualiza o estado dos botões (habilitado/desabilitado) e dos dots (ativo).
   */
  function updateControls() {
    // Habilita/desabilita botões de seta
    prevButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === maxIndex;

    // Atualiza a classe 'active' nos dots
    if (dots.length > 0) {
        dots.forEach((dot, index) => {
            dot.classList.toggle("active", index === currentIndex);
        });
    }
  }

  // --- Event Listeners (Ouvintes de Evento) ---
  
  // Ao clicar no botão "anterior"
  prevButton.addEventListener("click", () => {
    if (currentIndex > 0) {
      moveToSlide(currentIndex - 1);
    }
  });

  // Ao clicar no botão "próximo"
  nextButton.addEventListener("click", () => {
    if (currentIndex < maxIndex) {
      moveToSlide(currentIndex + 1);
    }
  });
  
  // Atualiza os controles no início para desabilitar o botão "anterior"
  updateControls();
  
   // --- Responsividade (Bônus) ---
  // Recalcula tudo se a janela for redimensionada
  // (Esta é uma versão simples. Em um projeto real, usaríamos um "debounce"
  // para não disparar essa função centenas de vezes durante o redimensionamento)
  window.addEventListener('resize', () => {
      // Recalcula larguras
      const newViewportWidth = viewport.getBoundingClientRect().width;
      const newSlideWidth = slides[0].getBoundingClientRect().width;
      const newSlideGap = parseInt(getComputedStyle(track).gap) || 0;
      
      const newSlidesPerView = Math.floor(newViewportWidth / (newSlideWidth + newSlideGap)) || 1;
      const newMaxIndex = slides.length - newSlidesPerView;
      
      // Se o número de slides visíveis mudou, precisamos recalcular
      if (newMaxIndex !== maxIndex) {
          // Idealmente, recalcularíamos os dots e o maxIndex
          // Por simplicidade, vamos apenas recarregar a página.
          // Em um app complexo, você não faria isso.
          console.warn("Layout mudou. Recarregando para recalcular carrossel.");
          location.reload(); 
          
      } else if (currentIndex > newMaxIndex) {
          // Se o índice atual agora está fora dos limites (ex: janela diminuiu)
          // move para o último slide possível
          moveToSlide(newMaxIndex);
      }
  });
  
}

function tornarCardsClicaveis() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach((card, index) => {
        // Simula IDs de eventos (em produção, viriam do backend)
        const eventoId = index + 1;
        
        // Adiciona cursor pointer
        card.style.cursor = 'pointer';
        
        // Adiciona evento de clique
        card.addEventListener('click', function() {
            window.location.href = `detalhes-evento.html?id=${eventoId}`;
        });
        
        // Adiciona efeito hover
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.transition = 'transform 0.3s';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Chama a função após carregar a página
document.addEventListener('DOMContentLoaded', () => {
    // ... código existente do carrossel ...
    
    // Adiciona funcionalidade de clique nos cards
    tornarCardsClicaveis();
});
