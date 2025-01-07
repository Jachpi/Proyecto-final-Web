
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



async function eliminar(id) {
    try {
        const response = await fetch(`admin/eliminar`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id }),

        });

        if (response.ok) {
            console.log("Evento eliminado");
        }
        else {
            throw new Error(`Error durante la obtención del evento: ${response}`);
        }
    }
    catch (error) {
        throw new Error(`Error grave durante la obtención del evento: ${error}`);
    }

}
async function aprobar(id) {
    try {
        const response = await fetch(`admin/aprobar`, {
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


let currentPage = 0; // Página actual
const eventsPerPage = 5; // Eventos por página
let eventosGlobal = []; // Lista completa de eventos

// Actualizar los eventos visibles según la página actual
function updateEventList() {
    const start = currentPage * eventsPerPage;
    const end = start + eventsPerPage;
    const eventosPagina = eventosGlobal.slice(start, end);

    mostrarLista(eventosPagina);

    // Habilitar o deshabilitar los botones según la página actual
    document.getElementById('move-left').disabled = currentPage === 0;
    document.getElementById('move-right').disabled = end >= eventosGlobal.length;
}

// Función para mostrar la lista de eventos
function mostrarLista(eventos) {
    const lista = document.getElementById('lista');
    lista.innerHTML = '';
    eventos.forEach(evento => {
        const eventolista = document.createElement('li');
        const titulo = document.createElement("p");
        titulo.textContent = ` ${evento.Nombre}`;
        const fecha = document.createElement("p");
        fecha.textContent = ` ${evento.FechaHora}`;

        // Crear botones
        const approveButton = document.createElement("button");
        approveButton.textContent = "Aprobar";
        approveButton.addEventListener("click", (e) => {
            e.stopPropagation(); // Evita que el evento de clic en el contenedor se dispare
            aprobar(evento.IDEvento);
            lista.removeChild(eventolista);
        });

        const rejectButton = document.createElement("button");
        rejectButton.textContent = "Rechazar";
        rejectButton.addEventListener("click", (e) => {
            e.stopPropagation(); // Evita que el evento de clic en el contenedor se dispare
            eliminar(evento.IDEvento);
            lista.removeChild(eventolista);
        });

        // Evento click en el contenedor del evento
        eventolista.addEventListener("click", () => {
            window.location.href = `/evento.html?idEvento=${evento.IDEvento}`;
        });

        // Ensamblar el evento en la lista
        eventolista.appendChild(titulo);
        eventolista.appendChild(fecha);
        eventolista.appendChild(approveButton);
        eventolista.appendChild(rejectButton);
        lista.appendChild(eventolista);
    });
}

// Obtener eventos pendientes y configurar la lista
async function getEventos() {
    try {
        const response = await fetch(`admin/eventospendientes`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        if (response.ok) {
            eventosGlobal = Array.from(data); // Guardar todos los eventos
            currentPage = 0; // Reiniciar a la primera página
            updateEventList(); // Mostrar los eventos de la primera página
        } else {
            throw new Error(`Error durante la obtención del evento: ${response}`);
        }
    } catch (error) {
        console.error(`Error grave durante la obtención del evento: ${error}`);
    }
}

// Configurar botones de paginación
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
