import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { NATS_SERVICE } from 'src/config';
import { LoginUserDto, RegisterUserDto } from './dto';
import { AuthGuard } from './guard/auth.guard';
import { Token, User } from './decorators';
import { CurrentUser } from './interfaces/current-user.interface';

@Controller('auth')
export class AuthController {
  constructor(@Inject(NATS_SERVICE) private readonly natsClient: ClientProxy) {}

  @Post('register')
  async registerUser(@Body() registerUserDto: RegisterUserDto) {
    try {
      const registeredUser = await firstValueFrom(
        this.natsClient.send('auth.register.user', registerUserDto),
      );
      return registeredUser;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Post('login')
  async loginUser(@Body() loginUserDto: LoginUserDto) {
    try {
      const userAuthenticated = await firstValueFrom(
        this.natsClient.send('auth.login.user', loginUserDto),
      );
      return userAuthenticated;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Get('verify')
  async verifyToken(@User() user: CurrentUser, @Token() token: string) {
    return { user, token };
  }
}
