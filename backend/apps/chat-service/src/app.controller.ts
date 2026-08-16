import { Controller, Get } from '@nestjs/common';
import { ChatAppService } from './app.service';

@Controller()
export class ChatServiceController {
  constructor(private readonly appService: ChatAppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
