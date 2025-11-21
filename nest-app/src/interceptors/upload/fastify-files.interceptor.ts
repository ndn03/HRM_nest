import {
  CallHandler,
  ExecutionContext,
  Inject,
  mixin,
  NestInterceptor,
  Optional,
  Type,
  BadRequestException,
} from '@nestjs/common';
import { Multer, Options } from 'multer';
import FastifyMulter from 'fastify-multer'; // Multer integration for Fastify
import { Observable } from 'rxjs';

type MulterInstance = any;

/**
 *
 * A custom NestJS interceptor for handling file uploads using Fastify and Multer.
 * @param fieldConfigs - Array of field configurations. Each object specifies the field name and optional maxCount.
 * @param localOptions - Additional Multer options for file handling, such as size limits.
 * @returns A NestJS Interceptor class to handle file uploads.
 */
export function FastifyFilesInterceptor(
  fieldConfigs: { name: string; maxCount?: number }[], // Configuration for the upload fields
  localOptions: Options, // Options for Multer (e.g., file size limits)
) {
  class MixinInterceptor implements NestInterceptor {
    protected multer: MulterInstance;

    constructor(
      @Optional()
      @Inject('MULTER_MODULE_OPTIONS') // Inject global Multer module options, if available
      options: Multer,
    ) {
      // Combine global options with local options
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

      // Transform field configurations into the format required by Multer
      const multerFields = fieldConfigs.map(({ name, maxCount }) => ({
        name,
        maxCount,
      }));

      // Throw an exception if no fields are configured
      if (multerFields.length === 0) {
        throw new BadRequestException('No file fields configured');
      }

      // Process files using Multer and handle potential errors
      await new Promise<void>((resolve, reject) => {
        this.multer.fields(multerFields)(
          ctx.getRequest(), // Get the request object
          ctx.getResponse(), // Get the response object
          (error: any) => {
            if (error) {
              // Handle errors from Multer and transform them into a BadRequestException
              return reject(
                new BadRequestException(error.message || 'Upload failed'),
              );
            }
            resolve();
          },
        );
      });

      // Proceed to the next handler in the pipeline
      return next.handle();
    }
  }

  // Use mixin to dynamically create the interceptor class
  const Interceptor = mixin(MixinInterceptor);
  return Interceptor as Type<NestInterceptor>;
}
