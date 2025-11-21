import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Inject,
  mixin,
  NestInterceptor,
  Optional,
  Type,
} from '@nestjs/common';
import FastifyMulter from 'fastify-multer';
import { Options, Multer } from 'multer';
import { Observable } from 'rxjs';

type MulterInstance = any;

/**
 *
 * A custom NestJS interceptor for handling single file uploads using Fastify and Multer.
 * @param fieldName - The name of the field expected in the request for the file upload.
 * @param localOptions - Options for Multer, such as file size limits or other constraints.
 * @returns A NestJS Interceptor class to handle single file uploads.
 */
export function FastifyFileInterceptor(
  fieldName: string, // Name of the field for the uploaded file
  localOptions: Options, // Multer options for file upload configuration
) {
  class MixinInterceptor implements NestInterceptor {
    protected multer: MulterInstance;

    constructor(
      @Optional()
      @Inject('MULTER_MODULE_OPTIONS') // Optionally inject global Multer module options
      options: Multer,
    ) {
      // Combine global Multer options with local options specific to this interceptor
      this.multer = (FastifyMulter as any)({ ...options, ...localOptions });
    }

    /**
     *
     * Intercepts the incoming request and applies file upload logic using Multer.
     * @param context - The execution context of the request.
     * @param next - The next handler in the request pipeline.
     * @returns An Observable that proceeds to the next handler after file processing.
     */
    async intercept(
      context: ExecutionContext,
      next: CallHandler<any>,
    ): Promise<Observable<any>> {
      const ctx = context.switchToHttp(); // Switch to HTTP context to access request and response objects

      // Process the file upload using Multer's `single` method
      await new Promise<void>((resolve, reject) => {
        return this.multer.single(fieldName)(
          ctx.getRequest(), // Get the request object
          ctx.getResponse(), // Get the response object
          (error: Error) => {
            if (error) {
              // Handle Multer errors and transform them into a NestJS BadRequestException
              return reject(
                new BadRequestException(error.message || 'Upload failed'),
              );
            }
            resolve(); // Resolve the promise if no errors occurred
          },
        );
      });

      // Proceed to the next handler in the pipeline
      return next.handle();
    }
  }

  // Dynamically create the interceptor class using mixin
  const Interceptor = mixin(MixinInterceptor);
  return Interceptor as Type<NestInterceptor>;
}
