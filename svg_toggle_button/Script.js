const button = document.querySelector('.toggle-btn');

button.addEventListener('click', () => {
    button.classList.toggle('is-toggled');
});