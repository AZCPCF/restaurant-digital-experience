import {
  ArgumentsHost,
  Catch,
  ConflictException,
  ExceptionFilter,
} from '@nestjs/common';

import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class DatabaseExceptionFilter implements ExceptionFilter {
  catch(error: QueryFailedError & { code?: string }, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse();

    if (error.code === '23505') {
      const exception = new ConflictException('Resource already exists');

      response.status(exception.getStatus()).json(exception.getResponse());

      return;
    }

    response.status(500).json({
      message: 'Internal server error',
    });
  }
}
