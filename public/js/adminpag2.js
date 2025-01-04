let pagebutton1 = document.getElementById("pendientes")
let pagebutton2 = document.getElementById("aprobados")

pagebutton1.addEventListener('click', ()=>{
    window.location.href = "http://127.0.0.1:5500/public/inicioadmin.html";

})
pagebutton2.addEventListener('click', ()=>{
    window.location.href = "http://127.0.0.1:5500/public/adminpag2.html";
    
})

const items = [ 
    { titulo: "Item 1", fecha: 100, status: "aprobado" },
    { titulo: "Item 2", fecha: 200, status: "pendiente" }, 
    { titulo: "Item 3", fecha: 300, status: "aprobado" } 
];
const itemList = document.getElementById("lista");
items.forEach(item => {
    if (item.status !== "pendiente") {
    const listItem = document.createElement("li");
    const titulo = document.createElement("p");
    titulo.textContent = ` ${item.titulo}`;
    const fecha = document.createElement("p");
    fecha.textContent = ` ${item.fecha}`; 
    // Create delete button 
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Eliminar";
    deleteButton.addEventListener("click", () => {
     itemList.removeChild(listItem); 
    }); 
     // Append paragraphs and delete button to list item 
    listItem.appendChild(titulo); 
    listItem.appendChild(fecha); 
    listItem.appendChild(deleteButton); 
    itemList.appendChild(listItem); 
}
});