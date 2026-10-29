const wsUrl = 'wss://echo.websocket.org';
const chatWindow = document.getElementById('chatWindow');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const geoBtn = document.getElementById('geoBtn');

let socket;
let waitingForGeoEcho = false;

function addMessage(text, sender, isGeoLink = false) {
    const div = document.createElement('div');
    div.classList.add('message', sender);

    if (isGeoLink) {
        div.classList.add('geo');
        div.innerHTML = text;
    } else {
        div.textContent = text;
    }

    chatWindow.appendChild(div);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function connect() {
    socket = new WebSocket(wsUrl);

    socket.addEventListener('open', () => {
        console.log('WebSocket подключён');
    });

    socket.addEventListener('message', (event) => {
        const receivedText = event.data;

        if (receivedText.includes('Request served by')) {
            return; 
        }

        if (waitingForGeoEcho) {
            waitingForGeoEcho = false;
            return;
        }

        addMessage(receivedText, 'server');
    });

    socket.addEventListener('error', (err) => {
        console.error('Ошибка WebSocket:', err);
    });

    socket.addEventListener('close', () => {
        console.log('WebSocket закрыт');
    });
}

function sendMessage() {
    const text = messageInput.value.trim();
    if (!text) return;

    addMessage(text, 'user');

    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(text);
    }

    messageInput.value = '';
}

function sendGeo() {
    if (!navigator.geolocation) {
        alert('Геолокация не поддерживается вашим браузером');
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const osmUrl = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}&zoom=16`;
            const linkHtml = `<a href="${osmUrl}" target="_blank">Моя геолокация (OpenStreetMap)</a>`;

            addMessage(linkHtml, 'user', true);

            if (socket && socket.readyState === WebSocket.OPEN) {
                waitingForGeoEcho = true;
                socket.send(`Геолокация: ${lat}, ${lon}`);
            }
        },
        (error) => {
            console.error('Ошибка геолокации:', error);
            alert('Не удалось получить геолокацию. Проверьте разрешения.');
        }
    );
}

sendBtn.addEventListener('click', sendMessage);

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

geoBtn.addEventListener('click', sendGeo);

connect();