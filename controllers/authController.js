import { Router } from "express";
import { loginService, addUserService, findUserService } from "../services/authService.js";

const authRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Authenticação
 *   description: Endpoints de autenticação e gerenciamento de usuários
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Realizar login
 *     tags: [Authenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email do usuário
 *               senha:
 *                 type: string
 *                 description: Senha do usuário
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token de autenticação
 *       401:
 *         description: Email ou senha inválidos
 *       500:
 *         description: Erro interno no servidor
 */
authRouter.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    try {
        const user = await loginService(email, senha);
        console.log("Login bem-sucedido.");
        return res.status(200).json(user);
    } catch (error) {
        if (error.message === "USER_NOT_FOUND" || error.message === "INVALID_PASSWORD") {
            console.log(error.message === "USER_NOT_FOUND" ? "Usuário não encontrado." : "Senha incorreta.");
            return res.status(401).json({ message: 'Email ou senha inválidos' });
        }
        console.error("Erro no login:", error);
        return res.status(500).json({ message: "Erro interno no servidor" });
    }

})


/**
 * @swagger
 * /addUser:
 *   post:
 *     summary: Registrar novo usuário
 *     tags: [Authenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email do usuário
 *               userName:
 *                 type: string
 *                 description: Nome do usuário
 *               password:
 *                 type: string
 *                 description: Senha do usuário
 *               gender:
 *                 type: string
 *                 description: Gênero do usuário
 *               address:
 *                 type: string
 *                 description: Endereço do usuário
 *               phone:
 *                 type: string
 *                 description: Telefone do usuário
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *       400:
 *         description: Email já está em uso
 *       500:
 *         description: Erro ao registrar usuário
 */
authRouter.post('/addUser', async (req, res) => {
    const { email, userName, password, gender, address, phone } = req.body;

    try {
        const responseUser = await addUserService(email, userName, password, gender, address, phone);
        return res.status(201).json(responseUser);
    } catch (error) {
        if (error.message === "EMAIL_IN_USE") {
            return res.status(400).json({ message: 'Usuário já existe' });
        }
        console.error('Erro ao registrar o usuário:', error);
        return res.status(500).json({ message: 'Erro ao registrar usuário' });
    }

});

/**
 * @swagger
 * /perfil/{id}:
 *   get:
 *     summary: Buscar perfil de usuário
 *     tags: [Authenticação]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Dados do usuário encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: ID do usuário
 *                 email:
 *                   type: string
 *                   description: Email do usuário
 *                 userName:
 *                   type: string
 *                   description: Nome do usuário
 *       500:
 *         description: Erro ao buscar informações de perfil
 */
authRouter.get('/perfil/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await findUserService(userId);
        return res.status(200).json(user);
    } catch (error) {
        console.error('Erro ao buscar informações de perfil:', error);
        return res.status(500).json({ message: 'Erro ao buscar informações de perfil' });
    }
});

export default authRouter;
