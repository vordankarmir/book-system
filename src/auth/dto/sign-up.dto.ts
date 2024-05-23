import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
  @ApiProperty({
    example: 'William',
  })
  readonly firstName: string;

  @ApiProperty({
    example: 'Shakespeare',
  })
  readonly lastName: string;

  @ApiProperty({
    example: 'williamforever@gmail.com',
    required: true,
  })
  readonly email: string;

  @ApiProperty({
    example: 'williamShakespeare4ever',
    required: true,
  })
  readonly password: string;
}
