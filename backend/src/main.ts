import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: 'http://10.13.1.5:3000', // L'URL de votre application front-end
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Permet d'inclure les cookies dans la requête CORS ou jwt pour launtentification
  });
  await app.listen(3000);
}
bootstrap();
