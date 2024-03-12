import { HttpStatus } from "@nestjs/common/enums";

export class ResponseDTO {
  readonly status: any | HttpStatus;
  readonly message: string;
  readonly data: any;
  readonly error: any;

  constructor({ status = HttpStatus.OK, message = 'success', data = null, error = null }: { status? : string | HttpStatus, message?: string, data?: any, error?: any }){
    this.status = status;
    this.message = message;
    this.data = data;
    this.error = error;
    if(this.message.includes('ECONNREFUSED')){
      this.status = HttpStatus.INTERNAL_SERVER_ERROR
    }
    return this
  }
}