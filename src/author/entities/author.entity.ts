import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Book } from '../../book/entities/book.entity';
import { IsDate } from 'class-validator';

@Entity()
export class Author extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column()
  name: string;

  @Column({ type: 'varchar', length: 250 })
  biography: string;

  @IsDate()
  @Column()
  birthday: Date;

  @OneToMany(() => Book, (book) => book.author)
  books?: Book[];
}
