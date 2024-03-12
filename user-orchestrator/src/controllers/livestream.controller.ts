import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LivestreamService } from '../services/livestream.service';
import { LoggerService } from 'src/services/logger.service';
import { ResponseDTO } from 'src/interfaces/response.dto';
import { errorHandler } from 'src/helpers/errHandler';
import { Response } from 'express';
import { RtmpServerExecute } from 'src/helpers/rtmp.server';

@ApiTags('User / Authentication')
@Controller("v1/api/livestream")
export class LivestreamController {
  private readonly logger = LoggerService.create(LivestreamController.name)
  constructor(
    private readonly livestreamService: LivestreamService
  ) {}
  
  @Post('register/key')
  async register(@Res() res: Response): Promise<any> {
    try {
      const user = await this.livestreamService.generateStreamKey();
      const response = new ResponseDTO({ data : user })
      res.status(200).json(response)
    } catch (err) {      
      errorHandler(res, err, this.logger)
    }
  }

  @Get('live/:streamKey')
  async startLivestream(@Res() res: Response, @Param('streamKey') streamKey: string): Promise<any> {
    try {
      const key = await this.livestreamService.verifyStreamKey({key: streamKey});
      if(key){
        RtmpServerExecute(streamKey);
      }
    } catch (err) {      
      errorHandler(res, err, this.logger)
    }
  }

}
