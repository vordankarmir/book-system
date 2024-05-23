import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';

export class CreateUserDto {
  @ApiProperty({
    example: 'William',
    required: true,
  })
  readonly firstName: string;

  @ApiProperty({
    example: 'Shakespeare',
    required: true,
  })
  readonly lastName: string;

  @ApiProperty({
    example: 'williamforever@gmail.com',
    required: true,
  })
  readonly email: string;

  @ApiProperty({
    example: 'williamShakespeare4ever',
    required: true,
  })
  readonly password: string;
}

export const signUpSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const signInSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});
