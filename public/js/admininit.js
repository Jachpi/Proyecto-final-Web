let pagebutton1 = document.getElementById("pendientes")
let pagebutton2 = document.getElementById("aprobados")

pagebutton1.addEventListener('click', ()=>{
    window.location.href = "http://127.0.0.1:5500/public/inicioadmin.html";

})
pagebutton2.addEventListener('click', ()=>{
    window.location.href = "http://127.0.0.1:5500/public/adminpag2.html";
    
})