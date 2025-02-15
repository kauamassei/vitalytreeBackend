-- Tabela Instituicoes
CREATE TABLE Instituicoes (
    id_instituicao INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    cnpj VARCHAR(18) UNIQUE NOT NULL,
    cep VARCHAR(8),
    fk_usuario INT,
    FOREIGN KEY (fk_usuario) REFERENCES Usuario(id_usuario)
);
