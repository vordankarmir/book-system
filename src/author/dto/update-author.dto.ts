import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthorDto } from './create-author.dto';
import * as Joi from 'joi';

export class UpdateAuthorDto extends PartialType(CreateAuthorDto) {}

export const updateAuthorDTOSchema = Joi.object({
  name: Joi.string(),
  biography: Joi.string().max(250),
  birthday: Joi.date(),
});
