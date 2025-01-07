const params = new URLSearchParams(window.location.search);

const titulo = document.getElementById("titulo-evento");
const organizador = document.getElementById("org");
const diaEvento = document.getElementById("dia-evento");
const fechaIni = document.getElementById("fecha-ini");
const fechaFin = document.getElementById("fecha-fin");
const categoria = document.getElementById("cat");
const desc = document.getElementById("desc");
const ubicacion = document.getElementById("ub");
const estado = document.getElementById("estado");
const img = document.getElementsByTagName("img")[0];

params.forEach(async (id, key) => {
    console.log(`${key}: ${id}`);
    if (key == 'idEvento') {
        try {
            // Fetch para obtener los datos del evento
            const response = await fetch('evento/idEvent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ id }),
            });

            const data = await response.json();

            if (response.ok) {
                // Rellenar los datos del evento
                titulo.innerHTML = data["Nombre"];
                organizador.innerHTML = data["Username"];
                diaEvento.innerHTML = "Comienza el: " + data["FechaHora"].substring(0, 10);
                fechaIni.innerHTML = "Hora de comienzo: " + data["FechaHora"].substring(10, 16);
                fechaFin.innerHTML = "Hora de finalización: " + data["FechaHoraFin"].substring(10, 16);
                categoria.innerHTML = data["Categoria"];
                desc.innerHTML = data["Descripcion"];
                ubicacion.innerHTML = data["Ubicacion"];
                if (data["Estado"] === "Aprobado") {
                    estado.innerHTML = "Programado";
                } else if (data["Estado"] === "Terminado") {
                    estado.innerHTML = "Finalizado";
                    estado.style.color = "red";
                } else {
                    estado.innerHTML = data["Estado"];
                }
                img.src = data["Imagen"];

                // Verificar si el usuario es el propietario o administrador
                const ownerResponse = await fetch('evento/isOwner', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ idEvento: id }),
                    credentials: 'include', // Para enviar cookies/sesiones
                });

                const ownerData = await ownerResponse.json();

                if (ownerResponse.ok && ownerData.isOwner) {
                    // Crear botón de editar si es propietario
                    const editButton = document.createElement('button');
                    editButton.textContent = 'Editar Evento';
                    editButton.classList.add('btn', 'btn-edit');
                    editButton.addEventListener('click', () => {
                        window.location.href = `evento/editar/${id}`;
                    });

                    // Agregar el botón al contenedor
                    const infoContainer = document.querySelector('.infoContainer');
                    infoContainer.appendChild(editButton);
                }

                // Generar código QR de la URL del evento
                const eventUrl = `${window.location.origin}/evento.html?idEvento=${id}`;
                const qrResponse = await fetch(`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(eventUrl)}&size=150x150`);

                if (qrResponse.ok) {
                    const qrContainer = document.querySelector('.qr img');
                    qrContainer.src = qrResponse.url; // Actualizar la imagen con el código QR
                } else {
                    console.error('Error al generar el código QR');
                }
            } else {
                throw new Error(`Error durante la obtención del evento: ${response}`);
            }
        } catch (error) {
            console.error(`Error grave durante la obtención del evento: ${error}`);
        }
    }
});
