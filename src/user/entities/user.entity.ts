import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User extends BaseEntity {
  @ApiProperty({
    example: 'e2b5ea37-1c02-4bd1-b912-1b09cc08b52c',
  })
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @ApiProperty({
    example: 'William',
  })
  @Column()
  firstName: string;

  @ApiProperty({
    example: 'Shakespeare',
  })
  @Column()
  lastName: string;

  @ApiProperty({
    example: 'williamforever@gmail.com',
  })
  @Column({ nullable: false, unique: true })
  email: string;

  @ApiProperty({
    example: 'williamShakespeare4ever',
  })
  @Column({ nullable: false })
  password: string;

  @Column({ nullable: true })
  refreshToken: string;
}
