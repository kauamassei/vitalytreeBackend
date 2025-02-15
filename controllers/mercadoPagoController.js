import { Router } from "express";
import { createPreference, createPix } from "../services/mercadoPagoService.js";

const mercadoPagoRouter = Router();

/**
 * @swagger
 * tags:
 *   name: MercadoPago
 *   description: Endpoints relacionados à integração com o MercadoPago
 */

/**
 * @swagger
 * /create-preference:
 *   post:
 *     summary: Criar uma preferência de pagamento no MercadoPago
 *     tags: [MercadoPago]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: E-mail do usuário que está criando a preferência
 *               cpf:
 *                 type: string
 *                 description: CPF do usuário
 *               password:
 *                 type: string
 *                 description: Senha do usuário
 *               price:
 *                 type: number
 *                 description: Valor do pagamento
 *               description:
 *                 type: string
 *                 description: Descrição do pagamento
 *               paymentMethod:
 *                 type: string
 *                 description: Método de pagamento escolhido pelo usuário
 *     responses:
 *       200:
 *         description: URL de redirecionamento para o pagamento
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 init_point:
 *                   type: string
 *                   description: URL do checkout do MercadoPago
 *       401:
 *         description: Email ou senha inválidos
 *       500:
 *         description: Erro ao criar a preferência
 */
mercadoPagoRouter.post("/create-preference", async (req, res) => {
    const { email, cpf, password, price, description, paymentMethod } = req.body;
    try {
        const pagamentoInfo = await createPreference({ email, cpf, password, price, description, paymentMethod })

        // Retorna a URL do checkout para o frontend
        return res.json(pagamentoInfo);
    } catch (error) {
        if (error.message === "USER_NOT_FOUND" || error.message === "INVALID_PASSWORD") {
            console.log(error.message === "USER_NOT_FOUND" ? "Usuário não encontrado." : "Senha incorreta.");
            return res.status(401).json({ message: 'Email ou senha inválidos' });
        }
        console.error("Erro ao criar a preferência:", error);
        return res.status(500).send("Erro ao criar a preferência.");
    }
});

/**
 * @swagger
 * /create-pix:
 *   post:
 *     summary: Create a PIX payment preference
 *     tags: [MercadoPago]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address
 *                 example: user@example.com
 *               cpf:
 *                 type: string
 *                 description: User's CPF (Brazilian individual taxpayer registry)
 *                 example: 12345678900
 *               password:
 *                 type: string
 *                 description: User's password
 *                 example: strongpassword123
 *               price:
 *                 type: number
 *                 description: Payment amount
 *                 example: 150.75
 *               description:
 *                 type: string
 *                 description: Description of the payment
 *                 example: Payment for subscription
 *     responses:
 *       200:
 *         description: PIX payment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 init_point:
 *                   type: string
 *                   description: URL to complete the payment
 *                   example: https://www.mercadopago.com.br/init-point
 *       401:
 *         description: Authentication failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email ou senha inválidos
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erro ao criar a pix.
 */
mercadoPagoRouter.post("/create-pix", async (req, res) => {
    const { email, cpf, password, price, description } = req.body;
    try {
        const pagamentoInfo = await createPix({ email, cpf, password, price, description })

        return res.json(pagamentoInfo);
    } catch (error) {
        if (error.message === "USER_NOT_FOUND" || error.message === "INVALID_PASSWORD") {
            console.log(error.message === "USER_NOT_FOUND" ? "Usuário não encontrado." : "Senha incorreta.");
            return res.status(401).json({ message: 'Email ou senha inválidos' });
        }
        console.error("Erro ao criar a pix:", error);
        return res.status(500).send("Erro ao criar a pix.");
    }
});

export default mercadoPagoRouter;
