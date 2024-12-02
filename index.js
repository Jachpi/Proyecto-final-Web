
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const app = express();
const port = 3000;
const path = require('path');
app.use(express.static("public"));
app.use(express.urlencoded());
app.use(cors());
app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
  });

  
async function openDb () {
  return open({
    filename: 'sqlite.db',
    driver: sqlite3.Database
  })
}

app.post('/log-in', async function(req,res) {
  const { name, password } = req.body;
  console.log(name)
  try {
      const db = await openDb();
      const user = await db.get('SELECT * FROM Usuarios WHERE Username = ? AND Password = ?', [name, password]);
      if (user) {
          return res.status(200).send("Usuario logeado");
      } else {
          return res.status(404).send("Usuario o contraseña incorrecto");
      }
  }catch (err){
      console.log(err)
  }
})

app.post('/sign-up', (req, res) => {
  const {name, password, email, role} = req.body
  const db = openDb();
  const user = db.get("SELECT (Username) FROM Usuarios WHERE Username = ?",[name])
  if(!user){
      try{
          db.post("INSERT INTO Usuarios (Username, Password, Email, Rol) values (?,?,?,?)",[name,password,email,role], (err) => {
              if (err) throw err
              return res.status(200).send("Usuario registrado")
          })
      }catch{
          //
      }
  }else{
      return res.status(404).send("Usuario ya existente")
  }
})

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
  });

