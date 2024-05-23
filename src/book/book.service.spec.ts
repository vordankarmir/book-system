/* eslint-disable @typescript-eslint/ban-types */
import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { bookMock, dummyId } from '../../test/stubs/book.dto.stub';
import { AuthorService } from '../author/author.service';
import { Author } from '../author/entities/author.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { authorMock } from '../../test/stubs/author.dto';

describe('BookService', () => {
  let service: BookService;
  let bookRepository: Repository<Book>;
  let authorRepository: Repository<Author>;

  const bookRepositoryToken: string | Function = getRepositoryToken(Book);
  const authorRepositoryToken: string | Function = getRepositoryToken(Author);

  beforeEach(async () => {
    const bookModule: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        AuthorService,
        ConfigService,
        {
          provide: bookRepositoryToken,
          useClass: Repository,
        },
        {
          provide: authorRepositoryToken,
          useClass: Repository,
        },
      ],
    }).compile();

    service = bookModule.get<BookService>(BookService);
    bookRepository = bookModule.get<Repository<Book>>(bookRepositoryToken);
    authorRepository = bookModule.get<Repository<Author>>(
      authorRepositoryToken,
    );
  });

  afterAll(async () => {});

  afterEach(async () => {});

  describe('create book', () => {
    it('should create book and return 200 response', async () => {
      const exitingBook = {
        ...bookMock,
        id: dummyId,
      } as unknown as Book;
      const exitingAuthor = {
        ...authorMock,
        id: dummyId,
      } as unknown as Author;

      jest
        .spyOn(authorRepository, 'findOneBy')
        .mockResolvedValueOnce(exitingAuthor);

      jest.spyOn(bookRepository, 'save').mockResolvedValueOnce(exitingBook);

      const book = await service.create(bookMock);

      expect(book).toHaveProperty('id');
      expect(bookRepository.save).toHaveBeenCalledWith({
        ...bookMock,
        author: {
          id: 'ff06c7e6-8f5d-4ed2-baee-cbe85aacdcec',
        },
      });
    });

    it('should throw error if a book exists with the same ISBN', async () => {
      try {
        const exitingAuthor = {
          ...authorMock,
          id: dummyId,
        } as unknown as Author;

        jest
          .spyOn(authorRepository, 'findOneBy')
          .mockResolvedValueOnce(exitingAuthor);

        jest.spyOn(bookRepository, 'save').mockImplementationOnce(() => {
          throw new BadRequestException('ISBN must be unique');
        });
        await service.create(bookMock);
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('get all books', () => {
    it('should find all books', async () => {
      const exitingBook = { ...bookMock, id: dummyId } as unknown as Book;
      jest.spyOn(bookRepository, 'find').mockResolvedValueOnce([exitingBook]);

      const books = await service.findAll();

      expect(books[0]).toHaveProperty('id');
      expect(books[0].id).toEqual(dummyId);
    });
  });

  describe('get book by id', () => {
    it('should find book by id', async () => {
      const exitingBook = { ...bookMock, id: dummyId } as unknown as Book;
      jest
        .spyOn(bookRepository, 'findOneBy')
        .mockResolvedValueOnce(exitingBook);

      const book = await service.findOne(dummyId);

      expect(book).toHaveProperty('id');
      expect(book.id).toEqual(dummyId);
    });

    it('should throw error if id is null', async () => {
      try {
        jest.spyOn(bookRepository, 'findOneBy').mockImplementationOnce(() => {
          throw new BadRequestException('Book id is required');
        });

        await service.findOne(null);
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
      }
    });

    it('should throw not found error if book does not exist', async () => {
      try {
        jest.spyOn(bookRepository, 'findOneBy').mockImplementationOnce(() => {
          throw new NotFoundException('Book not found');
        });

        await service.findOne(dummyId);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('update book', () => {
    it('should update book by id', async () => {
      const exitingBook = { ...bookMock, id: dummyId } as unknown as Book;
      const titleToUpdate = 'Updated title';
      jest
        .spyOn(bookRepository, 'findOneBy')
        .mockResolvedValueOnce(exitingBook);

      jest
        .spyOn(bookRepository, 'update')
        .mockResolvedValueOnce({ raw: [], generatedMaps: [], affected: 1 });

      await service.update(dummyId, { title: titleToUpdate });

      expect(bookRepository.update).toHaveBeenCalledWith(
        { id: dummyId },
        { title: titleToUpdate },
      );
    });

    it('should throw error if id is null', async () => {
      try {
        jest.spyOn(bookRepository, 'update').mockImplementationOnce(() => {
          throw new BadRequestException('Book id is required');
        });

        await service.update(null, {});
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('delete book', () => {
    it('it should delete book by id', async () => {
      jest
        .spyOn(bookRepository, 'delete')
        .mockResolvedValueOnce({ raw: [], affected: 1 });

      await service.remove(dummyId);
      expect(bookRepository.delete).toHaveBeenCalledWith(dummyId);
    });
  });
});
