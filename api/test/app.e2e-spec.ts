import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
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

  it('/api/users (POST)', () => {
    return request(app.getHttpServer())
      .post('/api/users')
      .send({
        id: 100,
        email: 'george.bluth@reqres.in',
        first_name: 'George',
        last_name: 'Bluth',
        avatar: 'https://reqres.in/img/faces/1-image.jpg',
      })
      .expect(201)
      .expect('{"status":"created"}');
  });

  it('/api/user/1 (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/user/1')
      .expect(200)
      .expect(
        '{"id":1,"email":"george.bluth@reqres.in","first_name":"George","last_name":"Bluth","avatar":"https://reqres.in/img/faces/1-image.jpg"}',
      );
  });

  it('/api/user/1/avatar (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/user/1/avatar')
      .expect(200)
      .expect(new RegExp('QAQSkZJRgABAQ'));
  });

  it('/api/user/1/avatar (DELETE)', () => {
    return request(app.getHttpServer())
      .delete('/api/user/1/avatar')
      .expect(200)
      .expect('{"success":true}');
  });
});
