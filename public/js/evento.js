const params = new URLSearchParams(window.location.search);
const output = document.getElementById('output');

const titulo = document.getElementById("titulo-evento")
const organizador = document.getElementById("org")
const diaEvento = document.getElementById("dia-evento")
const fechaIni = document.getElementById("fecha-ini")
const fechaFin = document.getElementById("fecha-fin")
const categoria = document.getElementById("cat")
const desc = document.getElementById("desc")
const ubicacion = document.getElementById("ub")
const estado = document.getElementById("estado")
const img = document.getElementsByTagName("img")[0]

    params.forEach(async (id, key) => {
        console.log(`${key}: ${id}`)
        if (key == 'idEvento'){
            try{
                const response = await fetch('evento/idEvent', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body:JSON.stringify({id}),
                });
    
                const data = await response.json()
    
                if(response.ok){
                    titulo.innerHTML = data["Nombre"]
                    organizador.innerHTML = data["Username"]
                    diaEvento.innerHTML = "Comienza el: "+ data["FechaHora"].substring(0,10)
                    fechaIni.innerHTML = "Hora de comienzo: " + data["FechaHora"].substring(10,16)
                    fechaFin.innerHTML = "Hora de finalización: " + data["FechaHoraFin"].substring(10,16)
                    categoria.innerHTML = data["Categoria"]
                    desc.innerHTML = data["Descripcion"]
                    ubicacion.innerHTML = data["Ubicacion"]
                    if (data["Estado"] == "Aprobado"){
                        estado.innerHTML = "Programado"
                    }else if (data["Estado"] == "Terminado"){
                        estado.innerHTML = "Finalizado"
                        estado.style.color = "red"
                    }else{
                        estado.innerHTML = data["Estado"]
                    }
                    img.src = data["Imagen"]

                } else {
                throw new Error(`Error durante la obtención del evento: ${response}`)
                }
            } catch (error) {
                throw new Error(`Error grave durante la obtención del evento: ${error}`)
            }
        }
    });