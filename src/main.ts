import { NestFactory } from '@nestjs/core'; // import for create app
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import {SwaggerModule, DocumentBuilder } from '@nestjs/swagger';




async function bootstrap() {
  const App = await NestFactory.create(AppModule);

  App.useGlobalPipes(new ValidationPipe());

  App.use(cookieParser());

  App.enableCors({
    origin: 'http://localhost:3000',
    credentials: true, // allow sending cookies
     
  });

  await App.listen(3000);
}

bootstrap();
