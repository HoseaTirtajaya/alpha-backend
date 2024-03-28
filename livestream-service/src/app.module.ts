import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { DatabaseModule, LIVESTREAM_CONNECTION_NAME, LivestreamServiceModels } from './providers/db.provider';
import { LoggerService } from './services/logger.service';
import { ModelService } from './services/model.service';
import { LivestreamController } from './controllers/livestream.controller';
import { ConfigurationService } from './services/config.service';
import { LivestreamService } from './services/livestream.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), 
    DatabaseModule,
    SequelizeModule.forFeature(LivestreamServiceModels, LIVESTREAM_CONNECTION_NAME),
  ],
  controllers: [
    LivestreamController
  ],
  providers: [
    ConfigurationService,
    LivestreamService,
    LoggerService,
    ModelService,
  ],
})
export class AppModule {}
