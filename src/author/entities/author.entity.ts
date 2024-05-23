import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Book } from '../../book/entities/book.entity';
import { IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Author extends BaseEntity {
  @ApiProperty({
    example: 'e2b5ea37-1c02-4bd1-b912-1b09cc08b52c',
  })
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @ApiProperty({
    example: 'William Shakespeare',
  })
  @Column()
  name: string;

  @ApiProperty({
    example: 'William Shakespeare was an English playwright',
  })
  @Column({ type: 'varchar', length: 250 })
  biography: string;

  @ApiProperty({
    example: '1550-2-18',
  })
  @IsDate()
  @Column()
  birthday: Date;

  @OneToMany(() => Book, (book) => book.author)
  books?: Book[];
}
