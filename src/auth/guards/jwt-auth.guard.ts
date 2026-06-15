import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { PlayerJwt } from 'src/games/types/types';

export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request & { gameInfo: PlayerJwt }>();
    const token = request.headers['authorization'];

    if (!token || !token.startsWith('Bearer ')) return false;
    const payload = this.jwtService.decode<PlayerJwt>(token.slice(7));
    if (!payload) return false;

    request.gameInfo = payload;
    return true;
  }
}
