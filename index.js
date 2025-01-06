const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const eventoRoutes = require('./routes/evento');
const adminRoutes = require('./routes/admin');

const app = express();

app.use(session({
  secret: 'secreto', 
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: false,
    sameSite: 'lax'
  }
}));

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Para parsear JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRoutes);
app.use('/evento', eventoRoutes);
app.use('/admin', adminRoutes);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
