import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Author } from '../../author/entities/author.entity';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity()
export class Book extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column()
  title: string;

  @Column({ unique: true })
  ISBN: string;

  @Column()
  publishedDate: string;

  @ManyToOne(() => Author, (author) => author.books, {
    cascade: true,
    eager: true,
  })
  @JoinColumn({ name: 'author_id' })
  author?: Author;
}
