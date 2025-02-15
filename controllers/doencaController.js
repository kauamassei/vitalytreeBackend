import { Router } from "express";
import { buscarDoenca } from "../services/doencaService.js";

const doencaRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Doenças
 *   description: Endpoints relacionados ao gerenciamento de doenças
 */

/**
 * @swagger
 * /buscarDoenca:
 *   get:
 *     summary: Buscar informações sobre uma doença pelo nome
 *     tags: [Doenças]
 *     parameters:
 *       - in: query
 *         name: nome
 *         required: true
 *         schema:
 *           type: string
 *         description: Nome da doença a ser pesquisada
 *     responses:
 *       200:
 *         description: Dados da doença encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 nome:
 *                   type: string
 *                   description: Nome da doença
 *                 descricao:
 *                   type: string
 *                   description: Descrição detalhada da doença
 *                 sintomas:
 *                   type: string
 *                   description: Sintomas associados à doença
 *       500:
 *         description: Erro ao buscar dados
 */
doencaRouter.get('/buscarDoenca', async (req, res) => {
    const { nome } = req.query;

    try {
        const consulta = await buscarDoenca(nome);
        return res.status(200).json(consulta);
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        return res.status(500).json({ error: 'Erro ao buscar dados' });
    }
});


export default doencaRouter;
