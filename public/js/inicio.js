
let eventList = document.getElementsByClassName("event-list")[0]
let dateTextDisplay = document.getElementById("month-text-display")
let leftButton = document.getElementById("move-left")
let rightButton = document.getElementById("move-right")
let checkBoxes = document.getElementsByClassName("radio")


const now = new Date();
let monthSelected = now.getMonth();
let yearSelected = now.getFullYear();
let dia;

function clearGrid(){
    Array.from(eventList.children).forEach(child => {
        if (!child.classList.contains('weekName')) {
            eventList.removeChild(child);
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
            if(year > yearSelected){ //si es un año anterior
                dia.className = "dia-mes-actual-pasado"
            }
            else if (year < yearSelected){ //si es un año posterior
                dia.className = "dia"
            }else{
                if (month > monthSelected || currDay > i){
                    dia.className = "dia-mes-actual-pasado"
                }
                else if (year == yearSelected && month == monthSelected && currDay == i){
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
    if (monthSelected == 0){
        yearSelected -= 1
        monthSelected = 11
    }else{
        monthSelected -= 1
    }

    displayMonth()
}

function increaseMonth(){
    if (monthSelected == 11){
        yearSelected += 1
        monthSelected = 0
    }else{
        monthSelected += 1
    }

    displayMonth()
}

function displayMonth(){
    switch(monthSelected){
        case 0:
            monthName = "January"
            break
        case 1:
            monthName = "February"
            break
        case 2:
            monthName = "March"
            break
        case 3:
            monthName = "April"
            break
        case 4:
            monthName = "May"
            break
        case 5:
            monthName = "June"
            break
        case 6:
            monthName = "July"
            break
        case 7:
            monthName = "August"
            break
        case 8:
            monthName = "September"
            break
        case 9:
            monthName = "October"
            break
        case 10:
            monthName = "November"
            break
        case 11:
            monthName = "December"
            break
    }
    let fechaRelativa = new Date()
    fechaRelativa.setMonth(monthSelected)
    fechaRelativa.setFullYear(yearSelected)
    fechaRelativa.setDate(now.getDate())
    console.log(fechaRelativa)
    dateTextDisplay.innerHTML = new Intl.DateTimeFormat('es-ES',{month: 'long'}).format(fechaRelativa) //para pasar el mes de hoy a español
    
    let diaNum = fechaRelativa.getDay()
    console.log(diaNum)
    let diaOffset = new Date(yearSelected, monthSelected, 1).getDay() + 5;
    
    if (monthSelected == 1){
        //Feb >:(

        let bisiesto = false

        if (yearSelected % 4 == 0){
            if(yearSelected % 100 == 0){
                if(yearSelected % 400 == 0){
                    bisiesto = true
                }
            }else{
                bisiesto = true
            }
        }
        if (bisiesto){
            appendMonthDays(29, diaOffset, fechaRelativa.getDate())
        }else{
            appendMonthDays(28, diaOffset, fechaRelativa.getDate())
        }

    }
    else if (monthSelected == 0 || monthSelected == 2 || monthSelected == 4 || monthSelected == 6 || monthSelected == 7 || monthSelected == 9 || monthSelected == 11){
        //31 days
        appendMonthDays(31, diaOffset, fechaRelativa.getDate())
    }
    else{
        //30 days
        appendMonthDays(30, diaOffset, fechaRelativa.getDate())
    }
}

function reduceWeek(){

}

function increaseWeek(){

}

function appendWeekDays(){
    clearGrid()
    for (let i = 0; i <= 6; i++){
        dia = document.createElement("div")
        let dailyEvents = document.createElement("p")
        dailyEvents.innerHTML = "_________________"
        dia.className = "dia"
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
            dia.appendChild(dailyEvents)
            eventList.appendChild(dia)
    }

    
}

function displayWeek(){
    dateTextDisplay = 
    appendWeekDays()
}


function reduceDay(){

}

function increaseDay(){

}

function displayDay(){

}



leftButton.addEventListener('click', () => {
    if (checkBoxes[0].checked){
        //TODO
    }else if (checkBoxes[1].checked){
        //TODO
    }else{
        reduceMonth(monthSelected);
        console.log(monthSelected+"-"+yearSelected)
    }
})

rightButton.addEventListener('click', () => {
    if (checkBoxes[0].checked){
        //TODO
    }else if (checkBoxes[1].checked){
        //TODO
    }else{
        increaseMonth(monthSelected);
        console.log(monthSelected+"-"+yearSelected)
    }
})

//Cambiar a formato día, semana, mes

checkBoxes[0].addEventListener('click', ()=>{
    displayDay()
})

checkBoxes[1].addEventListener('click', ()=>{
    displayWeek()
    eventList.style.gridTemplateRows = "3em repeat(1, 80%)"
    eventList.style.rowGap = "5%"
})

checkBoxes[2].addEventListener('click', ()=>{
    displayMonth()
    eventList.style.gridTemplateRows = "3em repeat(6, 1fr)"
    eventList.style.rowGap = "2px"
})


displayMonth() //carga el mes actual