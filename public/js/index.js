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

const logInButton = document.getElementById("btn-login");
const nombre = document.getElementById("username");
const psswd = document.getElementById("password");
const badLogTxt = document.getElementsByClassName("bad-login-text")[0];
let badLogEnphasize = false;

// Manejador de registro
registerBtn.addEventListener('click', async function (e) {
    e.preventDefault(); // Prevenir el envío del formulario

    const nameTxt = document.getElementById('new-username').value.trim();
    const psswdTxt = document.getElementById('new-password').value.trim();
    const emailTxt = document.getElementById('email').value.trim();
    const roleTxt = document.getElementById('tipo').value.trim();

    if (nameTxt === "" || psswdTxt === "" || emailTxt === "" || roleTxt === ""){
        alert("Debes completar todos los campos");
        return;
    }

    try {
        const resp = await fetch('http://localhost:3000/sign-up', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: nameTxt,
                password: psswdTxt,
                email: emailTxt,
                role: roleTxt
            })
        });

        console.log(resp);

        if(resp.ok){
            console.log("¡Usuario registrado exitosamente!");
            alert("¡Registro exitoso!");
            registerModal.style.display = 'none'; // Cerrar el modal
        } else {
            console.log("El usuario ya existe");
            alert("El usuario ya existe");
        }
    } catch (err){
        console.error("Error en el registro:", err);
        alert("Ocurrió un error durante el registro. Por favor, intenta nuevamente.");
    }
});

// Manejador de inicio de sesión
logInButton.addEventListener("click", async function () {
    const nameTxt = nombre.value.trim();
    const psswdTxt = psswd.value.trim();

    if (nameTxt === "" || psswdTxt === ""){
        alert("Debes completar todos los campos");
        return;
    }

    try {
        const resp = await fetch('http://localhost:3000/log-in', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: nameTxt,
                password: psswdTxt
            })
        });

        console.log(resp);

        if(resp.ok){
            console.log("¡Usuario autenticado!");
            // Redirigir al usuario o realizar otra acción
            window.location.href = "/inicio.html"; // Ejemplo de redirección
        } else {
            console.log("Usuario o contraseña incorrectos");
            if(!badLogEnphasize){
                badLogTxt.className = "bad-login-text-active";
                badLogEnphasize = true;
            } else{
                badLogTxt.className = "bad-login-text-active2";
                setTimeout(() => {
                    badLogTxt.className = "bad-login-text-active";
                },250);
            }
        }
    } catch (err){
        console.error("Error en el inicio de sesión:", err);
        alert("Ocurrió un error durante el inicio de sesión. Por favor, intenta nuevamente.");
    }
});
