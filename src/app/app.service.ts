import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  boasVindas(): string {
    return 'Oi, seja muito bem-vindo(a)!'
  }
}
