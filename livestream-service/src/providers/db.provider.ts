import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigurationService } from 'src/services/config.service';
import { SecretKeys } from './models/secret_key';

export const LIVESTREAM_CONNECTION_NAME = 'LivestreamAlpha'

export const LivestreamServiceModels = [
  SecretKeys
]

const databaseProviders = [
  SequelizeModule.forRootAsync({
    name: LIVESTREAM_CONNECTION_NAME,
    imports: [ConfigModule],
    useFactory: async () => {
      const configService = new ConfigurationService();
      return {
        ...configService.sequelizeOptions,
        models: LivestreamServiceModels,
      }
    },
  }),
];

@Module({
  imports: databaseProviders
})

export class DatabaseModule {}