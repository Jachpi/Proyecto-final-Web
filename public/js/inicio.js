
let eventList = document.getElementById("event-list")
let leftButton = document.getElementById("move-left")
let rightButton = document.getElementById("move-right")
let checkBoxes = document.getElementsByClassName("radio")
const search = document.getElementById("search")


const now = new Date();
let fechaRelativa = new Date() // fecha que variará
let monthLength //para 28, 29, 30 o 31 días

/**
 * Borra y modifica el calendario
 * @param {boolean} hideWeekName - Oculta los días de la semana
 */

function clearGrid(hideWeekName = false){
    Array.from(eventList.children).forEach(child => {
        if (!child.classList.contains('weekName')) {
            eventList.removeChild(child);
        }else if (hideWeekName){
            child.style.display = "none"
        }else{
            child.style.display = "flex"
        }
    });
}

/**
 * Inserción de los días del mes
 * @param {Int} dayAmount - cantidad de días (casillas) a insertar
 * @param {Int} offset - desplaza todos los días x casillas para que el día 1 del mes comience en el día de la semana correcto
 */
function appendMonthDays(dayAmount, offset){
    clearGrid()
    const eventsForDisplay = getEvents(fechaRelativa, "month")
    eventsForDisplay.then(eventosObtenidos => {
        offset %= 7
        if (offset == 6){
            offset = -1
        }
        for (let i = offset*(-1); i <= 36; i++){
            dia = document.createElement("div")
            if (i <= 0 || dayAmount < i ){
                dia.className = "dia-out-of-bounds"
            }else{
                if(now.getFullYear() > fechaRelativa.getFullYear()){ //si es un año anterior
                    dia.className = "dia-mes-actual-pasado"
                    let dayTxt = document.createElement("p")
                    dayTxt.className = "dayNumber"
                    dayTxt.innerHTML = i
                    dia.appendChild(dayTxt) //se añade el número del mes
                }
                else if (now.getFullYear() < fechaRelativa.getFullYear()){ //si es un año posterior
                    dia.className = "dia"
                    let dayTxt = document.createElement("p")
                    dayTxt.className = "dayNumber"
                    dayTxt.innerHTML = i
                    dia.appendChild(dayTxt) //se añade el contenido
                }else{
                    let dayTxt = document.createElement("p")
                    dayTxt.className = "dayNumber"
                    dayTxt.innerHTML = i
                    dia.appendChild(dayTxt) //se añade el contenido
                    if (now.getMonth() > fechaRelativa.getMonth()){
                        dia.className = "dia-mes-actual-pasado"
                    }else if (now.getFullYear() == fechaRelativa.getFullYear() && now.getMonth() == fechaRelativa.getMonth() && now.getDate() == i){
                        dia.className = "dia-actual"
                    }else if (now.getMonth() == fechaRelativa.getMonth()){
                        if (now.getDate() < i){
                            dia.className = "dia"
                        }else{
                            dia.className = "dia-mes-actual-pasado"
                        }
                    }else{
                        dia.className = "dia"
                    }
                }
                //Inserción de los eventos que toquen
                try{
                    let exit = false
                    while(!exit && eventosObtenidos.length != 0){
                        let matchText = eventosObtenidos[0]['FechaHora']
                        let dateMatch = matchText.match(/(?<=\d{4}-\d{2}-)\d+/gm)
                        if(dateMatch && Number(dateMatch[0]) == i){
                            let dailyEvents = document.createElement("p")
                            dailyEvents.className = "eventText"
                            dailyEvents.innerHTML = eventosObtenidos[0]['Nombre']
                            dia.appendChild(dailyEvents) //se añaden los eventos
                            eventosObtenidos.splice(0,1) //se borra del array ordenado
                        }else{
                            exit = true
                        }
                    }
                }catch (ex){
                    console.error(ex)
                }
                
                dia.addEventListener('click', (celda) => {
                    let clickedDay = celda.target
                    let diaType = clickedDay.className
                    if (clickedDay.tagName != "DIV"){ // Previene que la animación aplique a sus hijos (que son todos <p> en este caso)
                        clickedDay = clickedDay.parentElement
                        diaType = clickedDay.className
                    }
                    setTimeout(()=>{
                        fechaRelativa.setDate(i)
                        checkBoxes[0].checked = true
                        displayDay()
                        eventList.style.gridTemplateRows = "5% 80%"
                        eventList.style.gridTemplateColumns = "1fr 2fr 1fr"
                    },250)
                    if(clickedDay.className != "dia-clicked"){ //evitar que vuelvan a clicar durante la animación
                        if(clickedDay.className == "dia-actual"){ //el día actual necesita una animación ligeramente distinta debido a que el grosor adicional de su borde daba problemas con la animación normal
                            clickedDay.className = "dia-actual-clicked"
                        }else{
                            clickedDay.className = "dia-clicked"
                        }
                        setTimeout(()=>{clickedDay.className = diaType},200)
                    }
                })
                
            }
            eventList.appendChild(dia)
        }
    }).catch("algo pasó, inténtelo más tarde")
    
}

