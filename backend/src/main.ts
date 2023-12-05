import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://127.0.0.1:3000', // L'URL de votre application front-end
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Permet d'inclure les cookies dans la requête CORS ou jwt pour launtentification
  });
  await app.listen(3000);
}
bootstrap();
