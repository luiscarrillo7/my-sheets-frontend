// my-sheets-frontend/script.js
document.addEventListener('DOMContentLoaded', () => {
    const userInput = document.getElementById('userInput');
    const checkButton = document.getElementById('checkButton');
    const messageDisplay = document.getElementById('message');

    // ¡IMPORTANTE! Reemplaza con la URL de tu backend LOCAL para pruebas.
    // Cuando despliegues en Render, cambiarás esto a la URL pública de tu backend en Render.
    const BACKEND_URL = 'https://my-google-sheets-backend.onrender.com'; // **QUITADO EL / AL FINAL**

    checkButton.addEventListener('click', async () => {
        const valor = userInput.value.trim(); // Obtiene el valor del input y elimina espacios en blanco

        // Validar que el input no esté vacío
        if (!valor) {
            messageDisplay.textContent = 'Por favor, ingresa un número de usuario.';
            messageDisplay.className = 'message-error'; // Aplica estilo de error
            return; // Detiene la ejecución si está vacío
        }

        // Limpiar mensaje anterior y deshabilitar botón mientras se procesa
        messageDisplay.textContent = 'Verificando...';
        messageDisplay.className = ''; // Limpia clases de estilo previas
        checkButton.disabled = true; // Deshabilita el botón para evitar múltiples clics

        try {
            // Realiza la solicitud POST a tu backend
            const response = await fetch(`${BACKEND_URL}/api/check-user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Indica que el cuerpo es JSON
                },
                body: JSON.stringify({ valor: valor }), // Envía el valor como JSON
            });

            const data = await response.json(); // Parsea la respuesta JSON del backend

            if (response.ok) { // Verifica si la respuesta HTTP es exitosa (código 200)
                if (data.exists) {
                    messageDisplay.textContent = '¡Usuario existe!';
                    messageDisplay.className = 'message-success'; // Aplica estilo de éxito
                } else {
                    messageDisplay.textContent = 'Usuario no encontrado.';
                    messageDisplay.className = 'message-error'; // Aplica estilo de error
                }
            } else {
                // Si la respuesta no es 200 OK (ej. 400, 500)
                console.error('Error del servidor:', data.message || response.statusText);
                messageDisplay.textContent = `Error: ${data.message || 'Algo salió mal en el servidor.'}`;
                messageDisplay.className = 'message-error';
            }

        } catch (error) {
            // Captura errores de red o cualquier otro error durante la solicitud
            console.error('Error al comunicarse con el backend:', error);
            messageDisplay.textContent = 'Error de conexión. Asegúrate de que el backend esté ejecutándose.';
            messageDisplay.className = 'message-error';
        } finally {
            checkButton.disabled = false; // Vuelve a habilitar el botón
        }
    });
});