CREATE TABLE Usuario (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    sexo ENUM('M', 'F') NOT NULL,
    endereco VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    senha VARCHAR(255) NOT NULL
);
