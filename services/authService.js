import bcrypt from "bcryptjs";
import { pool } from '../lib/db.js';

async function loginService(email, senha) {
    try {
        const [userResult] = await pool.query("SELECT * FROM Usuario WHERE email = ?", [email]);
        if (userResult.length === 0) {
            throw new Error("USER_NOT_FOUND");
        }

        const user = userResult[0];

        const isPasswordValid = await bcrypt.compare(senha, user.senha);
        if (!isPasswordValid) {
            throw new Error("INVALID_PASSWORD");
        }

        return {
            id_usuario: user.id_usuario,
            nome: user.nome,
            email: user.email,
        };
    } catch (error) {
        throw error;
    }
}


async function addUserService(email, userName, password, gender, address, phone) {
    const genderMapping = { 'Masculino': 'M', 'Feminino': 'F', 'Outro': 'O' };
    const genderValue = genderMapping[gender];

    try {
        const [existingUser] = await pool.query('SELECT * FROM Usuario WHERE email = ?', [email]);

        if (existingUser.length > 0) {
            throw new Error("EMAIL_IN_USE");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [userResult] = await pool.query(
            'INSERT INTO Usuario (nome, email, senha, sexo, endereco) VALUES (?, ?, ?, ?, ?)',
            [userName, email, hashedPassword, genderValue, address]
        );

        const userId = userResult.insertId;
        const ddd = phone.slice(0, 2);
        const numero = phone.slice(2);

        await pool.query(
            'INSERT INTO Telefone (ddd, numero, fk_usuario) VALUES (?, ?, ?)',
            [ddd, numero, userId]
        );

        return {
            message: 'Usuário e telefone cadastrados com sucesso!',
            userId: userId
        };
    } catch (error) {
        throw error;
    }
}

async function findUserService(userId) {
    try {
        const [userResult] = await pool.query(`
      SELECT nome, email FROM Usuario WHERE id_usuario = ?
    `, [userId]);

        if (userResult.length === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        const userInfo = userResult[0];

        const [specialistResult] = await pool.query(`
      SELECT especialidade, registro_profissional, cnpj FROM Especialista WHERE fk_usuario = ?
    `, [userId]);

        const specialistInfo = specialistResult.length > 0 ? specialistResult[0] : null;

        const [institutionResult] = await pool.query(`
      SELECT nome AS nome_clinica, cnpj, cep FROM Instituicoes WHERE fk_usuario = ?
    `, [userId]);

        const institutionInfo = institutionResult.length > 0 ? institutionResult[0] : null;


        return {
            user: userInfo,
            specialist: specialistInfo,
            institution: institutionInfo
        };
    } catch (error) {
        throw error;
    }
}


export {
    loginService,
    addUserService,
    findUserService
}

