// Add new skill
function addSkill() {
    const input = document.getElementById('skillInput');
    const skillName = input.value.trim();
    
    if (skillName === '') {
        alert('Por favor, digite o nome da habilidade!');
        return;
    }

    const skillsList = document.getElementById('skillsList');
    const skillBadge = document.createElement('div');
    skillBadge.className = 'skill-badge';
    
    // Get first letter for icon (fallback se não tiver imagem)
    const firstLetter = skillName.charAt(0).toUpperCase();
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
    
    skillBadge.innerHTML = `
        <div class="skill-icon" style="background: ${randomColor}; color: white;">${firstLetter}</div>
        <span>${skillName}</span>
        <button class="delete-btn" onclick="removeSkill(this)">×</button>
    `;
    
    skillsList.appendChild(skillBadge);
    input.value = '';
    
    // Animation
    skillBadge.style.opacity = '0';
    skillBadge.style.transform = 'scale(0.8)';
    setTimeout(() => {
        skillBadge.style.transition = 'all 0.3s';
        skillBadge.style.opacity = '1';
        skillBadge.style.transform = 'scale(1)';
    }, 10);
}

// Remove skill
function removeSkill(button) {
    const skillBadge = button.parentElement;
    skillBadge.style.transition = 'all 0.3s';
    skillBadge.style.opacity = '0';
    skillBadge.style.transform = 'scale(0.8)';
    setTimeout(() => {
        skillBadge.remove();
    }, 300);
}

// Create event
function goToEvent() {
    window.location.href = 'criar-evento.html';
}

// Add skill on Enter key
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('skillInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addSkill();
        }
    });
});