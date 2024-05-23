import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Author } from '../../author/entities/author.entity';
import { BaseEntity } from '../../common/entities/base.entity';
import { IsDate, IsISBN } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Book extends BaseEntity {
  @ApiProperty({
    example: 'e2b5ea37-1c02-4bd1-b912-1b09cc08b52c',
  })
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @ApiProperty({
    example: 'Dune',
  })
  @Column()
  title: string;

  @ApiProperty({
    example: '978-3-16-14a84a1a0-0',
  })
  @IsISBN()
  @Column({ unique: true })
  ISBN: string;

  @ApiProperty({
    example: '1550-2-18',
  })
  @IsDate()
  @Column()
  publishedDate: string;

  @ManyToOne(() => Author, (author) => author.books, {
    cascade: true,
    eager: true,
  })
  @JoinColumn({ name: 'author_id' })
  @ApiProperty({ type: () => Author })
  author?: Author;
}
