import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger("Application")
  app.setGlobalPrefix('/api');
  app.useGlobalPipes( 
    new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    })
  );

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Teslo RESTFull API')
    .setDescription('Teslo Shop API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  
  await app.listen(process.env.PORT);
  logger.log(`App running on port: ${process.env.PORT}`)
}
bootstrap();
