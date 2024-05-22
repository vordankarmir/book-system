import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Author } from './entities/author.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthorService {
  constructor(
    @InjectRepository(Author)
    private authorRepository: Repository<Author>,
  ) {}

  async create(createAuthorDto: CreateAuthorDto): Promise<Author> {
    return this.authorRepository.save(createAuthorDto);
  }

  async findAll(): Promise<Author[]> {
    return this.authorRepository.find();
  }

  async findOne(id: string): Promise<Author | null> {
    if (id == null) {
      throw new BadRequestException('Author id is required');
    }

    const author = await this.authorRepository.findOneBy({ id });

    if (author == null) {
      throw new NotFoundException('Author not found');
    }

    return author;
  }

  async update(id: string, updateAuthorDto: UpdateAuthorDto): Promise<void> {
    if (id == null) {
      throw new BadRequestException('Author id is required');
    }

    const author = await this.findOne(id);

    if (author == null) {
      throw new NotFoundException('Author not found');
    }

    await this.authorRepository.update({ id }, updateAuthorDto);
  }

  async remove(id: string): Promise<void> {
    await this.authorRepository.delete(id);
  }
}
