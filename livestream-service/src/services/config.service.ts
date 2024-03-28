import { Transport } from '@nestjs/microservices';
import { LIVESTREAM_CONNECTION_NAME } from '../providers/db.provider';

interface envKey {
  port: "port",
  apotekService: 'apotekService',
  distributorService: 'distributorService',
  productService: 'distributorService',
  isProduction: 'isProduction',
  ee_api_key: 'ee_api_key',
  BIP_KEY: 'BIP_KEY',
}

export class ConfigurationService {
  
  private readonly envConfig: { [key: string]: any } = {};
  readonly sequelizeOptions: { [key: string]: any } = {};

  readonly corsOrigins: string[] = [
    "http://localhost:3000"
  ];

  constructor() {
        
    this.envConfig.port = process.env.PORT;
    this.envConfig.isProduction = process.env.NODE_ENV === 'Production' || process.env.NODE_ENV === 'production'

    this.envConfig.ee_api_key = process.env.ELASTICEEMAIL_KEY ?? ''
    this.envConfig.BIP_KEY = process.env.BIP_KEY ?? ''
    
    this.sequelizeOptions = {
      dialect: process.env.FARMANESIA_DB_DIALECT,
      host:
        process.env.NODE_ENV === 'production'
          ? process.env.FARMANESIA_DB_HOST_PROD
          : process.env.FARMANESIA_DB_HOST,
      port: process.env.FARMANESIA_DB_PORT,
      username:
        process.env.NODE_ENV === 'production'
          ? process.env.FARMANESIA_DB_USERNAME_PROD
          : process.env.FARMANESIA_DB_USERNAME,
      password:
        process.env.NODE_ENV === 'production'
          ? process.env.FARMANESIA_DB_PASSWORD_PROD
          : process.env.FARMANESIA_DB_PASSWORD,
      logging: false,
      autoLoadModels: true,
      name: LIVESTREAM_CONNECTION_NAME,
      database: process.env.FARMANESIA_DB_DATABASE,
      synchronize: true,
      sync: {
        force: false, // WARNING !!!! INI KALAU TRUE AKAN BIKIN ULANG TABEL TIAP REFRESH !!!!
        alter: { drop: true }
      }
    };
    
  }

  get(key: keyof envKey): any {
    return this.envConfig[key];
  }

}