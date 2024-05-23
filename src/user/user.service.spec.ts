import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { dummyId, userMock } from '../../test/stubs/user.dto.stub';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;

  // eslint-disable-next-line @typescript-eslint/ban-types
  const userRepositoryToken: string | Function = getRepositoryToken(User);

  beforeAll(async () => {
    const userModule: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        ConfigService,
        {
          provide: userRepositoryToken,
          useClass: Repository,
        },
      ],
    }).compile();

    service = userModule.get<UserService>(UserService);
    userRepository = userModule.get<Repository<User>>(userRepositoryToken);
  });

  afterAll(async () => {});

  afterEach(async () => {});

  describe('create user', () => {
    it('should create user and return 200 response', async () => {
      const existingUser = { ...userMock, id: dummyId } as User;

      jest.spyOn(userRepository, 'save').mockResolvedValueOnce(existingUser);

      const user = await service.create(userMock);

      expect(user).toHaveProperty('id');
      expect(userRepository.save).toHaveBeenCalledWith({ ...userMock });
    });
  });

  describe('get user by id', () => {
    it('should get a user by id', async () => {
      const existingUser = { ...userMock, id: dummyId } as User;

      jest
        .spyOn(userRepository, 'findOneBy')
        .mockResolvedValueOnce(existingUser);

      const user = await service.findOne(dummyId);

      expect(user).toHaveProperty('id');
      expect(user.id).toEqual(dummyId);
    });

    it('should throw 404 if user does not exist', async () => {
      try {
        jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(null);

        await service.findOne(dummyId);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('get user by email', () => {
    it('should find user by email', async () => {
      const existingUser = { ...userMock, id: dummyId } as User;

      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(existingUser);

      const user = await service.findByEmail(userMock.email);

      expect(user.id).toEqual(existingUser.id);
      expect(user.email).toEqual(existingUser.email);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: existingUser.email },
      });
    });
  });

  describe('update user', () => {
    it('should update user by id', async () => {
      const existingUser = { ...userMock, id: dummyId } as User;
      const nameToUpdate = 'Whick';

      jest
        .spyOn(userRepository, 'findOneBy')
        .mockResolvedValueOnce(existingUser);

      jest
        .spyOn(userRepository, 'update')
        .mockResolvedValueOnce({ raw: [], generatedMaps: [], affected: 1 });

      await service.update(dummyId, {
        firstName: nameToUpdate,
      });

      expect(userRepository.update).toHaveBeenCalledWith(
        { id: dummyId },
        {
          firstName: nameToUpdate,
        },
      );
    });
  });

  describe('delete user', () => {
    it('should delete user by id', async () => {
      jest
        .spyOn(userRepository, 'delete')
        .mockResolvedValueOnce({ raw: [], affected: 1 });

      await service.remove(dummyId);
      expect(userRepository.delete).toHaveBeenCalledWith(dummyId);
    });
  });
});