/**
 * Reduce día del mes en 1
 */
function reduceMonth(){
    if (fechaRelativa.getMonth() == 0){
        fechaRelativa.setFullYear(fechaRelativa.getFullYear() - 1)
        fechaRelativa.setMonth(11)
    }else{
        fechaRelativa.setMonth(fechaRelativa.getMonth() - 1)
    }
}

/**
 * Aumenta día del mes en 1
 */
function increaseMonth(){
    if (fechaRelativa.getMonth() == 11){
        fechaRelativa.setFullYear(fechaRelativa.getFullYear() + 1)
        fechaRelativa.setMonth(0)
    }else{
        fechaRelativa.setMonth(fechaRelativa.getMonth() + 1)
    }
}

/**
 * Identificación y cálculo del mes que toca representar
 */
function displayMonth(){
    document.getElementById("move-left").style.display = "block"
    document.getElementById("move-right").style.display = "block"
    let dateTextDisplay = document.getElementById("date-text-display")
    dateTextDisplay.innerHTML = new Intl.DateTimeFormat('es-ES',{month: 'long'}).format(fechaRelativa) + " / " + fechaRelativa.getFullYear() //para pasar el mes de hoy a español
    
    let diaOffset = new Date(fechaRelativa.getFullYear(), fechaRelativa.getMonth(), 1).getDay() + 5;
    
    const monthLength = checkMonthLength(fechaRelativa)
    appendMonthDays(monthLength, diaOffset)
}

/**
 * Evalúa el número de días del mes pasado en el parámetro de tipo Date
 * @param {Date} specificDate - Fecha específica sobre la que se mirará cuántos días tiene su mes
 * @returns - 28,29,30 o 31, según el mes
 */
function checkMonthLength(specificDate){
    if (specificDate.getMonth() == 1){
        //Feb >:(

        let bisiesto = false
        if (specificDate.getFullYear() % 4 == 0){
            if(specificDate.getFullYear() % 100 == 0){
                if(specificDate.getFullYear() % 400 == 0){
                    bisiesto = true
                }
            }else{
                bisiesto = true
            }
        }
        if (bisiesto){
            return 29
        }else{
            return 28
        }
    }
    else if (specificDate.getMonth() == 0 || specificDate.getMonth() == 2 || specificDate.getMonth() == 4 || specificDate.getMonth() == 6 || specificDate.getMonth() == 7 || specificDate.getMonth() == 9 || specificDate.getMonth() == 11){
        return 31
    }
    else{
        return 30
    }
}

/**
 * Inserción de los 7 días de la semana actual
 */
