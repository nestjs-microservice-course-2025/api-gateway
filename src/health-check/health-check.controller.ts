import { Controller, Get } from '@nestjs/common';

@Controller('/')
export class HealthCheckController {
  @Get()
  getHealthCheck() {
    return 'client-gateway OK';
  }
}
