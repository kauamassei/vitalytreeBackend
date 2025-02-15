import { Router } from "express";
import { registrarClinica } from "../services/clinicaService.js";

const clinicaRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Clínicas
 *   description: Endpoints relacionados ao gerenciamento de clínicas
 */

/**
 * @swagger
 * /regClinica:
 *   post:
 *     summary: Registrar nova clínica
 *     tags: [Clínicas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome da clínica
 *               cnpj:
 *                 type: string
 *                 description: CNPJ da clínica
 *               cep:
 *                 type: string
 *                 description: CEP da clínica
 *               phone:
 *                 type: string
 *                 description: Telefone da clínica
 *               email:
 *                 type: string
 *                 description: Email da clínica
 *               password:
 *                 type: string
 *                 description: Senha da clínica
 *     responses:
 *       201:
 *         description: Clínica registrada com sucesso
 *       400:
 *         description: O email já está em uso
 *       500:
 *         description: Erro interno no servidor
 */
clinicaRouter.post('/regClinica', async (req, res) => {
    const { name, cnpj, cep, phone, email, password } = req.body;
    try {
        const message = await registrarClinica(name, cnpj, cep, phone, email, password)
        return res.status(201).json(message);
    } catch (error) {
        if (error.message === "EMAIL_IN_USE") {
            console.log('Erro: Email já está em uso');
            return res.status(400).send(); // Resposta genérica para o frontend
        } else if (error.message === "HASH_PASSWORD_FAILD") {
            console.log('Erro ao criptografar a senha');
            return res.status(500).send(); // Resposta genérica para o frontend
        } else if (error.message === "USER_NOT_FOUND") {
            console.log('Erro ao inserir usuário');
            return res.status(500).send(); // Resposta genérica para o frontend
        } else if (error.message === "INSTITUTO_NOT_AFFECTED") {
            console.log('Erro ao inserir instituição');
            return res.status(500).send(); // Resposta genérica para o frontend
        } else if (error.message === "TELEFONE_NOT_AFFECTED") {
            console.log('Erro ao inserir telefone');
            return res.status(500).send(); // Resposta genérica para o frontend
        }
        console.error('Erro ao registrar clínica:', error);
        return res.status(500).json({ message: "Erro interno no servidor" });
    }
});

export default clinicaRouter;
