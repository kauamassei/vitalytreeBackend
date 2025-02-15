Create database vitalytree;
use vitalytree;

CREATE TABLE Usuario (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    sexo ENUM('M', 'F') NOT NULL,
    endereco VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    senha VARCHAR(255) NOT NULL
);

CREATE TABLE Telefone (
    id_telefone INT PRIMARY KEY AUTO_INCREMENT,
    ddd CHAR(2) NOT NULL,
    numero VARCHAR(9) NOT NULL,
    fk_usuario INT,
    FOREIGN KEY (fk_usuario) REFERENCES Usuario(id_usuario)
);

CREATE TABLE Doenca (
    id_doenca INT PRIMARY KEY AUTO_INCREMENT,
    nome_doenca VARCHAR(255) NOT NULL,
    data DATE NOT NULL,
    descricao TEXT
);

-- Tabela Instituicoes
CREATE TABLE Instituicoes (
    id_instituicao INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    cnpj VARCHAR(18) UNIQUE NOT NULL,
    cep VARCHAR(8),
    fk_usuario INT,
    FOREIGN KEY (fk_usuario) REFERENCES Usuario(id_usuario)
);

CREATE TABLE Especialista (
    id_especialista INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    especialidade VARCHAR(255),
    cem VARCHAR(20),
    cpf VARCHAR(14) UNIQUE,
    fk_usuario INT,
    FOREIGN KEY (fk_usuario) REFERENCES Usuario(id_usuario)
);

CREATE TABLE Recomendacoes (
    id_recomendacao INT PRIMARY KEY AUTO_INCREMENT,
    tipo VARCHAR(255) NOT NULL,
    duracao INT,
    fk_usuario INT,
    fk_doenca INT,
    FOREIGN KEY (fk_usuario) REFERENCES Usuario(id_usuario),
    FOREIGN KEY (fk_doenca) REFERENCES Doenca(id_doenca)
);


-- Tabela associativa para vincular Especialista a uma Recomendacao
CREATE TABLE Recomendacao_Especialista (
    id_recomendacao_especialista INT PRIMARY KEY AUTO_INCREMENT,
    fk_recomendacao INT,
    fk_especialista INT,
    FOREIGN KEY (fk_recomendacao) REFERENCES Recomendacoes(id_recomendacao),
    FOREIGN KEY (fk_especialista) REFERENCES Especialista(id_especialista)
);

-- Tabela associativa para vincular Instituicoes a uma Recomendacao
CREATE TABLE Instituicao_Recomendacao (
    id_instituicao_recomendacao INT PRIMARY KEY AUTO_INCREMENT,
    fk_instituicao INT,
    fk_recomendacao INT,
    FOREIGN KEY (fk_instituicao) REFERENCES Instituicoes(id_instituicao),
    FOREIGN KEY (fk_recomendacao) REFERENCES Recomendacoes(id_recomendacao)
);




CREATE TABLE Pesquisa_Doenca (
    id_pesquisa_usuario INT PRIMARY KEY AUTO_INCREMENT,
    fk_usuario INT,
    fk_doenca INT,
    FOREIGN KEY (fk_usuario) REFERENCES Usuario(id_usuario),
    FOREIGN KEY (fk_doenca) REFERENCES Doenca(id_doenca)
);




CREATE TABLE Forma_Pagamento (
    id_forma_pagamento INT PRIMARY KEY AUTO_INCREMENT,
    descricao VARCHAR(255),
    tipo ENUM('boleto', 'pix', 'debito', 'credito') NOT NULL
);

CREATE TABLE Pix (
    id_pix INT PRIMARY KEY AUTO_INCREMENT,
    fk_forma_pagamento INT,
    chave_pix VARCHAR(255) NOT NULL,
    valor DECIMAL(10, 2),
    FOREIGN KEY (fk_forma_pagamento) REFERENCES Forma_Pagamento(id_forma_pagamento)
);

CREATE TABLE Debito (
    id_debito INT PRIMARY KEY AUTO_INCREMENT,
    fk_forma_pagamento INT,
    conta_bancaria VARCHAR(255) NOT NULL,
    valor DECIMAL(10, 2),
    FOREIGN KEY (fk_forma_pagamento) REFERENCES Forma_Pagamento(id_forma_pagamento)
);

CREATE TABLE Credito (
    id_credito INT PRIMARY KEY AUTO_INCREMENT,
    fk_forma_pagamento INT,
    numero_cartao VARCHAR(16) NOT NULL,
    vencimento DATE,
    valor DECIMAL(10, 2),
    FOREIGN KEY (fk_forma_pagamento) REFERENCES Forma_Pagamento(id_forma_pagamento)
);

CREATE TABLE Boleto (
    id_boleto INT PRIMARY KEY AUTO_INCREMENT,
    fk_forma_pagamento INT,
    codigo_barras VARCHAR(255) NOT NULL,
    vencimento DATE NOT NULL,
    valor DECIMAL(10, 2),
    FOREIGN KEY (fk_forma_pagamento) REFERENCES Forma_Pagamento(id_forma_pagamento)
);


