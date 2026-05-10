import Fastify from 'fastify';

const fastify = Fastify({ logger: true });

// Move your logic inside an async function
async function bootstrap() {
  try {
    // 1. Register Socket.io with the CORS fixes from the previous step
    await fastify.register(require('fastify-socket.io'), {
      cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
      }
    });

    // 2. Add your health check
    fastify.get('/health', async () => {
      return { status: 'ok', project: 'Cipher API' };
    });

    // 3. Start the server
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    
    console.log('🚀 Cipher Real-time Gateway running at http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

// Call the function
bootstrap();