document.addEventListener('DOMContentLoaded', () => {
    const userInput = document.getElementById('userInput');
    const checkButton = document.getElementById('checkButton');
    const messageDisplay = document.getElementById('message');

    // Tu nuevo backend en SmartASP
    const BACKEND_URL = 'https://luiscarrillo7-001-site2.jtempurl.com';

    checkButton.addEventListener('click', async () => {
        const valor = userInput.value.trim();

        if (!valor) {
            messageDisplay.textContent = 'Por favor, ingresa un DNI.';
            messageDisplay.className = 'message-error';
            return;
        }

        messageDisplay.textContent = 'Verificando...';
        messageDisplay.className = '';
        checkButton.disabled = true;

        try {
            // Llamada a tu API con GET
            const response = await fetch(`${BACKEND_URL}/leer-sheet/${valor}`);

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const data = await response.json();

            if (data && data.length > 0) {
                const usuario = data[0]; // primer resultado encontrado

                messageDisplay.innerHTML = `
                    <p class="message-success">¡Usuario encontrado!</p>
                    <p class="message-detail"><strong>ID:</strong> <span>${usuario.ID || ''}</span></p>
                    <p class="message-detail"><strong>Nombre:</strong> <span>${usuario.NOMBRE || ''}</span></p>
                    <p class="message-detail"><strong>Cargo:</strong> <span>${usuario.CARGO || ''}</span></p>
                    <p class="message-detail"><strong>EESS:</strong> <span>${usuario.EESS || ''}</span></p>
                    <p class="message-detail"><strong>RIS:</strong> <span>${usuario.RIS || ''}</span></p>
                    <p class="message-detail"><strong>Horas:</strong> <span>${usuario.HORAS || ''}</span></p>
                    <p class="message-detail"><strong>Puntaje:</strong> <span>${usuario.PUNTAJE || ''}</span></p>
                `;
                messageDisplay.className = 'message-container';
            } else {
                messageDisplay.textContent = 'Usuario no encontrado.';
                messageDisplay.className = 'message-error';
            }

        } catch (error) {
            console.error('Error al comunicarse con el backend:', error);
            messageDisplay.textContent = 'Error de conexión. Verifica tu API.';
            messageDisplay.className = 'message-error';
        } finally {
            checkButton.disabled = false;
        }
    });
});
