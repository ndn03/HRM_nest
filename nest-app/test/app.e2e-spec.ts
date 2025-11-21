import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/v1/health/check-health (GET)', () => {
    return request(app.getHttpServer())
      .get('/v1/health/check-health')
      .expect(200)
      .expect((response) => {
        expect(response.body.message).toBe('Successfully.');
        expect(response.body.data).toBeDefined();
      });
  });
});
