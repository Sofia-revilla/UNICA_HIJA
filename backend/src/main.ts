import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set prefix for APIs
  app.setGlobalPrefix('api');

  // Enable CORS for frontend Next.js routing
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Enable standard validation pipes
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));

  // Port configuration
  const port = process.env.BACKEND_PORT || 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`NestJS REST Engine active on: http://localhost:${port}/api`);
}
bootstrap();
