// Obtener elementos
const registerLink = document.getElementById('register-link');
const registerModal = document.getElementById('register-modal');
const closeModal = document.getElementById('close-modal');
const registerBtn = document.getElementById('register-btn');

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

document.addEventListener('DOMContentLoaded', () => {
    // Elementos del formulario de login
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');

    // Elementos del formulario de signup
    const signupForm = document.getElementById('signup-form');
    const signupSuccess = document.getElementById('signup-success');
    const signupError = document.getElementById('signup-error');

    // Manejar el envío del formulario de login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevenir el comportamiento por defecto del formulario
    
        loginError.style.display = 'none';
    
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
    
        try {
            const response = await fetch('/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include', // Incluye las cookies en la solicitud
            });
    
            const data = await response.json();
    
            if (response.ok) {
                if (data.success && data.redirect) {
                    // Redirige a la URL proporcionada por el backend
                    window.location.href = data.redirect;
                }
            } else {
                // Manejar errores según la respuesta del backend
                loginError.textContent = data.error || 'Error desconocido durante el login.';
                loginError.style.display = 'block';
            }
        } catch (error) {
            console.error('Error durante el login:', error);
            loginError.textContent = 'Ocurrió un error en el servidor.';
            loginError.style.display = 'block';
        }
});

    // Manejar el envío del formulario de signup
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevenir el comportamiento por defecto del formulario

        // Ocultar mensajes anteriores
        signupSuccess.style.display = 'none';
        signupError.style.display = 'none';

        // Obtener los datos del formulario
        const email = document.getElementById('signup-email').value.trim();
        const tipo = document.getElementById('tipo').value;
        const username = document.getElementById('new-username').value.trim();
        const password = document.getElementById('new-password').value.trim();

        try {
            const response = await fetch('/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, 'new-password': password, 'new-username': username, tipo })
            });

            const data = await response.json();

            if (response.ok) {
                // Mostrar mensaje de éxito y limpiar el formulario
                signupSuccess.style.display = 'block';
                signupError.style.display = 'none';
                signupForm.reset();
            } else {
                // Mostrar mensaje de error
                if (data.error === 'El usuario ya existe') {
                    signupError.textContent = 'El correo electrónico ya está registrado.';
                } else if (data.error === 'Datos inválidos') {
                    signupError.textContent = 'Por favor, completa todos los campos.';
                } else {
                    signupError.textContent = 'Ocurrió un error durante el registro.';
                }
                signupError.style.display = 'block';
            }
        } catch (error) {
            console.error('Error durante el registro:', error);
            signupError.textContent = 'Ocurrió un error en el servidor.';
            signupError.style.display = 'block';
        }
    });
});
