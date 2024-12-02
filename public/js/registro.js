// Obtener elementos
const registerLink = document.getElementById('register-link');
const registerModal = document.getElementById('register-modal');
const closeModal = document.getElementById('close-modal');


registerLink.addEventListener('click', (e) => {
    e.preventDefault(); 
    registerModal.style.display = 'flex';
});


closeModal.addEventListener('click', () => {
    registerModal.style.display = 'none';
});


window.addEventListener('click', (e) => {
    if (e.target === registerModal) {
        registerModal.style.display = 'none';
    }
});
