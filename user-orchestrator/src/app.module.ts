import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ClientProxyFactory } from '@nestjs/microservices';
import { MorganInterceptor, MorganModule } from 'nest-morgan';
import { LivestreamController } from './controllers/livestream.controller';
import { AppLoggerMiddleware } from './middlewares/loggerMiddleware';
import { ConfigurationService } from './services/config.service';
import { LivestreamService } from './services/livestream.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MorganModule,
  ],
  controllers: [
    LivestreamController
  ],
  providers: [
    ConfigurationService,
    LivestreamService,
    {
      provide: 'LIVESTREAM_SERVICE',
      useFactory: (configService: ConfigurationService) => {
        const livestreamServiceOptions = configService.get('livestreamService');
        return ClientProxyFactory.create(livestreamServiceOptions);
      },
      inject: [ConfigurationService],
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: MorganInterceptor("combined"),
    },
  ],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppLoggerMiddleware).forRoutes({
      path: '*v1/api*',
      method: RequestMethod.ALL
    })
  }
}

