import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateToDoDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

}