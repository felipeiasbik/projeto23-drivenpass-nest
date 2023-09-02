import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsStrongPassword } from 'class-validator';

export class EraseUserDto {
  @IsStrongPassword({ minLength: 10 })
  @IsNotEmpty()
  @ApiProperty({
    example: 'Senh@F@rt1',
    description: 'User password.',
  })
  password: string;
}
