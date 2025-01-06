 
let pagebutton1 = document.getElementById("pendientes")
let pagebutton2 = document.getElementById("aprobados")
 
pagebutton1.addEventListener('click', ()=>{
    window.location.href = "/inicioadmin.html";
 
})
pagebutton2.addEventListener('click', ()=>{
    window.location.href = "/adminpag2.html";
 
})
 

 
  async function getEventos() {
     try {
         const response = await fetch(`evento/eventospendientes`, {
          method: 'GET', 
          headers: {
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(),
 
            });
     const data = await response.json();
     if (response.ok) {
        
        const arr = Array.from(data);
        mostrarLista(arr); 
        }
          else {
             throw new Error(`Error durante la obtención del evento: ${response}`); 
            } } 
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
                const approveButton = document.createElement("button");
                approveButton.textContent = "Aprobar";
                approveButton.addEventListener("click", () => {
                    //evento.status = "aprobado"; 
                 eventolista.removeChild(listItem); 
                }); 
                const rejectButton = document.createElement("button");
                rejectButton.textContent = "Rechazar";
                rejectButton.addEventListener("click", () => {
                    eventolista.removeChild(eventolista); 
                 //eventos.push(evento);
                });  
                eventolista.appendChild(titulo); 
                eventolista.appendChild(fecha); 
                eventolista.appendChild(approveButton); 
                eventolista.appendChild(rejectButton); 
                lista.appendChild(eventolista); 
               });
            }

getEventos();
 
