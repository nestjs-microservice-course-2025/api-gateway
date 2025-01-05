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
  async verifyToken(@Request() req) {
    const user = req['user'];
    const token = req['token'];
    return { user, token };
    // try {
    //   const tokenVerification = await firstValueFrom(
    //     this.natsClient.send('auth.verify.token', {}),
    //   );
    //   return tokenVerification;
    // } catch (error) {
    //   throw new RpcException(error);
    // }
  }
}