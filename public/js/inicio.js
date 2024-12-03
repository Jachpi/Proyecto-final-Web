
let eventList = document.getElementsByClassName("event-list")[0]
const now = new Date();
let dia;


function appendDays(dayAmount, offset, currDay){
    if (offset == 6){
        offset = -1
    }
    for (let i = offset*(-1); i <= dayAmount; i++){
        dia = document.createElement("div")
        let dayTxt = document.createElement("p")
        dayTxt.innerHTML = i
        if (i<=0 || currDay > i){
            dia.className = "dia-pasado"
        }else if (currDay != i){
            dia.className = "dia"+String(i)
            dia.appendChild(dayTxt)
        }else{
            dia.className = "dia-actual"
            dia.appendChild(dayTxt)
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
        diaOffset = 1
        break
    case 2:
        diaOffset = 2
        break
    case 3:
        diaOffset = 3
        break
    case 4:
        diaOffset = 4
        break
    case 5:
        diaOffset = 5
        break
    case 6:
        diaOffset = 6
        break
    case 0:
        break
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







