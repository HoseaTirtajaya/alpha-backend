import { HttpStatus } from '@nestjs/common/enums';
import { RpcException } from '@nestjs/microservices';
import { ConfigurationService } from '../services/config.service';

export function serviceErrorHandler (error: any, config: ConfigurationService) {
    if(!config.get('isProduction')){
      console.log('err auth', error.response?.data ?? error.error ?? error)
    }
    throw new RpcException({
      status: error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      message: error.message ?? error.description ?? "Internal Server Error",
      error: error.response?.data ?? error.error ?? error,
      data: null
    })
}