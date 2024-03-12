import { HttpStatus, Injectable } from '@nestjs/common';
import * as crypto from 'crypto-js';
import { SecretKeyDTO } from 'src/interfaces/secret.key.dto';
import { SecretKeys } from 'src/providers/models/secret_key';
import { LoggerService, LoggerTypes } from './logger.service';
import { ModelService } from './model.service';

@Injectable()
export class LivestreamService {
  private readonly logger: LoggerTypes = LoggerService.create(LivestreamService.name)

  constructor(
    private readonly modelService: ModelService,
  ){
  }

  async generateLivestreamKey(): Promise<any> {
    const randomString = crypto.lib.WordArray.random(16).toString(crypto.enc.Hex);
    return this.modelService.secretKeys.create({key: randomString});
  }

  async startLiveStream(payload: SecretKeyDTO): Promise<SecretKeys> {
    const exists = await this.modelService.secretKeys.findOne({where: {key: payload.key}});

    if(!exists){
      throw({
        status: HttpStatus.FORBIDDEN,
        message: "You're forbidden!"
      })
    }
    return exists;
  }
}
