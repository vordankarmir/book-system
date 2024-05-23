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

@UseGuards(JwtGuard)
@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @UsePipes(new JoiValidationPipe(createBookDto))
  async create(@Body() createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto);
  }

  @Get()
  async findAll() {
    return this.bookService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id', new JoiValidationPipe(Joi.string().uuid())) id: string,
  ) {
    return this.bookService.findOne(id);
  }

  @Put(':id')
  @UsePipes(new JoiValidationPipe(updateBookDto))
  async update(
    @Param('id', new JoiValidationPipe(Joi.string().uuid())) id: string,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    return this.bookService.update(id, updateBookDto);
  }

  @Delete(':id')
  async remove(
    @Param('id', new JoiValidationPipe(Joi.string().uuid())) id: string,
  ) {
    return this.bookService.remove(id);
  }
}
