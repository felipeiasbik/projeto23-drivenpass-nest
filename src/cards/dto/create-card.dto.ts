import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCardDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Mastercard Jhon',
    description: 'Card name.',
  })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '1111222233334444',
    description: 'Card number.',
  })
  cardNumber: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Jhon Decon',
    description: 'Card number.',
  })
  cardName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '987',
    description: 'CVV',
  })
  cardCvv: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '1029',
    description: 'Date card expiration',
  })
  cardExpiration: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '102030',
    description: 'Card pass.',
  })
  cardPass: string;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: 'true',
    description: 'Card is physical (false) or virtual (true).',
  })
  virtualCard: boolean;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: '1',
    description: 'Card is "Crédito" (1), "Débito"(2) ou ambos (3).',
  })
  cardTypeId: number;
}
