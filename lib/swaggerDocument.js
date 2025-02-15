import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "VitalyTree",
            version: "1.0.0",
            description: "O VitalyTree tem como objetivo trazer maior visibilidade para tratamentos e informações sobre doenças hereditárias, possibilitando melhor qualidade de vida.",
        },
        servers: [
            {
                url: "http://localhost:3001",
            },
        ],
    },
    apis: [
        "./controllers/routes.js",
        "./controllers/authController.js",
        "./controllers/especialistaController.js",
        "./controllers/clinicaController.js",
        "./controllers/doencaController.js",
        "./controllers/assinaturaController.js",
        "./controllers/mercadoPagoController.js",
    ],
};
const specs = swaggerJsdoc(options);

export {specs}
