import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { LIVESTREAM_CONNECTION_NAME } from 'src/providers/db.provider';
import { SecretKeys } from 'src/providers/models/secret_key';

@Injectable()
export class ModelService {
  secretKeys: typeof SecretKeys


  constructor(  
    @InjectModel(SecretKeys, LIVESTREAM_CONNECTION_NAME) private secretKeysModel: typeof SecretKeys,
  ){
    this.secretKeys = this.secretKeysModel
  }

}
