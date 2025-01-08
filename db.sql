-- DEBIDO A QUE SE HACE USO DE SQLITE NO ES NECESARIO CREAR UNA BASE DE DATOS LOCAL, AUN ASÍ A CONTINUACIÓN SE TIENEN LAS SENTENCIAS QUE CREAN TABLAS
-- Y RELACIONES ENTRE ELLAS

-- Evento definition

CREATE TABLE Evento (
    IDEvento INTEGER PRIMARY KEY AUTOINCREMENT,
    Nombre TEXT NOT NULL,
    Descripcion TEXT NOT NULL,
    Imagen TEXT NOT NULL, 
    FechaHora DATETIME NOT NULL,
    IDOwner INTEGER NOT NULL,
    Categoria TEXT 
        CHECK (Categoria IN ('Evento para estudiantes', 'Evento para profesores', 'Evento para comunidad universitaria'))
        NOT NULL,
    Estado TEXT 
        CHECK (Estado IN ('Pendiente', 'Aprobado', 'Terminado'))
        NOT NULL DEFAULT 'Pendiente',
    FechaHoraFin DATETIME NOT NULL DEFAULT '2025-01-01 00:00:00', Ubicacion TEXT,
    FOREIGN KEY (IDOwner) REFERENCES Usuarios(IDUsuario)
);

-- Usuarios definition

CREATE TABLE Usuarios (
    IDUsuario INTEGER PRIMARY KEY AUTOINCREMENT,
    Username TEXT UNIQUE NOT NULL,
    Password TEXT NOT NULL,
    Rol TEXT CHECK(Rol IN ('Estudiante', 'Profesor', 'Coordinador', 'Dirección', 'Admin')) NOT NULL,
    Email TEXT NOT NULL
, isApproved INTEGER DEFAULT (0));