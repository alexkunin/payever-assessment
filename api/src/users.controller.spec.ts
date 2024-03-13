import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { firstValueFrom, Observable, of } from 'rxjs';
import { ReqResService } from './reqres.service';
import { UsersController } from './users.controller';

describe('UserController', () => {
  let uut: UsersController;

  const reqResMock = {
    createUser(): Observable<void> {
      return of(void 0);
    },
  };

  const eventEmitterMock = {
    emit() {},
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: ReqResService,
          useValue: reqResMock,
        },
        {
          provide: EventEmitter2,
          useValue: eventEmitterMock,
        },
      ],
    }).compile();

    uut = app.get(UsersController);
  });

  describe('createUser', () => {
    it('should create an user"', async () => {
      const spy = jest.spyOn(reqResMock, 'createUser');
      const res = await firstValueFrom(
        uut.createUser({
          id: 1,
          email: 'email@example.net',
          first_name: 'John',
          last_name: 'Doe',
          avatar: 'https://some.url.com',
        }),
      );
      expect(spy).toHaveBeenCalled();
      expect(JSON.parse(res)).toEqual({
        status: 'created',
      });
    });

    it('should emit an event', async () => {
      const spy = jest.spyOn(eventEmitterMock, 'emit');
      await firstValueFrom(
        uut.createUser({
          id: 1,
          email: 'email@example.net',
          first_name: 'John',
          last_name: 'Doe',
          avatar: 'https://some.url.com',
        }),
      );
      expect(spy).toHaveBeenCalled();
    });
  });
});
