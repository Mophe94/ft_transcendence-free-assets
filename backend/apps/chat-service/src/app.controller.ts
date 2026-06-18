import { Controller, Get } from '@nestjs/common';
import { ChatService } from './app.service';

@Controller()
export class ChatServiceController {
  constructor(private readonly chatServiceService: ChatService) {}

  @Get()
  getHello(): string {
    console.log('wtf');
    return this.chatServiceService.getHello();
  }
}
