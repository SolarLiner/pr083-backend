import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { PackageJson } from './package-json';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const pj = await app.resolve(PackageJson);

  const config = new DocumentBuilder()
    .setTitle('PR083 Web API')
    .setVersion(pj.version)
    .setContact(pj.author.name, pj.author.url, pj.author.email)
    .setLicense(
      pj.license,
      `https://opensource.org/licenses/${pj.license.toUpperCase()}`,
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'authorization',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
  });
  SwaggerModule.setup('', app, document);

  await app.listen(3000, () => {
    new Logger(bootstrap.name).log('Listening on http://localhost:3000/');
  });
}

bootstrap().catch(console.error.bind(console));
