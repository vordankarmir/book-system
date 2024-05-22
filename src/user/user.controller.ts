import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto, updateUserDTOSchema } from './dto/update-user.dto';
import { JwtGuard } from '../common/guards/jwt.guard';
import * as Joi from 'joi';
import { JoiValidationPipe } from '../common/pipes/validation.pipe';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async findOne(
    @Param('id', new JoiValidationPipe(Joi.string().uuid())) id: string,
  ) {
    return this.userService.findOne(id);
  }

  @Put(':id')
  @UsePipes(new JoiValidationPipe(updateUserDTOSchema))
  async update(
    @Param('id', new JoiValidationPipe(Joi.string().uuid())) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(
    @Param('id', new JoiValidationPipe(Joi.string().uuid())) id: string,
  ) {
    return this.userService.remove(id);
  }
}
