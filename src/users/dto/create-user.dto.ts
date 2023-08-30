import { IsEmail, IsNotEmpty } from 'class-validator';
import { IsStrongPass } from '../../../decorators/password.decorator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsStrongPass()
  password: string;
}
