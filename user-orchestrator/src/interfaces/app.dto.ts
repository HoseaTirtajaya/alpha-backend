import { Request } from 'express';
import { RequestLog } from '../middlewares/loggerMiddleware';
import { UserInfo } from './auth.user.dto';

export default interface UserRequest extends Request {
  log?: RequestLog
  user? : UserInfo;
}