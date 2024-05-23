import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
  UsePipes,
} from '@nestjs/common';
import { AuthorService } from './author.service';
import {
  CreateAuthorDto,
  createAuthorDTOSchema,
} from './dto/create-author.dto';
import {
  UpdateAuthorDto,
  updateAuthorDTOSchema,
} from './dto/update-author.dto';
import { JwtGuard } from '../common/guards/jwt.guard';
import { JoiValidationPipe } from '../common/pipes/validation.pipe';
import * as Joi from 'joi';

@UseGuards(JwtGuard)
@Controller('authors')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Post()
  @UsePipes(new JoiValidationPipe(createAuthorDTOSchema))
  create(@Body() createAuthorDto: CreateAuthorDto) {
    return this.authorService.create(createAuthorDto);
  }

  @Get()
  findAll() {
    return this.authorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new JoiValidationPipe(Joi.string().uuid())) id: string) {
    return this.authorService.findOne(id);
  }

  @Put(':id')
  @UsePipes(new JoiValidationPipe(updateAuthorDTOSchema))
  update(
    @Param('id', new JoiValidationPipe(Joi.string().uuid())) id: string,
    @Body() updateAuthorDto: UpdateAuthorDto,
  ) {
    return this.authorService.update(id, updateAuthorDto);
  }

  @Delete(':id')
  remove(@Param('id', new JoiValidationPipe(Joi.string().uuid())) id: string) {
    return this.authorService.remove(id);
  }
}
