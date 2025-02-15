// Dependências
import express from 'express';
import cors from 'cors';
import router from "./controllers/routes.js";
import swaggerUi from 'swagger-ui-express';
import {specs} from './lib/swaggerDocument.js';
// Configuração do express
const app = express();
const port = 3001; // Porta do servidor

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/', router)

app.listen(port, () => {
    console.log(`Servidor rodando na porta http://localhost:${port}/`);
    console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
});

///////////////////////////////////////////////////////////////////////////////////////////
//FERREIRA NAO APAGA ISSO É O BACK DO CHAT
import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';

dotenv.config();

const wss = new WebSocketServer({ port: 3002 });
const chatMessages = {}; // Armazenamento temporário para mensagens por profissional

wss.on('connection', (ws) => {
  ws.on('error', console.error);

  ws.on('message', (data) => {
    const message = JSON.parse(data);

    if (message.type === 'getHistory') {
      // Enviar histórico de mensagens para o cliente
      const history = chatMessages[message.professionalId] || [];
      ws.send(JSON.stringify(history));
    } else {
      // Salvar mensagem no histórico
      if (!chatMessages[message.professionalId]) {
        chatMessages[message.professionalId] = [];
      }
      chatMessages[message.professionalId].push(message);

      // Enviar mensagem para todos os clientes conectados
      wss.clients.forEach((client) => {
        if (client.readyState === ws.OPEN) {
          client.send(JSON.stringify(message));
        }
      });
    }
  });

  console.log('Cliente conectado');
});