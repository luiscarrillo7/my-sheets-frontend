// my-sheets-frontend/script.js
document.addEventListener('DOMContentLoaded', () => {
    const userInput = document.getElementById('userInput');
    const checkButton = document.getElementById('checkButton');
    const messageDisplay = document.getElementById('message');

    const BACKEND_URL = 'https://my-google-sheets-backend.onrender.com';

    checkButton.addEventListener('click', async () => {
        const valor = userInput.value.trim();

        if (!valor) {
            messageDisplay.textContent = 'Por favor, ingresa un número de usuario.';
            messageDisplay.className = 'message-error';
            return;
        }

        messageDisplay.textContent = 'Verificando...';
        messageDisplay.className = '';
        checkButton.disabled = true;

        try {
            const response = await fetch(`${BACKEND_URL}/api/check-user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ valor: valor }),
            });

            const data = await response.json();

            if (response.ok) {
                if (data.exists) {
                    // **** CAMBIO CLAVE AQUÍ: Uso de <strong> para encabezados y estilos en línea/clases para colores ****
                    messageDisplay.innerHTML = `
                        <p class="message-success">¡Usuario existe!</p>
                        <p style="color: black;"><strong>ID:</strong> <span>${data.idUsuario}</span></p>
                        <p style="color: black;"><strong>Nombre:</strong> <span>${data.nombre}</span></p>
                        <p style="color: black;"><strong>Cargo:</strong> <span>${data.cargo}</span></p>
                        <p style="color: black;"><strong>EESS:</strong> <span>${data.eess}</span></p>
                        <p style="color: black;"><strong>RIS:</strong> <span>${data.ris}</span></p>
                        <p style="color: black;"><strong>Horas:</strong> <span>${data.horas}</span></p>
                        <p style="color: black;"><strong>Puntaje:</strong> <span>${data.puntaje}</span></p>
                    `;
                    messageDisplay.className = 'message-container'; // Puedes usar una clase más genérica si no quieres que todo el bloque tenga el color del 'message-success'

                } else {
                    messageDisplay.textContent = 'Usuario no encontrado.';
                    messageDisplay.className = 'message-error';
                }
            } else {
                console.error('Error del servidor:', data.message || response.statusText);
                messageDisplay.textContent = `Error: ${data.message || 'Algo salió mal en el servidor.'}`;
                messageDisplay.className = 'message-error';
            }

        } catch (error) {
            console.error('Error al comunicarse con el backend:', error);
            messageDisplay.textContent = 'Error de conexión. Asegúrate de que el backend esté ejecutándose.';
            messageDisplay.className = 'message-error';
        } finally {
            checkButton.disabled = false;
        }
    });
});