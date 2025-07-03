document.addEventListener('DOMContentLoaded', () => {
    const userInput = document.getElementById('userInput');
    const checkButton = document.getElementById('checkButton');
    const messageDisplay = document.getElementById('message');

    const BACKEND_URL = 'https://my-google-sheets-backend.onrender.com';

    // Este log se ejecuta cuando el DOM está completamente cargado.
    console.log('Frontend: DOM cargado. Script listo.');

    checkButton.addEventListener('click', async () => {
        // Este log se ejecuta cuando se hace clic en el botón.
        console.log('Frontend: Botón "Consultar" clicado.');

        const valor = userInput.value.trim();

        // Este log muestra el valor que se va a enviar.
        console.log('Frontend: Valor a enviar al backend:', valor);

        if (!valor) {
            messageDisplay.textContent = 'Por favor, ingresa un número de usuario.';
            messageDisplay.className = 'message-error';
            console.log('Frontend: Valor vacío. Mostrando mensaje de error.');
            return;
        }

        messageDisplay.textContent = 'Verificando...';
        messageDisplay.className = '';
        checkButton.disabled = true;
        console.log('Frontend: Iniciando verificación con el backend...');

        try {
            const response = await fetch(`${BACKEND_URL}/api/check-user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ valor: valor }),
            });

            // Este log muestra el estado de la respuesta de la red.
            console.log('Frontend: Respuesta del backend recibida. Estado HTTP:', response.status);

            const data = await response.json();

            // Este log muestra los datos completos recibidos del backend.
            console.log('Frontend: Datos parseados del backend:', data);

            if (response.ok) {
                if (data.exists) {
                    messageDisplay.innerHTML = `
                        <p class="message-success">¡Bienvenido!</p>
                        <p class="message-detail"><strong>ID:</strong> <span>${data.idUsuario}</span></p>
                        <p class="message-detail"><strong>Nombre:</strong> <span>${data.nombre}</span></p>
                        <p class="message-detail"><strong>Cargo:</strong> <span>${data.cargo}</span></p>
                        <p class="message-detail"><strong>EESS:</strong> <span>${data.eess}</span></p>
                        <p class="message-detail"><strong>RIS:</strong> <span>${data.ris}</span></p>
                        <p class="message-detail"><strong>Horas:</strong> <span>${data.horas}</span></p>
                        <p class="message-detail"><strong>Puntaje:</strong> <span>${data.puntaje}</span></p>
                    `;
                    messageDisplay.className = 'message-container';
                    console.log('Frontend: Usuario encontrado. Mostrando detalles.');
                } else {
                    messageDisplay.textContent = 'Usuario no encontrado.';
                    messageDisplay.className = 'message-error';
                    console.log('Frontend: Usuario NO encontrado. Mostrando mensaje de error.');
                }
            } else {
                console.error('Frontend: Error del servidor:', data.message || response.statusText);
                messageDisplay.textContent = `Error: ${data.message || 'Algo salió mal en el servidor.'}`;
                messageDisplay.className = 'message-error';
                console.log('Frontend: Error en la respuesta HTTP del backend.');
            }

        } catch (error) {
            console.error('Frontend: Error al comunicarse con el backend:', error);
            messageDisplay.textContent = 'Error de conexión. Asegúrate de que el backend esté ejecutándose.';
            messageDisplay.className = 'message-error';
            console.log('Frontend: Excepción en la comunicación con el backend.');
        } finally {
            checkButton.disabled = false;
            console.log('Frontend: Proceso de verificación finalizado. Botón habilitado.');
        }
    });
});