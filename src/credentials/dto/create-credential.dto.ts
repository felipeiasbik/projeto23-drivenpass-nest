import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCredentialDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Jhon Sites',
    description: 'Credential name.',
  })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'http://www.jhonsites.com',
    description: 'Credential url.',
  })
  url: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'jhonuser',
    description: 'Credential username.',
  })
  credentialsUser: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Jh@n10#trt',
    description: 'Credential pass.',
  })
  credentialsPass: string;
}
