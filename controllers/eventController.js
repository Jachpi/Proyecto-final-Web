const User = require('../model/Evento');

exports.events = (req, res) => {
    const {date, type} = req.body
    let filteredDate
    if (type == "month"){
      filteredDate = date.substring(0,7)
      console.log("Searching for events from", filteredDate+"-XX")
    }
  
    User.getCalendarEvents(filteredDate, (err, events) => {
      if(err){
        return res.status(500).json({error: "Error interno del servidor"})
      }
      return res.status(200).json(events);
    })
    
}