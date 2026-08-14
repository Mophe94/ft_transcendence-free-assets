import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatAppService {
  getHello() {
    return 'Hello';
  }
}
