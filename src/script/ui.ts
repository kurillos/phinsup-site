export function setupUI() {
  // Gestion des Flip Cards
  document.querySelectorAll('.flip-card-inner').forEach(card => {
    card.addEventListener('click', () => card.classList.toggle('is-flipped'));
  });

  // Gestion des Accordéons
  document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      if (targetId) {
        const content = document.getElementById(targetId);
        content?.classList.toggle('hidden');
        btn.querySelector('.icon')?.classList.toggle('rotate-180');
      }
    });
  });
}

const filterButtons = document.querySelectorAll('.filter-btn');
const playerCards = document.querySelectorAll('.player-card');

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    // 1. Gérer l'état actif des boutons
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filterValue = btn.getAttribute('data-filter');

    // 2. Filtrer les cartes
    playerCards.forEach(card => {
      const unit = card.getAttribute('data-unit');
      
      if (filterValue === 'all' || unit === filterValue) {
        card.classList.remove('hidden-filter');
      } else {
        card.classList.add('hidden-filter');
      }
    });
  });
});