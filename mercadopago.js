const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const MercadoPago = require("mercadopago");

const app = express();
const port = 3005;

MercadoPago.configurations.setAccessToken("TEST-7014999298970403-112015-bf1dd8bf1281805ed6344d08b16f19e9-2031127060");

app.use(bodyParser.json());

// Endpoint para criar a preferência
app.post("/create-preference", async (req, res) => {
  const { email, plan, paymentMethod } = req.body;

  // Criação do objeto de preferência
  const preference = {
    items: [
      {
        title: plan,
        unit_price: 150, // O valor do plano (substitua pelo valor real)
        quantity: 1,
      },
    ],
    payer: {
      email: email, // O e-mail do usuário
    },
    payment_methods: {
      excluded_payment_types: [
        { id: "ticket" }, // Excluindo algumas formas de pagamento, se necessário
      ],
      installments: 1, // Defina o número de parcelas (caso haja)
    },
    back_urls: {
      success: "http://localhost:5173/sucesso",
      failure: "http://localhost:5173/falha",
      pending: "http://localhost:5173/pendente",
    },
    notification_url: "http://localhost:3000/notification", // URL de notificação para o Mercado Pago
  };

  try {
    const preferenceResponse = await MercadoPago.preferences.create(preference);
    const init_point = preferenceResponse.body.init_point; // URL para o checkout

    // Retorna a URL do checkout para o frontend
    res.json({ init_point });
  } catch (error) {
    console.error("Erro ao criar a preferência:", error);
    res.status(500).send("Erro ao criar a preferência.");
  }
});

app.listen(port, () => {
  console.log(`Backend rodando na porta ${port}`);
});
