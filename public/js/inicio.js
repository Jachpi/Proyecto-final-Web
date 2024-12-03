
let eventList = document.getElementsByClassName("event-list")[0]
const now = new Date();
let dia;


function appendDays(dayAmount, offset, currDay){

 
    if (offset == 6){
        offset = -1
    }
    for (let i = offset*(-1); i <= 36; i++){
        dia = document.createElement("div")
        let dayTxt = document.createElement("p")
        dayTxt.innerHTML = i
        let dailyEvents = document.createElement("p")
        dailyEvents.innerHTML = "_________________"
        if (i <= 0 || dayAmount < i ){
            dia.className = "dia-out-of-bounds"
        }else{
            if (currDay > i){
                dia.className = "dia-mes-actual-pasado"
            }
            else if (currDay != i){
                dia.className = "dia"
            }else{
                dia.className = "dia-actual"
            }
            dia.addEventListener('click', (celda) => {
                celda.stopPropagation() //previene que la animación pueda ser activada por sus hijos de forma individual
                const clickedDay = celda.target
                const diaType = clickedDay.className
                if(clickedDay.className != "dia-clicked"){ //evitar que vuelvan a clicar durante la animación
                    clickedDay.className = "dia-clicked"
                    setTimeout(()=>{clickedDay.className = diaType},200)
                }
            })
            dia.appendChild(dayTxt)
                dia.appendChild(dailyEvents)
        }
            
        

        eventList.appendChild(dia)
    }
}

const month = now.getMonth()
let monthName = ""

switch(month){
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

const diaSemana = new Date(monthName + "1 00:01:00");

let diaNum = diaSemana.getDay()
let diaOffset = 0

switch (diaNum){
    case 1:
        diaOffset = 0
        break
    case 2:
        diaOffset = 1
        break
    case 3:
        diaOffset = 2
        break
    case 4:
        diaOffset = 3
        break
    case 5:
        diaOffset = 4
        break
    case 6:
        diaOffset = 5
        break
    case 0:
        diaOffset = 6
}

if (month == 1){
    //Feb >:(
    appendDays(28, diaOffset, now.getDate())
}
else if (month == 0 || month == 2 || month == 4 || month == 6 || month == 7 || month == 9 || month == 11){
    //31 days
    appendDays(31, diaOffset, now.getDate())
}
else{
    //30 days
    appendDays(30, diaOffset, now.getDate())
}







