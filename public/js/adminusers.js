let pagebutton1 = document.getElementById("pendientes")
let pagebutton2 = document.getElementById("aprobados")
let pagebutton3 = document.getElementById("usuarios")

pagebutton1.addEventListener('click', () => {
    window.location.href = "/inicioadmin.html";

})
pagebutton2.addEventListener('click', () => {
    window.location.href = "/adminpag2.html";

})
pagebutton3.addEventListener('click', () => {
    window.location.href = "/admingestionusers.html";

})
// Variables para la paginación
let currentPage = 0;
const eventsPerPage = 5;
let eventosGlobal = [];

// Actualizar la lista de eventos según la página actual
function updateEventList() {
    const start = currentPage * eventsPerPage;
    const end = start + eventsPerPage;
    const eventosPagina = eventosGlobal.slice(start, end);

    mostrarLista(eventosPagina);

    // Habilitar o deshabilitar los botones de paginación
    document.getElementById('move-left').disabled = currentPage === 0;
    document.getElementById('move-right').disabled = end >= eventosGlobal.length;
}

async function aprobaruser(id) {
    try {
        const response = await fetch(`admin/aprobarusuario`, {
         method: 'POST', 
         credentials: 'include',
         headers: {
           'Content-Type': 'application/json'
       },
       body:JSON.stringify({id}),

           });
   
    if (response.ok) {
       console.log("Evento aprobado");
       }
         else {
            throw new Error(`Error durante la obtención del evento: ${response}`); 
           } } 
           catch (error) {
            throw new Error(`Error grave durante la obtención del evento: ${error}`); 
           }
       
}
// Obtener los eventos aprobados
async function getEventos() {
    try {
        const response = await fetch(`admin/usuarios`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        if (response.ok) {
            eventosGlobal = Array.from(data); // Guardar todos los eventos aprobados
            currentPage = 0; // Reiniciar a la primera página
            updateEventList(); // Mostrar los primeros eventos
        } else {
            throw new Error(`Error durante la obtención del evento: ${response}`);
        }
    } catch (error) {
        console.error(`Error grave durante la obtención del evento: ${error}`);
    }
}
// Mostrar la lista de eventos
function mostrarLista(usuarios) {
    const lista = document.getElementById('lista');
    lista.innerHTML = '';
    usuarios.forEach(user => {
        const itemlista = document.createElement('li');
        const mail = document.createElement("p");
        mail.textContent = ` ${user.Email}`;
        const rol = document.createElement("p");
        rol.textContent = ` ${user.Rol}`;

        // Botón para eliminar
        const approveButton = document.createElement("button");
        approveButton.textContent = "Aprobar";
        approveButton.addEventListener("click", (e) => {
            e.stopPropagation(); // Evitar que el clic en el botón active el evento del contenedor
            aprobaruser(user.IDUsuario);
            lista.removeChild(itemlista);
        });

        

        // Ensamblar el evento en la lista
        itemlista.appendChild(mail);
        itemlista.appendChild(rol);
        itemlista.appendChild(approveButton);
        lista.appendChild(itemlista);
    });
}

// Configurar los botones de paginación
document.getElementById('move-left').addEventListener('click', () => {
    if (currentPage > 0) {
        currentPage--;
        updateEventList();
    }
});

document.getElementById('move-right').addEventListener('click', () => {
    const maxPages = Math.ceil(eventosGlobal.length / eventsPerPage) - 1;
    if (currentPage < maxPages) {
        currentPage++;
        updateEventList();
    }
});

// Logout
document.getElementById("logout-btn").addEventListener("click", async () => {
    try {
        const response = await fetch('/auth/logout', {
            method: 'POST',
            credentials: 'include',
        });

        if (response.ok) {
            alert("Has cerrado sesión correctamente.");
            window.location.href = '/index.html';
        } else {
            alert("Error al cerrar sesión. Inténtalo de nuevo.");
        }
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
        alert("Ocurrió un error. Inténtalo más tarde.");
    }
});

// Inicializar
getEventos();