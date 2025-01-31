import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { bot } from './bot/bot'; // Import the bot instance to ensure it runs

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for a specific origin
  app.enableCors({
    origin: '*', // Allow this specific origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // You can specify the allowed methods here
    allowedHeaders: '*', // Specify allowed headers here
  });

  // bot
  //   .launch()
  //   .then(() => {
  //     console.log('Telegram bot is running...');
  //   })
  //   .catch((err) => {
  //     console.error('Error launching the bot:', err);
  //   });

  // Start the NestJS application
  await app.listen(process.env.PORT ?? 3001);
}

bootstrap();
