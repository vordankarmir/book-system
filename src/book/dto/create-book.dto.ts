import Joi from 'joi';

export class CreateBookDto {
  readonly title: string;
  readonly ISBN: string;
  readonly publishedDate: string;
  readonly authorId: string;
}

export const createBookDto = Joi.object({
  title: Joi.string().required(),
  ISBN: Joi.string().required(),
  publishedDate: Joi.date().required(),
  authorId: Joi.string().uuid().required(),
});
