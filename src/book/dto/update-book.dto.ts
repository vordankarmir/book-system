import { PartialType } from '@nestjs/mapped-types';
import { CreateBookDto } from './create-book.dto';
import * as Joi from 'joi';

export class UpdateBookDto extends PartialType(CreateBookDto) {}

export const updateBookDto = Joi.object({
  title: Joi.string(),
  ISBN: Joi.string(),
  publishedDate: Joi.date(),
  authorId: Joi.string().uuid(),
});
