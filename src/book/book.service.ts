import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthorService } from '../author/author.service';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    private authorService: AuthorService,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    try {
      await this.authorService.findOne(createBookDto.authorId);

      const book = await this.bookRepository.save({
        ...createBookDto,
        author: { id: createBookDto.authorId },
      });

      return book;
    } catch (e) {
      throw new BadRequestException({ message: e.message });
    }
  }

  async findAll(): Promise<Book[]> {
    return this.bookRepository.find();
  }

  async findOne(id: string): Promise<Book | null> {
    if (id == null) {
      throw new BadRequestException('Book id is required');
    }

    const book = await this.bookRepository.findOneBy({ id });

    if (book == null) {
      throw new NotFoundException('Book not found');
    }

    return book;
  }

  async update(id: string, updateBookDto: UpdateBookDto): Promise<void> {
    if (id == null) {
      throw new BadRequestException('Book id is required');
    }

    await this.findOne(id);

    await this.bookRepository.update(
      { id },
      updateBookDto.authorId
        ? {
            ...updateBookDto,
            author: { id: updateBookDto.authorId },
          }
        : updateBookDto,
    );
  }

  async remove(id: string): Promise<void> {
    await this.bookRepository.delete(id);
  }
}
