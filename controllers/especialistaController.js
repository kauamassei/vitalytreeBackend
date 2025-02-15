import { Router } from "express";
import { registrarEspecialista } from "../services/especialistaService.js";


const especialistaRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Especialistas
 *   description: Endpoints relacionados ao gerenciamento de especialistas
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Registrar um especialista no sistema
 *     tags: [Especialistas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 description: Nome completo do especialista
 *               email:
 *                 type: string
 *                 description: E-mail do especialista
 *               password:
 *                 type: string
 *                 description: Senha do especialista
 *               phone:
 *                 type: string
 *                 description: Número de telefone do especialista
 *               state:
 *                 type: string
 *                 description: Estado onde o especialista está localizado
 *               specialty:
 *                 type: string
 *                 description: Especialidade do especialista
 *               cnpj:
 *                 type: string
 *                 description: CNPJ do especialista ou clínica
 *               professionalId:
 *                 type: string
 *                 description: Número de identificação profissional do especialista
 *     responses:
 *       201:
 *         description: Especialista registrado com sucesso
 *       400:
 *         description: E-mail já está em uso
 *       500:
 *         description: Erro ao registrar especialista
 */
especialistaRouter.post('/register', async (req, res) => {
    const { fullName, email, password, phone, state, specialty, cnpj, professionalId } = req.body;

    try {
        const mensagem = await registrarEspecialista(fullName, email, password, phone, state, specialty, cnpj, professionalId);
        return res.status(201).json(mensagem);
    } catch (error) {
        if (error.message === "EMAIL_IN_USE") {
            return res.status(400).json({ message: 'Email já está em uso' });
        }
        console.error('Erro ao registrar especialista:', error);
        return res.status(500).json({ message: 'Erro ao registrar especialista' });
    }

});

export default especialistaRouter;
