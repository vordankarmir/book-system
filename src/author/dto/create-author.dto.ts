import Joi from 'joi';

export class CreateAuthorDto {
  readonly name: string;
  readonly biography: string;
  birthday: Date;
}

export const createAuthorDTOSchema = Joi.object({
  name: Joi.string().required(),
  biography: Joi.string().max(250).required(),
  birthday: Joi.date().required(),
});
