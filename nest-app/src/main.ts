import * as fs from 'fs';
import * as path from 'path';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyHelmet from '@fastify/helmet';
import fastifyCompress from '@fastify/compress';
import fastifyRateLimit from '@fastify/rate-limit';
import fastifyCors from '@fastify/cors';
import fastifyMultipart from '@fastify/multipart';
import fastifyCookie from '@fastify/cookie';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UPLOAD_DIR } from './configs/const.config';

// Configure Swagger documentation
const swaggerDocument = new DocumentBuilder()
  .setTitle('Nest Core API Docs') // Set API title
  .setDescription('Built by SOLASHI') // Set API description
  .setVersion('0.0.1') // Set API version
  .addBearerAuth(); // Add Bearer authentication option

// Swagger customization options
const swaggerCustomOptions: SwaggerCustomOptions = {
  swaggerOptions: {
    persistAuthorization: true, // Enable persistence of authorization
    displayRequestDuration: true, // Show request duration
  },
  customSiteTitle: 'Nest Core API Docs', // Set custom site title
};

async function bootstrap() {
  // Initialize the NestJS application using Fastify
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      logger:
        process.env.NODE_ENV === 'production'
          ? ['error'] // Only log errors in production
          : ['error', 'warn', 'verbose', 'log', 'debug'], // Log all levels in non-production
    },
  );

  app.useStaticAssets({
    root: path.join(__dirname, '..', UPLOAD_DIR),
    prefix: `/${UPLOAD_DIR}`, // Định nghĩa tiền tố URL cho các tệp tĩnh
  });

  // Register security headers using Helmet
  await app.register(fastifyHelmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [`'self'`],
        styleSrc: [`'self'`, `'unsafe-inline'`],
        imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
        scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
      },
      reportOnly: true, // Enable CSP in report-only mode
    },
  });

  // Register compression middleware for response compression
  await app.register(fastifyCompress, { encodings: ['gzip', 'deflate'] });

  // Register rate-limiting middleware to control request frequency
  await app.register(fastifyRateLimit, { max: 100, timeWindow: 6000 });

  // Register CORS middleware to allow cross-origin requests
  await app.register(fastifyCors, { origin: '*' });

  // Register multipart handling middleware for file uploads
  await app.register(fastifyMultipart, {
    limits: {
      fieldNameSize: 100000, // Max field name size in bytes
      fieldSize: 10000000, // Max field value size in bytes
      fields: 10, // Max number of non-file fields
      fileSize: 10000000, // Max file size in bytes
      files: 100, // Max number of file fields
      headerPairs: 200000, // Max number of header key-value pairs
    },
  });

  // Register cookie handling middleware
  await app.register(fastifyCookie);

  // Fetch configuration service
  const configService = app.get(ConfigService);

  // Set global API prefix
  app.setGlobalPrefix(`${configService.get('base.prefix')}`);

  // Generate Swagger documentation and save it to a file
  const document = SwaggerModule.createDocument(app, swaggerDocument.build());
  fs.writeFileSync('./swagger-spec.json', JSON.stringify(document));

  // Setup Swagger UI for API documentation
  SwaggerModule.setup(
    process.env.PREFIX_SWAGGER || 'docs',
    app,
    document,
    swaggerCustomOptions,
  );

  // Use global validation pipe with transformation enabled
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Start the application and listen on the configured port
  await app.listen(
    parseInt(configService.get('base.port'), 10) || 3000,
    '0.0.0.0',
  );
}
bootstrap();
