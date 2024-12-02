import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

async function openDb () {
    return open({
      filename: './sqlite.db',
      driver: sqlite3.Database
    })
  }

const app = express();
app.use(cors());
app.use(bodyParser.json());



app.get('/log-in', (req, res) => {
    const { name, password } = req.body;
    console.log(name)
    try {
        const db = openDb();
        const user = db.get('SELECT * FROM Usuarios WHERE name = ? AND password = ?', [name, password]);
        if (user) {
            return res.status(200).send("Usuario logeado");
        } else {
            return res.status(404).send("Usuario o contraseña incorrecto");
        }
    }catch{
        
    }
})

app.post('/sign-up', (req, res) => {
    const {name, password, email, role} = req.body
    const db = openDb();
    const user = db.get("SELECT (name) FROM Usuarios WHERE name = ?",[name])
    if(!user){
        try{
            db.post("INSERT INTO Usuarios (name, password, email, role) values (?,?,?,?)",[name,password,email,role], (err) => {
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

app.listen(3000, () => {
    console.log("Conectado en servidor http://localhost:3000")
})