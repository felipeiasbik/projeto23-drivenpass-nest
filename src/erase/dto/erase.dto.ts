import { IsNotEmpty, IsStrongPassword } from 'class-validator';

export class EraseUserDto {
  @IsStrongPassword({ minLength: 10 })
  @IsNotEmpty()
  password: string;
}
