import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User, UserSchema } from '../../schemas/user.schema';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, connect, Model } from 'mongoose';
import { dummyId, userMock } from '../../test/stubs/user.dto.stub';
import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';

describe('UserService', () => {
  let service: UserService;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let userModel: Model<User>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    userModel = mongoConnection.model(User.name, UserSchema);

    const userModule: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getModelToken(User.name), useValue: userModel },
      ],
    }).compile();

    service = userModule.get<UserService>(UserService);
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongod.stop();
  });

  afterEach(async () => {
    const collections = mongoConnection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });

  describe('create user', () => {
    it('should create user and return 200 response', async () => {
      const user = await service.create(userMock);
      expect(user).toHaveProperty('_id');
      expect(user.name).toBe(userMock.name);
    });
  });

  describe('get all users', () => {
    it('should get all users', async () => {
      const userRepository = new userModel(userMock);
      await userRepository.save();

      const users = await service.findAll();
      expect(users[0]).toHaveProperty('_id');
      expect(users[0].name).toEqual(userMock.name);
    });
  });

  describe('get user by id', () => {
    it('should get a user by id', async () => {
      const userRepository = new userModel(userMock);
      const createdUser = await userRepository.save();

      const user = await service.findOne(createdUser._id);
      expect(user.name).toEqual(userMock.name);
    });

    it('should throw 404 if user does not exist', async () => {
      try {
        await service.findOne(dummyId);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }

      // works with this option as well
      // await expect(user).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('update user', () => {
    it('should update user by id', async () => {
      const userRepository = new userModel(userMock);
      const createdUser = await userRepository.save();

      const nameToUpdate = 'Whick';

      const updatedUser = await service.update(createdUser._id, {
        name: nameToUpdate,
      });

      expect(updatedUser.name).toEqual(nameToUpdate);
    });

    it('should throw 404 if user does not exist', async () => {
      try {
        const nameToUpdate = 'Whick';
        await service.update(dummyId, {
          name: nameToUpdate,
        });
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('delete user', () => {
    it('should delete user by id', async () => {
      const userRepository = new userModel(userMock);
      const createdUser = await userRepository.save();

      const deleted = await service.remove(createdUser._id);
      expect(deleted).toBeTruthy();
    });
  });
});
