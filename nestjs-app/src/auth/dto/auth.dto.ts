import { 
  IsEmail, 
  IsNotEmpty, 
  IsString, 
  MinLength, 
  IsDefined 
} from 'class-validator';

export class AuthDto {
  @IsDefined({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be valid' })
  @IsNotEmpty({ message: 'Email must not be empty' })
  email: string;

  @IsDefined({ message: 'Password is required' })
  @IsString()
  @MinLength(3, { message: 'Password must be at least 3 characters' })
  @IsNotEmpty({ message: 'Password must not be empty' })
  password: string;
}
