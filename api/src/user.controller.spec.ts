import { Test, TestingModule } from '@nestjs/testing';
import { firstValueFrom, Observable, of } from 'rxjs';
import { AvatarService } from './avatar.service';
import { ReqResService } from './reqres.service';
import { UserController } from './user.controller';

describe('UserController', () => {
  let uut: UserController;

  const avatarMock = {
    getAvatar(): Observable<Buffer> {
      return of(Buffer.from('bitmap'));
    },

    deleteAvatar(): void {},
  };

  const reqResMock = {
    getUser(id: number) {
      return of({ id, name: 'John Doe' });
    },
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: AvatarService,
          useValue: avatarMock,
        },
        {
          provide: ReqResService,
          useValue: reqResMock,
        },
      ],
    }).compile();

    uut = app.get(UserController);
  });

  describe('getUser', () => {
    it('should return an user"', async () => {
      expect(JSON.parse(await firstValueFrom(uut.getUser(1)))).toEqual({
        id: 1,
        name: 'John Doe',
      });
    });
  });

  describe('getAvatar', () => {
    it('should return encoded avatar', async () => {
      expect(await firstValueFrom(uut.getAvatar(1))).toBe(
        Buffer.from('bitmap').toString('base64'),
      );
    });
  });

  describe('deleteAvatar', () => {
    it('should delete avatar', async () => {
      const spy = jest.spyOn(avatarMock, 'deleteAvatar');
      uut.deleteAvatar(1);
      expect(spy).toHaveBeenCalled();
    });
  });
});
