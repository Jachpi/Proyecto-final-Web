-- PARA USAR CON MYSQL:

CREATE TABLE IF NOT EXISTS Usuarios (
    IDUsuario INT PRIMARY KEY AUTO_INCREMENT,
    Username VARCHAR(100) UNIQUE NOT NULL,
    Password VARCHAR(100) NOT NULL,
    Rol ENUM('Estudiante', 'Profesor', 'Coordinador', 'Dirección', 'Admin') NOT NULL,
    Email VARCHAR(100) NOT NULL);

-- Imagen será una URL o ruta dentro del propio servidor
CREATE TABLE IF NOT EXISTS Evento (
    IDEvento INT PRIMARY KEY AUTO_INCREMENT,
    Nombre VARCHAR(100) NOT NULL,
    Descripcion TEXT NOT NULL,
    Imagen VARCHAR(250) NOT NULL,
    FechaHora DATETIME NOT NULL,
    IDOwner INT NOT NULL,
    Categoria ENUM('Evento para estudiantes','Evento para profesores', 'Evento para comunidad universitaria') NOT NULL,
    Estado ENUM('Pendiente', 'Finalizado', 'Pospuesto') NOT NULL,
    FOREIGN KEY (IDOwner) REFERENCES Usuarios(id));



-- PARA USAR SQLITE:


CREATE TABLE IF NOT EXISTS Usuarios (
    IDUsuario INTEGER PRIMARY KEY AUTOINCREMENT,
    Username TEXT UNIQUE NOT NULL,
    Password TEXT NOT NULL,
    Rol TEXT CHECK(Rol IN ('Estudiante', 'Profesor', 'Coordinador', 'Dirección', 'Admin')) NOT NULL,
    isApproved BOOLEAN NOT NULL,
    Email TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Evento (
    IDEvento INTEGER PRIMARY KEY AUTOINCREMENT,
    Nombre TEXT NOT NULL,
    Descripcion TEXT NOT NULL,
    Imagen TEXT NOT NULL,
    FechaHora DATETIME NOT NULL,
    IDOwner INTEGER NOT NULL,
    Categoria TEXT CHECK(Categoria IN ('Evento para estudiantes', 'Evento para profesores', 'Evento para comunidad universitaria')) NOT NULL,
    Estado TEXT CHECK(Estado IN ('Pendiente', 'Finalizado', 'Pospuesto')) NOT NULL,
    FOREIGN KEY (IDOwner) REFERENCES Usuarios(IDUsuario)
);
