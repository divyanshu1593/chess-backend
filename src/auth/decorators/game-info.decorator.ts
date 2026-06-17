import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { ErrorMessages } from 'src/auth/enums/error.messages.enum';
import { PlayerJwt } from 'src/games/types/types';

export const GameInfo = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();

    if (!request['gameInfo']) {
      throw new BadRequestException(ErrorMessages.GAME_INFO_NOT_IN_REQUEST);
    }

    return request['gameInfo'] as PlayerJwt;
  },
);
