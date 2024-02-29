import { Request, Response, NextFunction } from 'express';
import {Injectable, NestMiddleware, HttpException, HttpStatus} from '@nestjs/common';

@Injectable()
export class RequestTokenMiddleware implements NestMiddleware {
  async use(request: Request, response: Response, next: NextFunction) {
    const authHeader = request.get('authorization');
    if (!authHeader) {
      throw new HttpException('No auth token', HttpStatus.UNAUTHORIZED);
    }
    const bearerToken: string[] = authHeader.split(' ');
    const token: string = bearerToken[1];
    //@ts-ignore
    request.token  = token; //assign token to request
    
    next();
  }
}