const button = document.querySelector('.size-btn');

button.addEventListener('click', () => {
    alert(
        `Окно: ${window.innerWidth} x ${window.innerHeight}\n` +
        `Экран: ${screen.width} x ${screen.height}`
    );
});