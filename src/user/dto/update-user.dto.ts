import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import * as Joi from 'joi';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  readonly refreshToken?: string;
}

export const updateUserDTOSchema = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string().min(6),
  refreshToken: Joi.string(),
});
