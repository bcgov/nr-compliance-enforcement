import {Request, Response, NextFunction} from 'express';
import {Injectable, NestMiddleware, Logger, HttpException, HttpStatus} from '@nestjs/common';

@Injectable()
export class HTTPLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const {method, originalUrl} = request;

    const authHeader = request.header('authorization');
    if (!authHeader) {
      throw new HttpException('No auth token', HttpStatus.UNAUTHORIZED);
    }
    const bearerToken: string[] = authHeader.split(' ');
    const token: string = bearerToken[1];

    //@ts-ignore
    request.token  = token;

    response.on('finish', () => {
      const {statusCode} = response;
      const hostedHttpLogFormat = `${method} ${originalUrl} ${statusCode} - ${request.get('user-agent')}`;
      this.logger.log(hostedHttpLogFormat);
    });

    next();
  }
}
