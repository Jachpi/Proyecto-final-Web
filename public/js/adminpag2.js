let pagebutton1 = document.getElementById("pendientes")
let pagebutton2 = document.getElementById("aprobados")

pagebutton1.addEventListener('click', () => {
    window.location.href = "/inicioadmin.html";

})
pagebutton2.addEventListener('click', () => {
    window.location.href = "/adminpag2.html";

})
document.getElementById('addevent').addEventListener('click', function (event) {
    event.preventDefault();
    window.location.href = '/eventoform.html';
});

async function getEventos() {
    try {
        const response = await fetch(`admin/eventosaprobados`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(),

        });
        const data = await response.json();
        if (response.ok) {

            const arr = Array.from(data);
            mostrarLista(arr);
        }
        else {
            throw new Error(`Error durante la obtención del evento: ${response}`);
        }
    }
    catch (error) {
        throw new Error(`Error grave durante la obtención del evento: ${error}`);
    }
}
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

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Eliminar";
        deleteButton.addEventListener("click", () => {
            eliminar(evento.IDEvento);
            lista.removeChild(eventolista);
            //eventos.push(evento);
        });
        eventolista.appendChild(titulo);
        eventolista.appendChild(fecha);
        eventolista.appendChild(deleteButton);
        lista.appendChild(eventolista);

        eventolista.addEventListener("click", () => {
            window.location.href = `/evento.html?idEvento=${evento.IDEvento}`;
        });
    });
}


document.getElementById("logout-btn").addEventListener("click", async () => {
    try {
        const response = await fetch('/auth/logout', {
            method: 'POST',
            credentials: 'include', // Para enviar cookies/sesiones
        });

        if (response.ok) {
            alert("Has cerrado sesión correctamente.");
            window.location.href = '/index.html'; // Redirige al login
        } else {
            alert("Error al cerrar sesión. Inténtalo de nuevo.");
        }
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
        alert("Ocurrió un error. Inténtalo más tarde.");
    }
});

getEventos();

