// Espera o documento carregar completamente
document.addEventListener("DOMContentLoaded", () => {
  
  // Seleciona os elementos principais
  const skillInput = document.getElementById("skill-input");
  const addSkillBtn = document.getElementById("add-skill-btn");
  const skillsList = document.getElementById("skills-list");

  // Habilidades iniciais baseadas na imagem
  const initialSkills = ["Next.js", "React", "Javascript"];

  // --- Funções ---

  /**
   * Cria um elemento de habilidade (pill + botão de deletar)
   * @param {string} name - O nome da habilidade
   * @returns {HTMLElement} - O elemento <div> com a classe 'skill-item'
   */
  function createSkillElement(name) {
    // Cria o container principal
    const item = document.createElement("div");
    item.className = "skill-item";

    // Cria o "pill" da habilidade
    const pill = document.createElement("div");
    pill.className = "skill-pill";

    let icon = '';
    const nameLower = name.toLowerCase();

    // Adiciona ícones com base no nome (simulando a imagem)
    if (nameLower.includes("react")) {
      // Ícone do React
      icon = '<i class="fab fa-react"></i>';
    } else if (nameLower.includes("javascript")) {
      // Ícone do JavaScript
      icon = '<i class="fab fa-js-square"></i>';
    } else if (nameLower.includes("next")) {
      // Simulação do logo Next.js
      icon = '<strong class="next-logo">N</strong>';
    }
    
    // Define o conteúdo do pill
    pill.innerHTML = `${icon} <span>${name}</span>`;

    // Cria o botão de deletar (lixeira)
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-skill-btn";
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.setAttribute('aria-label', `Remover ${name}`);

    // Adiciona o evento de clique para remover o item
    deleteBtn.addEventListener("click", () => {
      // Remove o 'skill-item' (pai do botão)
      item.remove(); 
    });

    // Monta o elemento
    item.appendChild(pill);
    item.appendChild(deleteBtn);

    return item;
  }

  /**
   * Pega o valor do input, cria um novo elemento de habilidade e o adiciona à lista
   */
  function addSkill() {
    const skillName = skillInput.value.trim(); // Pega o valor e remove espaços em branco

    // Se o campo não estiver vazio
    if (skillName !== "") {
      const newSkill = createSkillElement(skillName); // Cria o novo elemento
      skillsList.appendChild(newSkill); // Adiciona à lista
      skillInput.value = ""; // Limpa o campo de input
      skillInput.focus(); // Devolve o foco ao input
    }
  }

  // --- Inicialização ---

  // 1. Carrega as habilidades iniciais
  initialSkills.forEach(skill => {
    const skillElement = createSkillElement(skill);
    skillsList.appendChild(skillElement);
  });

  // 2. Adiciona os "ouvintes" de evento
  
  // Ao clicar no botão "Adicionar"
  addSkillBtn.addEventListener("click", addSkill);

  // Ao pressionar "Enter" no campo de input
  skillInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Impede o envio de formulário (caso esteja dentro de um <form>)
      addSkill();
    }
  });

});
