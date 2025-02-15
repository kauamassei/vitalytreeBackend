import bcrypt from "bcryptjs";
import { pool } from '../lib/db.js';

async function registrarClinica(name, cnpj, cep, phone, email, password) {
    try {
        const [existingUser] = await pool.query('SELECT * FROM Usuario WHERE email = ?', [email]);

        if (existingUser.length > 0) {
            throw new Error("EMAIL_IN_USE")
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        if (!hashedPassword) {
            throw new Error("HASH_PASSWORD_FAILD")
        }

        const [userResult] = await pool.query(`INSERT INTO Usuario (nome, email, senha) VALUES (?, ?, ?)`, [name, email, hashedPassword]);

        const userId = userResult.insertId; // Captura o ID do usuário recém-criado

        if (!userId) {
            throw new Error("USER_NOT_FOUND")
        }

        const [instituicaoResult] = await pool.query(`INSERT INTO Instituicoes (nome, cnpj, cep, fk_usuario) VALUES (?, ?, ?, ?)`, [name, cnpj, cep, userId]);

        if (!instituicaoResult.affectedRows) {
            throw new Error("INSTITUTO_NOT_AFFECTED")
        }

        const ddd = phone.substring(0, 2);
        const numero = phone.substring(2);

        const [telefoneResult] = await pool.query(`INSERT INTO Telefone (ddd, numero, fk_usuario) VALUES (?, ?, ?)`, [ddd, numero, userId]);

        if (!telefoneResult.affectedRows) {
            throw new Error("TELEFONE_NOT_AFFECTED")
        }

        console.log('Registro de clínica concluído com sucesso');
        return {message:"Registro de clínica concluído com sucesso"}
    } catch (error) {
        throw error
    }
}

export {
    registrarClinica
}
