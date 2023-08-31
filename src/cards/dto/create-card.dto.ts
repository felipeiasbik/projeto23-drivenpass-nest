import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCardDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  cardNumber: string;

  @IsString()
  @IsNotEmpty()
  cardName: string;

  @IsString()
  @IsNotEmpty()
  cardCvv: string;

  @IsString()
  @IsNotEmpty()
  cardExpiration: string;

  @IsString()
  @IsNotEmpty()
  cardPass: string;

  @IsBoolean()
  @IsNotEmpty()
  virtualCard: boolean;

  @IsNumber()
  @IsNotEmpty()
  cardTypeId: number;
}
