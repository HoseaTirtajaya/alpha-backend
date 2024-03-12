import { Transport } from '@nestjs/microservices';
import { DocumentBuilder } from '@nestjs/swagger';

interface envKey {
  port: "port",
  swaggerconfig: 'swaggerconfig',
  livestreamService: 'livestreamService',
  cookiesettings: 'cookiesettings',
  isProduction: 'isProduction',
  cookieName: 'cookieName',
  kycMulterOptions: 'kycMulterOptions',
}

export class ConfigurationService {
  
  private readonly envConfig: { [key: string]: any } = {};

  constructor() {
        
    this.envConfig.port = process.env.PORT;
    this.envConfig.isProduction = process.env.NODE_ENV === 'Production' || process.env.NODE_ENV === 'production'

    this.envConfig.swaggerconfig = new DocumentBuilder()
      .setTitle('Alpha API')
      .setDescription('API description')
      .setVersion('1.0')
      .addTag('User')
      .build();
      
    this.envConfig.livestreamService = {
      options: {
        host: process.env.NODE_ENV === 'production' ? process.env.LIVESTREAM_SERVICE_HOST_PROD : process.env.LIVESTREAM_SERVICE_HOST,
        port: process.env.LIVESTREAM_SERVICE_PORT,
      },
      transport: Transport.TCP,
    };

    this.envConfig.cookieName = 'alphasession'
    this.envConfig.kycMulterOptions = {
      maxSize: 500000
    }
    
    if(process.env.NODE_ENV === 'production'){
      this.envConfig.cookiesettings = {
        httpOnly: true, 
        sameSite: "lax", 
        // domain: '.beever-ecosystem.com'
      }
      this.envConfig.expirecookiesettings = {
        httpOnly: true, 
        sameSite: "lax", 
        // domain: '.beever-ecosystem.com'
      }
    } else {
      this.envConfig.cookiesettings = {
        httpOnly: true, 
        sameSite: "strict"
      }
      this.envConfig.expirecookiesettings = {
        httpOnly: true, 
        sameSite: "strict"
      }
    }
    
  }

  get(key: keyof envKey): any {
    return this.envConfig[key];
  }

}