ALTER TABLE Forma_Pagamento
ADD COLUMN fk_usuario INT,
ADD CONSTRAINT fk_forma_pagamento_usuario
FOREIGN KEY (fk_usuario) REFERENCES Usuario(id_usuario);

-- Adicionar coluna de chave estrangeira fk_usuario na tabela Pix
ALTER TABLE Pix
ADD COLUMN fk_usuario INT,
ADD CONSTRAINT fk_pix_usuario
FOREIGN KEY (fk_usuario) REFERENCES Usuario(id_usuario);

-- Adicionar coluna de chave estrangeira fk_usuario na tabela Debito
ALTER TABLE Debito
ADD COLUMN fk_usuario INT,
ADD CONSTRAINT fk_debito_usuario
FOREIGN KEY (fk_usuario) REFERENCES Usuario(id_usuario);

-- Adicionar coluna de chave estrangeira fk_usuario na tabela Credito
ALTER TABLE Credito
ADD COLUMN fk_usuario INT,
ADD CONSTRAINT fk_credito_usuario
FOREIGN KEY (fk_usuario) REFERENCES Usuario(id_usuario);

-- Adicionar coluna de chave estrangeira fk_usuario na tabela Boleto
ALTER TABLE Boleto
ADD COLUMN fk_usuario INT,
ADD CONSTRAINT fk_boleto_usuario
FOREIGN KEY (fk_usuario) REFERENCES Usuario(id_usuario);

INSERT INTO Usuario (nome, sexo, endereco, email, senha) VALUES
('João Silva', 'M', 'Rua A, 123', 'joao.silva@example.com', 'senha123'),
('Maria Oliveira', 'F', 'Rua B, 456', 'maria.oliveira@example.com', 'senha456'),
('Carlos Pereira', 'M', 'Rua C, 789', 'carlos.pereira@example.com', 'senha789');

INSERT INTO Especialista (nome, especialidade, cem, cpf, fk_usuario) VALUES
('Dr. João Silva', 'Endocrinologia', '12345', '123.456.789-10', 1),
('Dra. Maria Oliveira', 'Cardiologia', '67890', '987.654.321-00', 2),
('Dr. Carlos Pereira', 'Pneumologia', '54321', '321.654.987-30', 3);

INSERT INTO Doenca (id_doenca, nome_doenca, data, descricao)
VALUES
(1, 'Hemofilia A', '1803-01-01', 'Doença hereditária caracterizada por um distúrbio de coagulação, devido à deficiência do fator VIII. O primeiro caso conhecido foi registrado no início do século XIX, sendo observado em membros da realeza europeia.'),
(2, 'Diabetes', '1552-01-01', 'Doença crônica caracterizada por níveis elevados de glicose no sangue. Referências a sintomas de diabetes aparecem já em antigos textos egípcios, datando de 1552 a.C., e a condição foi formalmente descrita na medicina antiga.'),
(3, 'Fibrose Cística', '1938-01-01', 'Doença genética que afeta principalmente os pulmões e o sistema digestivo. Foi identificada pela primeira vez em 1938 por Dorothy Andersen, que descreveu sua patologia em detalhes.'),
(4, 'Hipertensão', '1896-01-01', 'Condição caracterizada por pressão arterial elevada. A hipertensão foi descrita pela primeira vez em 1896, quando a pressão arterial começou a ser medida por esfigmomanômetros.'),
(5, 'Obesidade', '4000-01-01', 'A obesidade foi documentada desde a pré-história e representada em figuras como a Vênus de Willendorf, datada de aproximadamente 4000 a.C. A condição envolve o acúmulo excessivo de gordura no corpo, e foi documentada como um problema de saúde pública desde então.'),
(6, 'Câncer', '1600-01-01', 'O câncer é uma categoria de doenças que envolve o crescimento desordenado de células. O primeiro caso documentado remonta ao papiro de Edwin Smith, datado de cerca de 1600 a.C., onde foram descritos tumores removidos cirurgicamente.');

INSERT INTO Doenca (nome_doenca, data, descricao) VALUES
('Diabetes', '2023-01-15', 'Doença crônica caracterizada por altos níveis de açúcar no sangue.'),
('Hipertensão', '2023-02-10', 'Pressão alta persistente nas artérias.'),
('Asma', '2023-03-05', 'Doença inflamatória crônica das vias respiratórias.');


INSERT INTO Recomendacoes (tipo, duracao, fk_usuario, fk_doenca) VALUES
('Controle de açúcar no sangue e dieta equilibrada', 90, 1, 11),
('Controle da pressão arterial e exercícios leves', 60, 2, 12),
('Uso de broncodilatadores e evitar alérgenos', 30, 3, 13);


INSERT INTO Recomendacao_Especialista (fk_recomendacao, fk_especialista) VALUES
(4, 30),
(5, 31),
(6, 32);

ALTER TABLE Especialista
    CHANGE COLUMN cpf cnpj VARCHAR(18) UNIQUE,
    CHANGE COLUMN cem registro_profissional VARCHAR(20);

