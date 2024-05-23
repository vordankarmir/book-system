import { Test, TestingModule } from '@nestjs/testing';
import { AuthorService } from './author.service';
import { Author } from './entities/author.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { authorMock, dummyId } from '../../test/stubs/author.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthorService', () => {
  let service: AuthorService;
  let authorRepository: Repository<Author>;

  // eslint-disable-next-line @typescript-eslint/ban-types
  const authorRepositoryToken: string | Function = getRepositoryToken(Author);

  beforeEach(async () => {
    const authorModule: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorService,
        ConfigService,
        {
          provide: authorRepositoryToken,
          useClass: Repository,
        },
      ],
    }).compile();

    service = authorModule.get<AuthorService>(AuthorService);
    authorRepository = authorModule.get<Repository<Author>>(
      authorRepositoryToken,
    );
  });

  afterAll(async () => {});

  afterEach(async () => {});

  describe('create author', () => {
    it('should create author and return 200 response', async () => {
      const existingAuthor = {
        ...authorMock,
        id: dummyId,
      } as unknown as Author;

      jest
        .spyOn(authorRepository, 'save')
        .mockResolvedValueOnce(existingAuthor);

      const author = await service.create(authorMock);

      expect(author).toHaveProperty('id');
      expect(authorRepository.save).toHaveBeenCalledWith({ ...authorMock });
    });
  });

  describe('get all authors', () => {
    it('should find all authors', async () => {
      const exitingAuthor = { ...authorMock, id: dummyId } as unknown as Author;
      jest
        .spyOn(authorRepository, 'find')
        .mockResolvedValueOnce([exitingAuthor]);

      const authors = await service.findAll();

      expect(authors[0]).toHaveProperty('id');
      expect(authors[0].id).toEqual(dummyId);
    });
  });

  describe('get author by id', () => {
    it('should find author by id', async () => {
      const exitingAuthor = { ...authorMock, id: dummyId } as unknown as Author;
      jest
        .spyOn(authorRepository, 'findOneBy')
        .mockResolvedValueOnce(exitingAuthor);

      const author = await service.findOne(dummyId);

      expect(author).toHaveProperty('id');
      expect(author.id).toEqual(dummyId);
    });

    it('should throw error if id is null', async () => {
      try {
        jest.spyOn(authorRepository, 'findOneBy').mockImplementationOnce(() => {
          throw new BadRequestException('Author id is required');
        });

        await service.findOne(null);
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
      }
    });

    it('should throw not found error if author does not exist', async () => {
      try {
        jest.spyOn(authorRepository, 'findOneBy').mockImplementationOnce(() => {
          throw new NotFoundException('Author not found');
        });

        await service.findOne(dummyId);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('update author', () => {
    it('should update author by id', async () => {
      const exitingAuthor = { ...authorMock, id: dummyId } as unknown as Author;
      const nameToUpdate = 'Updated name';
      jest
        .spyOn(authorRepository, 'findOneBy')
        .mockResolvedValueOnce(exitingAuthor);

      jest
        .spyOn(authorRepository, 'update')
        .mockResolvedValueOnce({ raw: [], generatedMaps: [], affected: 1 });

      await service.update(dummyId, { name: nameToUpdate });

      expect(authorRepository.update).toHaveBeenCalledWith(
        { id: dummyId },
        { name: nameToUpdate },
      );
    });

    it('should throw error if id is null', async () => {
      try {
        jest.spyOn(authorRepository, 'update').mockImplementationOnce(() => {
          throw new BadRequestException('Author id is required');
        });

        await service.update(null, {});
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('delete author', () => {
    it('it should delete author by id', async () => {
      jest
        .spyOn(authorRepository, 'delete')
        .mockResolvedValueOnce({ raw: [], affected: 1 });

      await service.remove(dummyId);
      expect(authorRepository.delete).toHaveBeenCalledWith(dummyId);
    });
  });
});
