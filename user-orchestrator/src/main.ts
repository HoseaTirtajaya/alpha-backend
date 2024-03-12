import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { ConfigurationService } from './services/config.service';
import { RtmpService } from './providers/rtmp.provider';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = new ConfigurationService();
  app.enableCors();
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    transformOptions: { enableImplicitConversion: true },
    forbidNonWhitelisted: true
  }));
  // app.useGlobalFilters(new HttpExceptionFilter());

  SwaggerModule.setup('api', app, SwaggerModule.createDocument(app, configService.get("swaggerconfig")));
  app.use(helmet());

  // Start the RTMP server
  const rtmpService = new RtmpService();
  rtmpService.startServer();

  // Start the HLS server
  // const hlsService = new HlsService();
  // hlsService.startServer('rtmp://localhost/live/stream', 'path/to/output/dir', 3202);

  await app.listen(configService.get('port'));
}
bootstrap();
