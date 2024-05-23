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
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Author } from './entities/author.entity';

@ApiHeader({ name: 'Authorization' })
@ApiBearerAuth()
@ApiTags('authors')
@UseGuards(JwtGuard)
@Controller('authors')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @ApiOperation({ summary: 'Create author' })
  @ApiResponse({ status: 200, description: 'Created', type: Author })
  @Post()
  @UsePipes(new JoiValidationPipe(createAuthorDTOSchema))
  create(@Body() createAuthorDto: CreateAuthorDto) {
    return this.authorService.create(createAuthorDto);
  }

  @ApiOperation({ summary: 'Get all authors' })
  @ApiResponse({
    status: 200,
    description: 'Find all authors',
    type: [Author],
  })
  @Get()
  findAll() {
    return this.authorService.findAll();
  }

  @ApiOperation({ summary: 'Get author by id' })
  @ApiResponse({
    status: 200,
    description: 'Find author by id',
    type: Author,
  })
  @ApiResponse({
    status: 400,
    description: 'Author id is required',
  })
  @ApiResponse({
    status: 404,
    description: 'Author not found',
  })
  @Get(':id')
  findOne(@Param('id', new JoiValidationPipe(Joi.string().uuid())) id: string) {
    return this.authorService.findOne(id);
  }

  @ApiOperation({ summary: 'Update author' })
  @ApiResponse({
    status: 200,
    description: 'Update author',
    type: null,
  })
  @ApiResponse({
    status: 400,
    description: 'Author id is required',
  })
  @ApiResponse({
    status: 404,
    description: 'Author not found',
  })
  @ApiBody({ type: CreateAuthorDto })
  @Put(':id')
  @UsePipes(new JoiValidationPipe(updateAuthorDTOSchema))
  update(
    @Param('id', new JoiValidationPipe(Joi.string().uuid())) id: string,
    @Body() updateAuthorDto: UpdateAuthorDto,
  ) {
    return this.authorService.update(id, updateAuthorDto);
  }

  @ApiOperation({ summary: 'Delete author' })
  @ApiResponse({
    status: 200,
    description: 'Delete author',
    type: null,
  })
  @Delete(':id')
  remove(@Param('id', new JoiValidationPipe(Joi.string().uuid())) id: string) {
    return this.authorService.remove(id);
  }
}
