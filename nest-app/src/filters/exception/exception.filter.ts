import {
  ExceptionFilter as ExceptionFilterNC,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { EntityNotFoundError, QueryFailedError, TypeORMError } from 'typeorm';

// The @Catch decorator is used to specify which exceptions the filter will catch.
// This filter will handle HttpExceptions, QueryFailedError, EntityNotFoundError, and TypeORMError.
@Catch(HttpException, QueryFailedError, EntityNotFoundError, TypeORMError)
export class ExceptionFilter implements ExceptionFilterNC {
  private readonly logger = new Logger(ExceptionFilter.name); // Logger to log exception details

  // Catch method is executed whenever an exception is thrown in the application
  catch(exception: unknown, host: ArgumentsHost) {
    // Switch to the HTTP context to access the request and response objects
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>(); // Get the Fastify response object
    const request = ctx.getRequest<FastifyRequest>(); // Get the Fastify request object

    // Default values for status and message
    let status = HttpStatus.INTERNAL_SERVER_ERROR; // Default status is 500 (Internal Server Error)
    let message = 'Internal server error'; // Default message

    // If the exception is an instance of HttpException, extract the status and message from it
    if (exception instanceof HttpException) {
      status = exception.getStatus(); // Get the status code from the HttpException
      const errorResponse = exception.getResponse(); // Get the response object of the HttpException
      message =
        typeof errorResponse === 'string'
          ? errorResponse
          : (errorResponse as any).message || 'Request Failed!';
    }

    // If the exception is related to TypeORM errors (QueryFailedError, TypeORMError, EntityNotFoundError)
    if (
      exception instanceof QueryFailedError ||
      exception instanceof TypeORMError ||
      exception instanceof EntityNotFoundError
    ) {
      status = HttpStatus.BAD_REQUEST; // Set the status code to 400 (Bad Request) for TypeORM errors
      message = exception.message; // Use the error message from the exception
    }

    // Log the exception details with the request method and URL
    this.logger.error(
      `🚨 [Exception] ${request.method} ${request.url}: ${message}`,
    );

    // Send the formatted response with status, message, request path, and timestamp
    response.status(status).send({
      error: true,
      statusCode: status,
      message: message,
      path: request.url,
      timestamp: new Date().toISOString(), // Timestamp for when the exception was handled
    });
  }
}
