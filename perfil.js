// Mapeamento de ícones por habilidade
const skillIcons = {
  javascript: '<i class="fab fa-js-square" style="color:#f7df1e;"></i>',
  react: '<i class="fab fa-react" style="color:#61dafb;"></i>',
  "next.js": '<i class="fa-brands fa-react" style="color:#000;"></i>',
  python: '<i class="fab fa-python" style="color:#3776ab;"></i>',
  java: '<i class="fab fa-java" style="color:#f89820;"></i>',
  html: '<i class="fab fa-html5" style="color:#e34c26;"></i>',
  css: '<i class="fab fa-css3-alt" style="color:#264de4;"></i>',
  "node.js": '<i class="fab fa-node-js" style="color:#3c873a;"></i>',
  git: '<i class="fab fa-git-alt" style="color:#f1502f;"></i>',
  github: '<i class="fab fa-github"></i>',
  typescript: '<i class="fab fa-js" style="color:#3178c6;"></i>',
  "c++": '<i class="fab fa-cuttlefish" style="color:#00599C;"></i>',
  "c#": '<i class="fas fa-hashtag" style="color:#68217a;"></i>',
  php: '<i class="fab fa-php" style="color:#777bb3;"></i>',
  sql: '<i class="fas fa-database" style="color:#4479A1;"></i>',
};

// Seletores principais
const addSkillBtn = document.getElementById("add-skill-btn");
const skillInput = document.getElementById("skill-input");
const skillsList = document.getElementById("skills-list");

// Estado inicial (habilidades base, se quiser adicionar)
const initialSkills = ["React", "Next.js", "JavaScript", "Python"];

// Funções principais

// Cria visualmente uma skill com ícone e botão de excluir
function createSkillElement(skillName) {
  const skillKey = skillName.toLowerCase();
  const iconHTML =
    skillIcons[skillKey] ||
    '<i class="fas fa-code" style="color:#00318f;"></i>';

  const skillItem = document.createElement("div");
  skillItem.classList.add("skill-item");
  skillItem.innerHTML = `
    <div class="skill-pill">
      ${iconHTML}
      <span>${skillName}</span>
      <button class="delete-skill-btn" title="Remover"><i class="fas fa-times"></i></button>
    </div>
  `;

  // Evento para remover
  skillItem.querySelector(".delete-skill-btn").addEventListener("click", () => {
    skillItem.classList.add("fade-out");
    setTimeout(() => skillItem.remove(), 250);
  });

  return skillItem;
}

// Adiciona nova habilidade
function addSkill() {
  const skillName = skillInput.value.trim();
  if (skillName === "") return;

  const newSkill = createSkillElement(skillName);
  newSkill.classList.add("fade-in");
  skillsList.appendChild(newSkill);
  skillInput.value = "";
}

// Eventos

addSkillBtn.addEventListener("click", addSkill);

// Permitir adicionar com Enter
skillInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    addSkill();
  }
});

// Inicialização

window.addEventListener("DOMContentLoaded", () => {
  initialSkills.forEach((skill) => {
    const skillElement = createSkillElement(skill);
    skillsList.appendChild(skillElement);
  });
});
