import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: 'jhon@jhon.com',
    description: 'User registration email.',
  })
  email: string;

  @IsStrongPassword({
    minLength: 10,
  })
  @ApiProperty({
    example: 'Senh@F@rt1',
    description:
      'Password with a minimum of 10 characters, containing uppercase and lowercase letters, symbol and number.',
  })
  password: string;

  constructor(params?: Partial<CreateUserDto>) {
    if (params) Object.assign(this, params);
  }
}