async function appendWeekDays(){
    clearGrid()
    const currDay = now.getDay()
    let offsetDay = now.getDate() //para poner el número del día del mes
    //obtener mes anterior
    const lastMonth = new Date(fechaRelativa.getFullYear(), fechaRelativa.getMonth(), fechaRelativa.getDate())
    if (fechaRelativa.getMonth() == 0){
        lastMonth.setMonth(11)
        lastMonth.setFullYear(fechaRelativa.getFullYear() - 1)
    }else{
        lastMonth.setMonth(fechaRelativa.getMonth() - 1)
    }
    //obtener mes posterior
    const nextMonth = new Date(fechaRelativa.getFullYear(), fechaRelativa.getMonth(), fechaRelativa.getDate())
    if (fechaRelativa.getMonth() == 11){
        nextMonth.setMonth(0)
        nextMonth.setFullYear(fechaRelativa.getFullYear() + 1)
    }else{
        nextMonth.setMonth(fechaRelativa.getMonth() + 1)
    }
    //para ajustar valor número en caso de que la semana englobe días del mes anterior
    const lastMonthLength = checkMonthLength(lastMonth)
    const monthLength = checkMonthLength(fechaRelativa)
    const promesas = []
    for (let i = 1; i <= 7; i++){
        let fechaActual
        let dayNumb = offsetDay - currDay + i //se recalcurará su valor para que no muestre números negativos o superiores a los que tiene un mes
        let dayValue = dayNumb //se usará para evaluar si pasó el día o no
        //ajustar número en caso de englobar días del mes anterior o posterior
        if(dayNumb <= 0){
            dayNumb += lastMonthLength
            fechaActual = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), dayNumb)
        }else if(dayNumb >= monthLength + 1){
            dayNumb %= (monthLength + 1)
            dayNumb += 1
            fechaActual = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), dayNumb)
        }else{
            fechaActual = new Date(fechaRelativa.getFullYear(), fechaRelativa.getMonth(), dayNumb)
        }
        fechaActual.setHours(1) //NO BORRAR. Al parecer es necesario
        //Obtención de los eventos semanales
        const eventsForDisplay = getEvents(fechaActual).then(eventosObtenidos => ({
            eventosObtenidos,
            dayNumb,
            dayValue
        }))
        promesas.push(eventsForDisplay)
    }
    //esperar a que todos los días hayan sido recibidos
    const resultados = await Promise.all(promesas)

    resultados.forEach(({eventosObtenidos, dayNumb, dayValue}) => {
        dia = document.createElement("div")
        let dayTxt = document.createElement("p")
        dayTxt.innerHTML = dayNumb
        let dailyEvents = document.createElement("p")
        dayTxt.className = "dayNumber"
        dia.appendChild(dayTxt)
        //Inserción de los eventos que toquen
        try{
            let exit = false
            while(!exit && eventosObtenidos.length != 0){
                let matchText = eventosObtenidos[0]['FechaHora']
                let dateMatch = matchText.match(/(?<=\d{4}-\d{2}-)\d+/gm)
                if(dateMatch && Number(dateMatch[0]) == dayNumb){
                    let dailyEvents = document.createElement("p")
                    dailyEvents.className = "eventText"
                    dailyEvents.innerHTML = eventosObtenidos[0]['Nombre']
                    dia.appendChild(dailyEvents) //se añaden los eventos
                    eventosObtenidos.splice(0,1) //se borra del array ordenado
                }else{
                    exit = true
                }
            }
        }catch (ex){
            console.error(ex)
        }
        if (dayValue < offsetDay){
            dia.className = "dia-mes-actual-pasado"
        }else if (dayValue == offsetDay){
            dia.className = "dia-actual"
        }else{
            dia.className = "dia"
        }
        dia.addEventListener('click', (celda) => {
            let clickedDay = celda.target
            let diaType = clickedDay.className
            if (clickedDay.tagName != "DIV"){ // Previene que la animación aplique a sus hijos (que son todos <p> en este caso)
                clickedDay = clickedDay.parentElement
                diaType = clickedDay.className
            }
            setTimeout(()=>{
                if (dayValue <= 0){
                    fechaRelativa.setDate(lastMonthLength+dayValue)
                    fechaRelativa.setMonth(lastMonth.getMonth())
                }else if(dayValue > monthLength){
                    fechaRelativa.setDate(dayValue-monthLength)
                    fechaRelativa.setMonth(nextMonth.getMonth())
                }else{
                    fechaRelativa.setDate(dayValue)
                }
                checkBoxes[0].checked = true
                displayDay()
                eventList.style.gridTemplateRows = "5% 80%"
                eventList.style.gridTemplateColumns = "1fr 2fr 1fr"
            },250)
            if(clickedDay.className != "dia-clicked"){ //evitar que vuelvan a clicar durante la animación
                if(clickedDay.className == "dia-actual"){ //el día actual necesita una animación ligeramente distinta debido a que el grosor adicional de su borde daba problemas con la animación normal
                    clickedDay.className = "dia-actual-clicked"
                }else{
                    clickedDay.className = "dia-clicked"
                }
                setTimeout(()=>{clickedDay.className = diaType},200)
            }
        })
        
        dia.appendChild(dailyEvents)
        eventList.appendChild(dia)
    })
}

