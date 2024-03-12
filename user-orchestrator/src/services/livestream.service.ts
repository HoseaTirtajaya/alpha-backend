import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { SecretKeyDTO } from 'src/interfaces/livestream.dto';

@Injectable()
export class LivestreamService {
  constructor (
    @Inject('LIVESTREAM_SERVICE') private readonly livestreamServiceClient: ClientProxy
  ) {}
  
  async generateStreamKey(): Promise<any> {
    const authResponse = await firstValueFrom(this.livestreamServiceClient.send("livestream/generate-key", {}))
    return authResponse
  }

  async verifyStreamKey(payload: SecretKeyDTO): Promise<any> {
    const authResponse = await firstValueFrom(this.livestreamServiceClient.send("livestream/verify-key", payload))
    return authResponse
  }
}
