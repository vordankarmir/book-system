import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { BookService } from './book.service';
import { createBookDto, CreateBookDto } from './dto/create-book.dto';
import { updateBookDto, UpdateBookDto } from './dto/update-book.dto';
import { JwtGuard } from '../common/guards/jwt.guard';
import { JoiValidationPipe } from '../common/pipes/validation.pipe';
import * as Joi from 'joi';
import { Book } from './entities/book.entity';
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiHeader({ name: 'Authorization' })
@ApiTags('books')
@UseGuards(JwtGuard)
@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @ApiOperation({ summary: 'Create book' })
  @ApiResponse({ status: 200, description: 'Created', type: Book })
  @ApiResponse({
    status: 404,
    description: 'Author not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Author id is required',
  })
  @Post()
  @UsePipes(new JoiValidationPipe(createBookDto))
  async create(@Body() createBookDto: CreateBookDto): Promise<Book> {
    return this.bookService.create(createBookDto);
  }

  @ApiOperation({ summary: 'Get all books' })
  @ApiResponse({
    status: 200,
    description: 'Find all books',
    type: [Book],
  })
  @Get()
  async findAll(): Promise<Book[]> {
    return this.bookService.findAll();
  }

  @ApiOperation({ summary: 'Get book by id' })
  @ApiResponse({
    status: 200,
    description: 'Find book by id',
    type: Book,
  })
  @ApiResponse({
    status: 400,
    description: 'Book id is required',
  })
  @ApiResponse({
    status: 404,
    description: 'Book not found',
  })
  @Get(':id')
  async findOne(
    @Param('id', new JoiValidationPipe(Joi.string().uuid())) id: string,
  ): Promise<Book> {
    return this.bookService.findOne(id);
  }

  @ApiOperation({ summary: 'Update book' })
  @ApiResponse({
    status: 200,
    description: 'Update book',
    type: null,
  })
  @ApiResponse({
    status: 400,
    description: 'Book id is required',
  })
  @ApiResponse({
    status: 404,
    description: 'Book not found',
  })
  @ApiBody({ type: CreateBookDto })
  @Put(':id')
  @UsePipes(new JoiValidationPipe(updateBookDto))
  async update(
    @Param('id', new JoiValidationPipe(Joi.string().uuid())) id: string,
    @Body() updateBookDto: UpdateBookDto,
  ): Promise<void> {
    return this.bookService.update(id, updateBookDto);
  }

  @ApiOperation({ summary: 'Delete book' })
  @ApiResponse({
    status: 200,
    description: 'Delete book',
    type: null,
  })
  @Delete(':id')
  async remove(
    @Param('id', new JoiValidationPipe(Joi.string().uuid())) id: string,
  ): Promise<void> {
    return this.bookService.remove(id);
  }
}
