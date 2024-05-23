import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';

export class CreateBookDto {
  @ApiProperty({
    example: 'Dune',
    required: true,
  })
  readonly title: string;

  @ApiProperty({
    example: '978-3-16-14a84a1a0-0',
    required: true,
  })
  readonly ISBN: string;

  @ApiProperty({
    example: '1550-2-18',
    required: true,
  })
  readonly publishedDate: string;

  @ApiProperty({
    example: 'ff06c7e6-8f5d-4ed2-baee-cbe85aacdcec',
    required: true,
  })
  readonly authorId?: string;
}

export const createBookDto = Joi.object({
  title: Joi.string().required(),
  ISBN: Joi.string().required(),
  publishedDate: Joi.date().required(),
  authorId: Joi.string().uuid().required(),
});
