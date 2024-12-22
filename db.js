const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Función para abrir la base de datos
async function openDb() {
    return open({
        filename: './sqlite.db',
        driver: sqlite3.Database
    });
}

// Endpoint de Registro (Sign-Up)
app.post('/sign-up', async (req, res) => {
    const { name, password, email, role } = req.body;

    // Validación de campos
    if (!name || !password || !email || !role) {
        return res.status(400).json({ error: "Todos los campos son requeridos." });
    }

    try {
        const db = await openDb();

        // Verificar si el usuario ya existe
        const existingUser = await db.get("SELECT name FROM Usuarios WHERE name = ?", [name]);
        if (existingUser) {
            return res.status(409).json({ error: "Usuario ya existente." });
        }

        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insertar el nuevo usuario
        await db.run(
            "INSERT INTO Usuarios (Username, Password, Email, Rol) VALUES (?, ?, ?, ?)",
            [name, hashedPassword, email, role]
        );

        console.log(`Usuario registrado: ${name}`);
        return res.status(201).json({ message: "Usuario registrado exitosamente." });
    } catch (err) {
        console.error("Error en /sign-up:", err);
        return res.status(500).json({ error: "Error en el servidor." });
    }
});

// Endpoint de Inicio de Sesión (Log-In)
app.post('/log-in', async (req, res) => {
    const { name, password } = req.body;

    // Validación de campos
    if (!name || !password) {
        return res.status(400).json({ error: "Nombre de usuario y contraseña son requeridos." });
    }

    try {
        const db = await openDb();

        // Obtener el usuario por nombre
        const user = await db.get("SELECT * FROM Usuarios WHERE Username = ?", [name]);

        if (!user) {
            return res.status(404).json({ error: "Usuario o contraseña incorrectos." });
        }

        // Comparar la contraseña
        const isPasswordValid = await bcrypt.compare(password, user.Password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Usuario o contraseña incorrectos." });
        }

        console.log(`Usuario autenticado: ${name}`);
        return res.status(200).json({ message: "Usuario autenticado exitosamente." });
    } catch (err) {
        console.error("Error en /log-in:", err);
        return res.status(500).json({ error: "Error en el servidor." });
    }
});

// Inicializar el Servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
