import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { PlayerJwt } from 'src/games/types/types';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = context.switchToHttp();
    const request: Request & { gameInfo?: PlayerJwt } =
      ctx.getRequest<Request>();
    const token = request.query['token'];

    if (typeof token !== 'string') return false;
    const payload = this.jwtService.decode<PlayerJwt>(token);
    if (!payload) return false;

    request.gameInfo = payload;
    return true;
  }
}
