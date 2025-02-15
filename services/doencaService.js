import { pool } from '../lib/db.js';

async function buscarDoenca(nome) {

    console.log('Rota /buscarDoenca foi chamada');
    console.log('Parâmetro nome recebido:', nome);

    const query = `
    SELECT d.nome_doenca, d.descricao, r.tipo AS tipo_recomendacao, e.nome AS especialista_nome
    FROM Doenca d
    LEFT JOIN Recomendacoes r ON r.fk_doenca = d.id_doenca
    LEFT JOIN Recomendacao_Especialista re ON re.fk_recomendacao = r.id_recomendacao
    LEFT JOIN Especialista e ON e.id_especialista = re.fk_especialista
    WHERE d.nome_doenca LIKE ?`;

    try {
        const [results] = await pool.query(query, [`%${nome}%`]);
        console.log('Resultados da consulta:', results);
        return results
    } catch (error) {
        throw error
    }

}


export {
    buscarDoenca
}