/**
 * Identificación de la semana actual
 */
function displayWeek(){
    document.getElementById("move-left").style.display = "none"
    document.getElementById("move-right").style.display = "none"
    let dateTextDisplay = document.getElementById("date-text-display")
    dateTextDisplay.innerHTML = ""
    appendWeekDays()
}

/**
 * Reducir el día en 1
 */
function reduceDay(){
    fechaRelativa.setTime(fechaRelativa.getTime() - (24*60*60*1000));
    displayDay()
}

/**
 * Aumentar el día en 1
 */
function increaseDay(){
    fechaRelativa.setTime(fechaRelativa.getTime() + (24*60*60*1000));
    displayDay()
}

/**
 * Representación del día actual
 */
function displayDay(){
    clearGrid(true)
    document.getElementById("move-left").style.display = "block"
    document.getElementById("move-right").style.display = "block"

    eventList.style.gridTemplateRows = "5% 80%"
    eventList.style.gridTemplateColumns = "1fr 2fr 1fr"

    let dateTextDisplay = document.getElementById("date-text-display")
    dateTextDisplay.innerHTML = fechaRelativa.getDate() + " / " + new Intl.DateTimeFormat('es-ES',{month: 'long'}).format(fechaRelativa) + " / " + fechaRelativa.getFullYear() //para pasar el mes de hoy a español

    let dia = document.createElement("div")
    dia.className = "unique-dia"
    dia.style.gridColumn = 2
    dia.style.rowGap = '0.5em'
    dia.style.height = "80vh"
    dia.style.overflow = "visible"
    eventList.appendChild(dia)

    getEvents(fechaRelativa, "day").then(listaEventos => {
        listaEventos.forEach((evento) =>{
            let obj = document.createElement("div")
            const startHourMatch = evento['FechaHora'].match(/\d+:\d+/gm)[0]
            const endHourMatch = evento['FechaHoraFin'].match(/\d+:\d+/gm)[0]
            const [h1, m1] = startHourMatch.split(':').map(Number);
            const fechaInicio = new Date(fechaRelativa.getFullYear(),fechaRelativa.getMonth(),fechaRelativa.getDate(),h1,m1,0);
            const [h2, m2] = endHourMatch.split(':').map(Number);
            const fechaFin = new Date(fechaRelativa.getFullYear(),fechaRelativa.getMonth(),fechaRelativa.getDate(),h2,m2,0);
            if (fechaInicio < now){
                if (fechaFin > now){
                    obj.className = "dia-actual"
                }else{
                    obj.className = "dia-mes-actual-pasado"
                }
            }else{
                obj.className = "dia"
            }
                        
            let nameP = document.createElement("p")
            nameP.className = "eventText"
            nameP.innerHTML = evento["Nombre"]
            let timeP = document.createElement("p")
            timeP.className = "eventText"
            timeP.innerHTML = "("+startHourMatch+'-'+endHourMatch+")"

            obj.addEventListener('click', (celda) => {
                let clickedDay = celda.target
                let diaType = clickedDay.className
                if (clickedDay.tagName != "DIV"){ // Previene que la animación aplique a sus hijos (que son todos <p> en este caso)
                    clickedDay = clickedDay.parentElement
                    diaType = clickedDay.className
                }
                if(clickedDay.className != "dia-clicked"){ //evitar que vuelvan a clicar durante la animación
                    if(clickedDay.className == "dia-actual"){ //el día actual necesita una animación ligeramente distinta debido a que el grosor adicional de su borde daba problemas con la animación normal
                        clickedDay.className = "dia-actual-clicked"
                    }else{
                        clickedDay.className = "dia-clicked"
                    }
                    setTimeout(() => {
                        clickedDay.className = diaType
                        postTo(
                            '/evento.html',
                            {
                                idEvento : evento['IDEvento'],
                            }
                        )
                    },250)
                }
            })
            obj.appendChild(nameP)
            obj.appendChild(timeP)
            dia.appendChild(obj)
        })
    }
    ).catch("Sucedió un error, inténtelo más tarde")
}
/**
 * Modifica el calendario para mostrar eventos que coinciden con la información insertada en la barra de búsqueda
 */
