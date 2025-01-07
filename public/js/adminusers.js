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