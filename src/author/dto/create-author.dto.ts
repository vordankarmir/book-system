import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';

export class CreateAuthorDto {
  @ApiProperty({
    example: 'William Shakespeare',
    required: true,
  })
  readonly name: string;

  @ApiProperty({
    example: 'William Shakespeare was an English playwright',
    required: true,
  })
  readonly biography: string;

  @ApiProperty({
    example: '1550-2-18',
    required: true,
  })
  birthday: Date;
}

export const createAuthorDTOSchema = Joi.object({
  name: Joi.string().required(),
  biography: Joi.string().max(250).required(),
  birthday: Joi.date().required(),
});
