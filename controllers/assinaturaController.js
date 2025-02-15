import { Router } from "express";
import { confirmarAssinaturaEmail, confirmarAssinaturaSendEmail } from "../services/assinaturaService.js";

const assinaturaRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Subscription
 *   description: Endpoints relacionados às assinaturas
 */

/**
 * @swagger
 * /confirmarEmail:
 *   post:
 *     summary: Enviar e-mail de confirmação de assinatura
 *     tags: [Subscription]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: E-mail do usuário
 *               plan:
 *                 type: string
 *                 description: Plano escolhido pelo usuário
 *               paymentMethod:
 *                 type: string
 *                 description: Método de pagamento selecionado
 *     responses:
 *       200:
 *         description: E-mail enviado com sucesso
 *       500:
 *         description: Erro ao enviar e-mail de confirmação
 */
assinaturaRouter.post('/confirmarEmail', async (req, res) => {
    const { email, plan, paymentMethod } = req.body; // O e-mail, plano e forma de pagamento do usuário
    return await confirmarAssinaturaSendEmail(email, plan, paymentMethod);

});

/**
 * @swagger
 * /confirmar:
 *   post:
 *     summary: Confirmar assinatura do usuário
 *     tags: [Subscription]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: E-mail do usuário
 *               plan:
 *                 type: string
 *                 description: Plano escolhido pelo usuário
 *               paymentMethod:
 *                 type: string
 *                 description: Método de pagamento selecionado
 *     responses:
 *       200:
 *         description: Assinatura confirmada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensagem de sucesso
 *       400:
 *         description: Método de pagamento inválido
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro ao confirmar assinatura
 */
assinaturaRouter.post('/confirmar', async (req, res) => {
    const { email, plan, paymentMethod } = req.body;

    try {
        const message = await confirmarAssinaturaEmail(email, plan, paymentMethod);
        return res.status(200).json(message);
    } catch (error) {
        if (error.message === "USER_NOT_FOUND") {
            console.error(`Erro: Usuário com e-mail ${email} não encontrado`);
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        if (error.message === "INVALID_PAGAMENTO") {
            console.error(`Erro: Método de pagamento inválido - ${paymentMethod}`);
            return res.status(400).json({ message: 'Método de pagamento inválido' });
        }
        console.error('Erro ao confirmar assinatura:', error);
        return res.status(500).json({ message: 'Erro ao confirmar assinatura' });
    }
});

export default assinaturaRouter;
