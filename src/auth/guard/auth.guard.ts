import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import e, { Request } from 'express';
import { firstValueFrom } from 'rxjs';
import { NATS_SERVICE } from 'src/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject(NATS_SERVICE) private readonly natsClient: ClientProxy) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    try {
      const { user, token: newToken } = await firstValueFrom(
        this.natsClient.send('auth.verify.token', token),
      );
      request['user'] = user;
      request['token'] = newToken;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
