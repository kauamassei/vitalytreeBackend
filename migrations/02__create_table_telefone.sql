CREATE TABLE Telefone (
    id_telefone INT PRIMARY KEY AUTO_INCREMENT,
    ddd CHAR(2) NOT NULL,
    numero VARCHAR(9) NOT NULL,
    fk_usuario INT,
    FOREIGN KEY (fk_usuario) REFERENCES Usuario(id_usuario)
);
