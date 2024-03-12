import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { serviceErrorHandler } from 'src/helpers/errHandler';
import { SecretKeyDTO } from 'src/interfaces/secret.key.dto';
import { ConfigurationService } from 'src/services/config.service';
import { LivestreamService } from 'src/services/livestream.service';
import { LoggerService, LoggerTypes } from 'src/services/logger.service';
import { ModelService } from 'src/services/model.service';

@Controller()
export class LivestreamController {
  private readonly logger: LoggerTypes = LoggerService.create(LivestreamController.name)

  constructor(
    private readonly livestreamService: LivestreamService,
    private readonly config: ConfigurationService
  ) {}

  @MessagePattern('livestream/generate-key')
  async generateLivestreamKey(): Promise<any> {
    try {
      const newUser = await this.livestreamService.generateLivestreamKey()
      return newUser
    } catch (err) {
      serviceErrorHandler(err, this.config)
    }
  }

  @MessagePattern('livestream/verify-key')
  async startLivestream(payload: SecretKeyDTO): Promise<any> {
    try {
      const newUser = await this.livestreamService.startLiveStream(payload)
      return newUser
    } catch (err) {
      serviceErrorHandler(err, this.config)
    }
  }

}
