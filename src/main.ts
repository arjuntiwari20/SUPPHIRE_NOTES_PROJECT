import { NestFactory } from '@nestjs/core'; // import for create app
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import {SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { JwtGuard } from './common/guards/jwt.guard';




async function bootstrap() {
  const App = await NestFactory.create(AppModule);


  const config = new DocumentBuilder()
  .setTitle('MyNotes_api')
  .setDescription('this is the notes Swagger UI')
  .setVersion('1.0')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
      in: 'header',
    },
    'access_token', // this key will use @apiBearerAuth 
  )
  .build();
  


  const document = SwaggerModule.createDocument(App, config);
  SwaggerModule.setup('api', App, document)

 // App.useGlobalGuards(new JwtGuard());


  App.useGlobalPipes(new ValidationPipe());

  App.use(cookieParser());

  App.enableCors({
    origin: 'http://localhost:3000',
    credentials: true, // allow sending cookies
     
  });

  await App.listen(3000);
}

bootstrap();
