import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  UsePipes,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto, updateUserDTOSchema } from './dto/update-user.dto';
import { JwtGuard } from '../common/guards/jwt.guard';
import * as Joi from 'joi';
import { JoiValidationPipe } from '../common/pipes/validation.pipe';
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@ApiHeader({ name: 'Authorization' })
@ApiBearerAuth('Authorization')
@ApiTags('users')
@UseGuards(JwtGuard)
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get user by id' })
  @ApiResponse({
    status: 200,
    description: 'Find user by id',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @Get(':id')
  async findOne(
    @Param('id', new JoiValidationPipe(Joi.string().uuid())) id: string,
  ) {
    return this.userService.findOne(id);
  }

  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({
    status: 200,
    description: 'Update user',
    type: null,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiBody({ type: CreateUserDto })
  @Put(':id')
  @UsePipes(new JoiValidationPipe(updateUserDTOSchema))
  async update(
    @Param('id', new JoiValidationPipe(Joi.string().uuid())) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({
    status: 200,
    description: 'Delete user',
    type: null,
  })
  @Delete(':id')
  async remove(
    @Param('id', new JoiValidationPipe(Joi.string().uuid())) id: string,
  ) {
    return this.userService.remove(id);
  }
}
