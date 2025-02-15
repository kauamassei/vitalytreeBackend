import { pool } from '../lib/db.js';
import { transporter } from '../lib/nodeMailer.js';


async function confirmarAssinaturaSendEmail(email, plan, paymentMethod) {
    console.log('Dados recebidos:', { email, plan, paymentMethod });

    const mailOptions = {
        from: 'vitalytreecontact@email.com', // Seu e-mail
        to: email, // E-mail do destinatário
        subject: 'Confirmação de Assinatura',
        text: `Sua assinatura foi confirmada com sucesso!\nPlano: ${plan}\nForma de Pagamento: ${paymentMethod}.\nFicamos felizes em te receber, bem-vindo ao VitalyTree🌳🤗!`, // Mensagem em texto
        html: `<p>Sua assinatura foi confirmada com sucesso!</p><p>Plano: ${plan}</p><p>Forma de Pagamento: ${paymentMethod}.</p><p>Ficamos felizes em te receber, bem-vindo ao VitalyTree🌳🤗!</p>`, // Mensagem em HTML
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Erro ao enviar o e-mail:', error); // Log do erro
            return res.status(500).send({ message: 'Erro ao enviar o e-mail', error });
        }
        console.log('E-mail enviado com sucesso:', info); // Log de sucesso
        return res.status(200).send({ message: 'E-mail enviado com sucesso!', info });
    });

}

async function confirmarAssinaturaEmail(email, plan, paymentMethod) {

    try {
        // Verificar se o usuário existe pelo e-mail fornecido
        const [userResult] = await pool.query('SELECT id_usuario FROM Usuario WHERE email = ?', [email]);

        if (userResult.length === 0) {
            throw new Error("USER_NOT_FOUND")
        }

        const userId = userResult[0].id_usuario; // Captura o id_usuario do usuário

        // Registrar a forma de pagamento associada ao usuário na tabela Forma_Pagamento
        const [paymentResult] = await pool.query(`
      INSERT INTO Forma_Pagamento (descricao, tipo, fk_usuario)
      VALUES (?, ?, ?)
    `, [plan, paymentMethod, userId]);

        const paymentId = paymentResult.insertId;

        // Registrar o método de pagamento específico com o fk_forma_pagamento e fk_usuario
        if (paymentMethod === 'pix') {
            await pool.query(`
        INSERT INTO Pix (fk_forma_pagamento, chave_pix, valor, fk_usuario)
        VALUES (?, ?, ?, ?)
      `, [paymentId, `pix-chave-${userId}`, 150.00, userId]);
        } else if (paymentMethod === 'debito') {
            await pool.query(`
        INSERT INTO Debito (fk_forma_pagamento, conta_bancaria, valor, fk_usuario)
        VALUES (?, ?, ?, ?)
      `, [paymentId, `debito-conta-${userId}`, 150.00, userId]);
        } else if (paymentMethod === 'credito') {
            await pool.query(`
        INSERT INTO Credito (fk_forma_pagamento, numero_cartao, vencimento, valor, fk_usuario)
        VALUES (?, ?, ?, ?, ?)
      `, [paymentId, `411111111111${userId.toString().slice(-4)}`, '2024-12-31', 150.00, userId]);
        } else if (paymentMethod === 'boleto') {
            await pool.query(`
        INSERT INTO Boleto (fk_forma_pagamento, codigo_barras, vencimento, valor, fk_usuario)
        VALUES (?, ?, ?, ?, ?)
      `, [paymentId, `123456789012${userId.toString().padStart(6, '0')}`, '2024-12-31', 150.00, userId]);
        } else {
            throw new Error("INVALID_PAGAMENTO")
        }

        return { message: 'Assinatura confirmada e registrada com sucesso' }
    } catch (error) {
        return error
    }
}

export {
    confirmarAssinaturaEmail,
    confirmarAssinaturaSendEmail
}