function displayCustom(name){
    clearGrid(true)
    document.getElementById("move-left").style.display = "none"
    document.getElementById("move-right").style.display = "none"

    eventList.style.gridTemplateRows = "5% 80%"
    eventList.style.gridTemplateColumns = "1fr 2fr 1fr"

    let dateTextDisplay = document.getElementById("date-text-display")
    dateTextDisplay.innerHTML = ""
    let dia = document.createElement("div")
    dia.className = "unique-dia"
    dia.style.gridColumn = 2
    dia.style.rowGap = '0.5em'
    dia.style.height = "80vh"
    dia.style.overflow = "visible"
    eventList.appendChild(dia)

    getEventsByName(name).then(listaEventos => {
        listaEventos.forEach((evento) =>{
            let obj = document.createElement("div")
            const startHourMatch = evento['FechaHora'].match(/\d+-\d+-\d+ \d+:\d+/gm)[0]
            const endHourMatch = evento['FechaHoraFin'].match(/\d+:\d+/gm)[0]
            const [h1, m1] = startHourMatch.split(':').map(Number);
            const fechaInicio = new Date(fechaRelativa.getFullYear(),fechaRelativa.getMonth(),fechaRelativa.getDate(),h1,m1,0);
            const [h2, m2] = endHourMatch.split(':').map(Number);
            const fechaFin = new Date(fechaRelativa.getFullYear(),fechaRelativa.getMonth(),fechaRelativa.getDate(),h2,m2,0);
            if (fechaInicio < now){
                if (fechaFin > now){
                    obj.className = "dia-actual"
                }else{
                    obj.className = "dia-mes-actual-pasado"
                }
            }else{
                obj.className = "dia"
            }
                        
            let nameP = document.createElement("p")
            nameP.className = "eventText"
            nameP.innerHTML = evento["Nombre"]
            let timeP = document.createElement("p")
            timeP.className = "eventText"
            timeP.innerHTML = "("+startHourMatch+'-'+endHourMatch+")"

            obj.addEventListener('click', (celda) => {
                let clickedDay = celda.target
                let diaType = clickedDay.className
                if (clickedDay.tagName != "DIV"){ // Previene que la animación aplique a sus hijos (que son todos <p> en este caso)
                    clickedDay = clickedDay.parentElement
                    diaType = clickedDay.className
                }
                if(clickedDay.className != "dia-clicked"){ //evitar que vuelvan a clicar durante la animación
                    if(clickedDay.className == "dia-actual"){ //el día actual necesita una animación ligeramente distinta debido a que el grosor adicional de su borde daba problemas con la animación normal
                        clickedDay.className = "dia-actual-clicked"
                    }else{
                        clickedDay.className = "dia-clicked"
                    }
                    setTimeout(() => {
                        clickedDay.className = diaType
                        postTo(
                            '/evento.html',
                            {
                                idEvento : evento['IDEvento'],
                            }
                        )
                    },250)
                }
            })
            obj.appendChild(nameP)
            obj.appendChild(timeP)
            dia.appendChild(obj)
        })
    }
    ).catch("Sucedió un error, inténtelo más tarde")

}

