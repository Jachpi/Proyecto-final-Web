
let pagebutton1 = document.getElementById("pendientes")
let pagebutton2 = document.getElementById("aprobados")

pagebutton1.addEventListener('click', ()=>{
    window.location.href = "/inicioadmin.html";

})
pagebutton2.addEventListener('click', ()=>{
    window.location.href = "/adminpag2.html";
    
})

 
fetch('evento/eventospendientes') 
    .then(response => { 
         
        if (!response.ok) { 
            throw new Error('Network response was not ok');

         }
         return response.json(); 
         }) 
         .then(data => { // Handle the data (an array of rows from the table) 
            console.log('Fetched rows:', data);  
            }) .catch(error => { // Handle any errors that occurred during the fetch 
            console.error('There was a problem with the fetch operation:', error);
            });
            
/*
  async function getEventos() {
     try {
         const response = await fetch(`evento/eventospendientes`, {
          method: 'POST', 
          headers: {
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(),
          
            });
     const data = await response.json();
     if (response.ok) {
        console.log("algo se ha encontrado");
        mostrarLista(data); 
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
                    evento.status = "aprobado"; 
                 eventolista.removeChild(listItem); 
                }); 
                const rejectButton = document.createElement("button");
                rejectButton.textContent = "Rechazar";
                rejectButton.addEventListener("click", () => {
                    eventolista.removeChild(eventolista); 
                 eventos.push(evento);
                });  
                eventolista.appendChild(titulo); 
                eventolista.appendChild(fecha); 
                eventolista.appendChild(approveButton); 
                eventolista.appendChild(rejectButton); 
                lista.appendChild(eventolista); 
               });
            }
       //document.addEventListener('DOMContentLoaded', getEventos);
getEventos();
*/
           

       
/*
const itemList = document.getElementById("lista");
items.forEach(item => {
    if (item.status === "pendiente") {
    const listItem = document.createElement("li");
    const titulo = document.createElement("p");
    titulo.textContent = ` ${item.titulo}`;
    const fecha = document.createElement("p");
    fecha.textContent = ` ${item.fecha}`; 
    // Crear botones
    const approveButton = document.createElement("button");
    approveButton.textContent = "Aprobar";
    approveButton.addEventListener("click", () => {
     item.status = "aprobado"; 
     itemList.removeChild(listItem); 
    }); 
    const rejectButton = document.createElement("button");
    rejectButton.textContent = "Rechazar";
    rejectButton.addEventListener("click", () => {
     itemList.removeChild(listItem); 
     items.push(item);
    }); 
     // Append paragraphs and delete button to list item 
    listItem.appendChild(titulo); 
    listItem.appendChild(fecha); 
    listItem.appendChild(approveButton); 
    listItem.appendChild(rejectButton); 
    itemList.appendChild(listItem); 
}
});
*/