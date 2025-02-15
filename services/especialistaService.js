import bcrypt from "bcrypt";
import { pool } from '../lib/db.js';

async function registrarEspecialista(fullName, email, password, phone, state, specialty, cnpj, professionalId) {

    try {
        const [existingUser] = await pool.query('SELECT * FROM Usuario WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            throw new Error("EMAIL_IN_USE");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [userResult] = await pool.query(
            'INSERT INTO Usuario (nome, email, senha, sexo) VALUES (?, ?, ?, ?)',
            [fullName, email, hashedPassword, 'M']
        );
        const userId = userResult.insertId;

        const ddd = phone.slice(0, 2);
        const numero = phone.slice(2);

        await pool.query('INSERT INTO Telefone (ddd, numero, fk_usuario) VALUES (?, ?, ?)', [ddd, numero, userId]);

        await pool.query(
            'INSERT INTO Especialista (nome, especialidade, cnpj , registro_profissional, fk_usuario) VALUES (?, ?, ?, ?, ?)',
            [fullName, specialty, professionalId, cnpj, userId]
        );

        return { message: 'Registro de especialista concluído com sucesso!' }
    } catch (error) {
        throw error
    }
}

export {
    registrarEspecialista
}
