const express = require('express');
const session = require('express-session');
const authRoutes = require('./routes/auth'); 
const path = require('path');

const app = express();

// Configuración de sesiones
app.use(session({
  secret: 'secreto', 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
}));

// Middleware para parsear el cuerpo de las solicitudes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/auth', authRoutes);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en puerto ${PORT}`);
});
