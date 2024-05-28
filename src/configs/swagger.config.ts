import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'A simple Express API',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./routes/*.ts'], // path to the API docs
};

// initialize swagger-jsdoc
const swaggerSpec = swaggerJsDoc(swaggerOptions);

export function setupSwagger(app: any) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}