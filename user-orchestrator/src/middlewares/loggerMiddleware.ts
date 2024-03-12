import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { Inject } from '@nestjs/common/decorators';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import * as fs from 'fs';
import UserRequest from '../interfaces/app.dto';
import { ConfigurationService } from '../services/config.service';
// import { AuthUserService } from '../services/auth/auth.user.service';
import { LoggerService } from '../services/logger.service';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {

  private readonly logger =  LoggerService.create(AppLoggerMiddleware.name)

  constructor(
    private configService: ConfigurationService,
    // private authService: AuthUserService
  ) {}

  async use(request: UserRequest, response: Response, next: NextFunction): Promise<void> {

    // let access_token = ''
    
    // !!request.headers.cookie && request.headers.cookie.split(';').map((cook: string) => {
    //   if(cook.includes('access_token')){
    //     access_token = cook.split('=')[1]
    //   }
    // })

    // if(!!access_token){
    //   let refresh_token = await this.authService.refreshUser(access_token);
    //   let today = new Date()
    //   let expires = new Date(today.setHours(today.getHours() + 1))
    //   response.cookie("access_token", refresh_token.data, {...this.configService.get('cookiesettings'), expires });
    // }
    if(this.configService.get('isProduction')){
      await new Promise(( resolve, reject) => {
        setTimeout(() => {
          resolve(true)
        }, Math.random() * 3000)
      })
    }
    try {
      const { ip, method, path, body, user, log, params, query, originalUrl } = request;
      const { password, confirmPassword, ...restBody} = body
      if(!!password){
        restBody.password = "### Protected ###"
      }
      if(!!confirmPassword){
        restBody.confirmPassword = "### Protected ###"
      }
      const url = originalUrl
      const { statusCode } = response
      const userAgent = request.get('user-agent');
      const blacklistUrl = [
        'server/log', 
        'v1/api/user/login', 
        'v1/api/distributor/notification'
      ]      
      //////////////
      const logObject = new RequestLog({
        ip,
        method,
        url,
        userAgent,
        body: JSON.stringify(restBody),
        params: JSON.stringify(params),
        query: JSON.stringify(query),
        headers: JSON.stringify(request.headers),
        statusCode: statusCode.toString(),
        response: '',
        userId: null
      })
      request.log = logObject
      //////////////
      let oldJson = response.json;
      let responseBody

      response.json = function (body: any) {
        responseBody = JSON.stringify(body)
        return oldJson.apply(response, arguments)
      }

      response.on('finish', async() => {
        // request.log.response = !!responseBody ? responseBody : 'no data'
        // if(!blacklistUrl.includes(url)){
        //   await this.authService.createLogService({
        //     ...request.log,
        //     response: !!responseBody ? responseBody : 'no data'
        //   })
        // }
      }); 
      ///////////////
    } catch (err) { 
      this.logger.log('Unable to log data, reason: ' + err.message ?? 'Internal Server Error')
    }
    
    next();
  }
}

export class RequestLog {
  ip: string;
  method: string;
  url: string;
  body: string;
  params: string;
  query: string;
  headers: string;
  statusCode: string;
  response: string;
  userId?: number; 
  userAgent?: string;

  constructor(payload: {
    ip: string,
    method: string,
    url: string,
    body: string,
    params: string,
    query: string,
    headers: string,
    statusCode: string,
    response: string,
    userId?: number,
    userAgent?: string
  }){
    this.ip = payload.ip
    this.method = payload.method
    this.url = payload.url
    this.body = payload.body
    this.params = payload.params
    this.query = payload.query
    this.headers = payload.headers
    this.statusCode = payload.statusCode
    this.response = payload.response
    this.userId = payload.userId
    this.userAgent = payload.userAgent
  }
}