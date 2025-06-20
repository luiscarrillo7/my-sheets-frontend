// my-sheets-frontend/script.js
document.addEventListener('DOMContentLoaded', () => {
    const userInput = document.getElementById('userInput');
    const checkButton = document.getElementById('checkButton');
    const messageDisplay = document.getElementById('message');
    const inputSection = document.getElementById('inputSection'); // Nuevo ID para la sección de entrada
    const resultsSection = document.getElementById('resultsSection'); // Nuevo ID para la sección de resultados
    const closeButton = document.getElementById('closeButton'); // Nuevo ID para el botón de cerrar

    const BACKEND_URL = 'https://my-google-sheets-backend.onrender.com';

    // Inicializar el estado de las secciones
    resultsSection.style.display = 'none'; // Ocultar la sección de resultados al inicio

    checkButton.addEventListener('click', async () => {
        const valor = userInput.value.trim();

        if (!valor) {
            messageDisplay.innerHTML = 'Por favor, ingresa un número de usuario.'; // Cambiado a innerHTML para consistencia
            messageDisplay.className = 'message-error';
            return;
        }

        messageDisplay.innerHTML = 'Verificando...'; // Cambiado a innerHTML
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
                    messageDisplay.className = 'message-container';

                    // Ocultar la sección de entrada y mostrar la de resultados
                    inputSection.style.display = 'none';
                    resultsSection.style.display = 'block'; // O 'flex' si usas flexbox para el diseño interno

                } else {
                    messageDisplay.innerHTML = 'Usuario no encontrado.'; // Cambiado a innerHTML
                    messageDisplay.className = 'message-error';
                    // Si el usuario no existe, no ocultar la sección de entrada
                }
            } else {
                console.error('Error del servidor:', data.message || response.statusText);
                messageDisplay.innerHTML = `Error: ${data.message || 'Algo salió mal en el servidor.'}`; // Cambiado a innerHTML
                messageDisplay.className = 'message-error';
            }

        } catch (error) {
            console.error('Error al comunicarse con el backend:', error);
            messageDisplay.innerHTML = 'Error de conexión. Asegúrate de que el backend esté ejecutándose.'; // Cambiado a innerHTML
            messageDisplay.className = 'message-error';
        } finally {
            checkButton.disabled = false;
        }
    });

    // Event listener para el botón de cerrar
    closeButton.addEventListener('click', () => {
        userInput.value = ''; // Limpiar el input
        messageDisplay.innerHTML = ''; // Limpiar el mensaje
        messageDisplay.className = ''; // Limpiar la clase del mensaje
        resultsSection.style.display = 'none'; // Ocultar la sección de resultados
        inputSection.style.display = 'block'; // Mostrar la sección de entrada (o 'flex')
    });
});