/**
 * Redirige a otra página con información
 * @param {String} url - dirección de la página
 * @param {Object} data - información que se enviará
 */
function postTo(url, data){
    const params = new URLSearchParams(data).toString()
    window.location.href = `${url}?${params}`
}


/**
 * Función que se invoca 1 vez al inicio de la carga de la página
 */
function setup(){
    //identificar el display actual del calendario antes de cambiar
leftButton.addEventListener('click', () => {
    if (checkBoxes[0].checked){
        reduceDay()
    }else{
        reduceMonth()
        displayMonth()
    }
})

//identificar el display actual del calendario antes de cambiar
rightButton.addEventListener('click', () => {
    if (checkBoxes[0].checked){
        increaseDay()
    }else{
        increaseMonth();
        displayMonth()
    }
})

//Cambiar a formato día, semana, mes
checkBoxes[0].addEventListener('click', ()=>{
    fechaRelativa.setTime(now.getTime())
    displayDay()
})

checkBoxes[1].addEventListener('click', ()=>{
    fechaRelativa.setTime(now.getTime())
    displayWeek()
    eventList.style.gridTemplateRows = "3em repeat(1, 80%)"
    eventList.style.gridTemplateColumns = "repeat(7, 14.2%)"
    eventList.style.rowGap = "5%"
})

checkBoxes[2].addEventListener('click', ()=>{
    fechaRelativa.setTime(now.getTime())
    displayMonth()
    eventList.style.gridTemplateRows = "3em repeat(6, 1fr)"
    eventList.style.gridTemplateColumns = "repeat(7, 14.2%)"
    eventList.style.rowGap = "2px"
})

document.getElementById('addevent').addEventListener('click', function (event) {
    event.preventDefault();
    window.location.href = '/eventoform.html';
});


search.addEventListener('keydown', event => {
    if (event.key === 'Enter'){
        checkBoxes[0].checked = false
        checkBoxes[1].checked = false
        checkBoxes[2].checked = false
        displayCustom(search.value)
    }
    
})

displayMonth() //cargar el mes actual al inicio de la carga de la página
}

/**
 * Solicita del controlador los eventos presentes en una fecha del año
 * @param {*} date - Fecha de la que se quiere obtener los datos
 * @param {*} type - Filtro para recoger todos los eventos del día ('day') o del mes ('month')
 * @returns - todos los eventos que se encuentran en el intervalo especificado
 */
async function getEvents(date, type = "day"){
    try {
        const response = await fetch('evento/calendar/items', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({date, type}),
        });
    
        const data = await response.json();
    
        if (response.ok) {
            return data;
        } else {
            throw new Error(`Error durante la obtención de eventos: ${response}`)
        }
    } catch (error) {
        throw new Error(`Error grave durante la obtención de eventos: ${error}`)
    }
}

async function getEventsByName(name){
    try {
        const response = await fetch('evento/calendar/nameEvent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({name}),
        });
    
        const data = await response.json();
    
        if (response.ok) {
            return data;
        } else {
            throw new Error(`Error durante la obtención de eventos: ${response}`)
        }
    } catch (error) {
        throw new Error(`Error grave durante la obtención de eventos: ${error}`)
    }
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


setup()


