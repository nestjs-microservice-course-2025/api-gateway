import { Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { NATS_SERVICE } from 'src/config';

@Controller('auth')
export class AuthController {
  constructor(@Inject(NATS_SERVICE) private readonly natsClient: ClientProxy) {}

  @Post('register')
  async registerUser() {
    try {
      const registeredUser = await firstValueFrom(
        this.natsClient.send('auth.register.user', {}),
      );
      return registeredUser;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Post('login')
  async loginUser() {
    try {
      const userAuthenticated = await firstValueFrom(
        this.natsClient.send('auth.login.user', {}),
      );
      return userAuthenticated;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get('verify')
  async verifyToken() {
    try {
      const tokenVerification = await firstValueFrom(
        this.natsClient.send('auth.verify.token', {}),
      );
      return tokenVerification;
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
