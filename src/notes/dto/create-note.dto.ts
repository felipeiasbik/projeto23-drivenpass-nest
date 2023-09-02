import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Marcar médico',
    description: 'Note name.',
  })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Lembrar de marcar médico na próxima semana.',
    description: 'Note description.',
  })
  text: string;
}
