let pagebutton1 = document.getElementById("pendientes");
let pagebutton2 = document.getElementById("aprobados");

pagebutton1.addEventListener('click', () => {
    window.location.href = "/inicioadmin.html";
});

pagebutton2.addEventListener('click', () => {
    window.location.href = "/adminpag2.html";
});

document.getElementById('addevent').addEventListener('click', function (event) {
    event.preventDefault();
    window.location.href = '/eventoform.html';
});

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

// Obtener los eventos aprobados
async function getEventos() {
    try {
        const response = await fetch(`admin/eventosaprobados`, {
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

// Eliminar un evento
async function eliminar(id) {
    try {
        const response = await fetch(`admin/eliminar`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id })
        });

        if (response.ok) {
            console.log("Evento eliminado");
            eventosGlobal = eventosGlobal.filter(evento => evento.IDEvento !== id); // Actualizar eventos globales
            updateEventList(); // Actualizar la lista actual
        } else {
            throw new Error(`Error durante la eliminación del evento: ${response}`);
        }
    } catch (error) {
        console.error(`Error grave durante la eliminación del evento: ${error}`);
    }
}

// Mostrar la lista de eventos
function mostrarLista(eventos) {
    const lista = document.getElementById('lista');
    lista.innerHTML = '';
    eventos.forEach(evento => {
        const eventolista = document.createElement('li');
        const titulo = document.createElement("p");
        titulo.textContent = ` ${evento.Nombre}`;
        const fecha = document.createElement("p");
        fecha.textContent = ` ${evento.FechaHora}`;

        // Botón para eliminar
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Eliminar";
        deleteButton.addEventListener("click", (e) => {
            e.stopPropagation(); // Evitar que el clic en el botón active el evento del contenedor
            eliminar(evento.IDEvento);
        });

        // Redirigir al evento al hacer clic en el contenedor
        eventolista.addEventListener("click", () => {
            window.location.href = `/evento.html?idEvento=${evento.IDEvento}`;
        });

        // Ensamblar el evento en la lista
        eventolista.appendChild(titulo);
        eventolista.appendChild(fecha);
        eventolista.appendChild(deleteButton);
        lista.appendChild(eventolista);
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
