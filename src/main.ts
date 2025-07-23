import   {NestFactory } from '@nestjs/core'; // import for create app 
import {AppModule} from './app.module';



async function bootstrap() {
  const App = await   NestFactory.create(AppModule);

  await App.listen(3000);



}

bootstrap();

