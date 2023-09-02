import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCardTypeDto {
  @IsString()
  @IsNotEmpty()
  type: string;
}
