
let eventList = document.getElementsByClassName("event-list")[0]
let leftButton = document.getElementById("move-left")
let rightButton = document.getElementById("move-right")
let checkBoxes = document.getElementsByClassName("radio")


const now = new Date(); //fecha fija
let fechaRelativa = new Date() // fecha que variará

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


function appendMonthDays(dayAmount, offset, currDay, month = now.getMonth(), year = now.getFullYear()){
    clearGrid()
    offset %= 7
    for (let i = offset*(-1); i <= 36; i++){
        dia = document.createElement("div")
        let dayTxt = document.createElement("p")
        dayTxt.innerHTML = i
        let dailyEvents = document.createElement("p")
        dailyEvents.innerHTML = "_________________"
        if (i <= 0 || dayAmount < i ){
            dia.className = "dia-out-of-bounds"
        }else{
            if(year > fechaRelativa.getFullYear()){ //si es un año anterior
                dia.className = "dia-mes-actual-pasado"
            }
            else if (year < fechaRelativa.getFullYear()){ //si es un año posterior
                dia.className = "dia"
            }else{
                if (month > fechaRelativa.getMonth() || currDay > i){
                    dia.className = "dia-mes-actual-pasado"
                }
                else if (year == fechaRelativa.getFullYear() && month == fechaRelativa.getMonth() && currDay == i){
                    dia.className = "dia-actual"
                }else{
                    dia.className = "dia"
                }
            }
            
            dia.addEventListener('click', (celda) => {
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
                    setTimeout(()=>{clickedDay.className = diaType},200)
                }
            })
            dia.appendChild(dayTxt) //se añade el contenido
            dia.appendChild(dailyEvents) //se añaden los eventos
        }
        eventList.appendChild(dia)
    }
}

function reduceMonth(){
    if (fechaRelativa.getMonth() == 0){
        fechaRelativa.setFullYear(fechaRelativa.getFullYear() - 1)
        fechaRelativa.setMonth(11)
    }else{
        fechaRelativa.setMonth(fechaRelativa.getMonth() - 1)
    }
}

function increaseMonth(){
    if (fechaRelativa.getMonth() == 11){
        fechaRelativa.setFullYear(fechaRelativa.getFullYear() + 1)
        fechaRelativa.setMonth(0)
    }else{
        fechaRelativa.setMonth(fechaRelativa.getMonth() + 1)
    }
}

function displayMonth(){
    document.getElementById("move-left").style.display = "block"
    document.getElementById("move-right").style.display = "block"
    fechaRelativa.setDate(now.getDate())
    console.log(fechaRelativa)
    let dateTextDisplay = document.getElementById("date-text-display")
    dateTextDisplay.innerHTML = new Intl.DateTimeFormat('es-ES',{month: 'long'}).format(fechaRelativa) + " / " + fechaRelativa.getFullYear() //para pasar el mes de hoy a español
    
    let diaOffset = new Date(fechaRelativa.getFullYear(), fechaRelativa.getMonth(), 1).getDay() + 5;
    
    let monthLength //para 28, 29, 30 o 31 días
    if (fechaRelativa.getMonth() == 1){
        //Feb >:(

        let bisiesto = false
        if (fechaRelativa.getFullYear() % 4 == 0){
            if(fechaRelativa.getFullYear() % 100 == 0){
                if(fechaRelativa.getFullYear() % 400 == 0){
                    bisiesto = true
                }
            }else{
                bisiesto = true
            }
        }
        if (bisiesto){
            monthLength = 29
        }else{
            monthLength = 28
        }

    }
    else if (fechaRelativa.getMonth() == 0 || fechaRelativa.getMonth() == 2 || fechaRelativa.getMonth() == 4 || fechaRelativa.getMonth() == 6 || fechaRelativa.getMonth() == 7 || fechaRelativa.getMonth() == 9 || fechaRelativa.getMonth() == 11){
        //31 days
        monthLength = 31
    }
    else{
        //30 days
        monthLength = 30
    }
    appendMonthDays(monthLength, diaOffset, now.getDate())
}

function appendWeekDays(){
    clearGrid()
    const currDay = now.getDay()
    let offsetDay = now.getDate() //para poner el número del día del mes
    for (let i = 1; i <= 7; i++){
        dia = document.createElement("div")
        let dayTxt = document.createElement("p")
        dayTxt.innerHTML = offsetDay - currDay + i
        let dailyEvents = document.createElement("p")
        dailyEvents.innerHTML = "_________________"
        if (i < currDay){
            dia.className = "dia-mes-actual-pasado"
        }else if (i == currDay){
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
            if(clickedDay.className != "dia-clicked"){ //evitar que vuelvan a clicar durante la animación
                if(clickedDay.className == "dia-actual"){ //el día actual necesita una animación ligeramente distinta debido a que el grosor adicional de su borde daba problemas con la animación normal
                    clickedDay.className = "dia-actual-clicked"
                }else{
                    clickedDay.className = "dia-clicked"
                }
                setTimeout(()=>{clickedDay.className = diaType},200)
            }
        })
        dia.appendChild(dayTxt)
        dia.appendChild(dailyEvents)
        eventList.appendChild(dia)
    }

    
}

function displayWeek(){
    document.getElementById("move-left").style.display = "none"
    document.getElementById("move-right").style.display = "none"
    let dateTextDisplay = document.getElementById("date-text-display")
    dateTextDisplay.innerHTML = ""
    appendWeekDays()
}

function reduceDay(){
    fechaRelativa.setTime(fechaRelativa.getTime() - (24*60*60*1000));
    displayDay()
}

function increaseDay(){
    fechaRelativa.setTime(fechaRelativa.getTime() + (24*60*60*1000));
    displayDay()
}

function displayDay(){
    clearGrid(true)
    document.getElementById("move-left").style.display = "block"
    document.getElementById("move-right").style.display = "block"

    let dateTextDisplay = document.getElementById("date-text-display")
    dateTextDisplay.innerHTML = fechaRelativa.getDate() + " / " +new Intl.DateTimeFormat('es-ES',{month: 'long'}).format(fechaRelativa) + " / " + fechaRelativa.getFullYear() //para pasar el mes de hoy a español

    let dia = document.createElement("div")
    dia.className = "unique-dia"
    dia.style.gridColumn = 2
    dia.style.height = "100vh"
    eventList.appendChild(dia)
}


//identificar el display actual del calendario antes de cambiar
leftButton.addEventListener('click', () => {
    if (checkBoxes[0].checked){
        reduceDay()
    }else{
        reduceMonth();
        displayMonth()
        console.log(fechaRelativa.getMonth()+"-"+fechaRelativa.getFullYear())
    }
})

//identificar el display actual del calendario antes de cambiar
rightButton.addEventListener('click', () => {
    if (checkBoxes[0].checked){
        increaseDay()
    }else{
        increaseMonth();
        displayMonth()
        console.log(fechaRelativa.getMonth()+"-"+fechaRelativa.getFullYear())
    }
})

//Cambiar a formato día, semana, mes

checkBoxes[0].addEventListener('click', ()=>{
    fechaRelativa.setTime(now.getTime())
    displayDay()
    eventList.style.gridTemplateRows = "5% 80%"
    eventList.style.gridTemplateColumns = "1fr 2fr 1fr"
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


displayMonth() //carga el mes actual