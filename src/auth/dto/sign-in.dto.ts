import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
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
