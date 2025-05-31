import {
  ForbiddenException,
  Injectable
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  )
     {}

  async signup(dto: AuthDto) {
    const hashedPassword = await argon.hash(dto.password);

    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
        },
      });

      // remove password before returning
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;

    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error; // rethrow unexpected errors
    }
  }

  async signin(dto: AuthDto) {

    try {
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
            }); 
        if (!user) {    
            throw new ForbiddenException('Credentials incorrect');
            }

        const passwordMatches = await argon.verify(user.password, dto.password);

        if (!passwordMatches) {
            throw new ForbiddenException('Credentials incorrect');
        }

        const { password, ...userWithoutPassword } = user;
        return this.signToken(user.id, user.email)

    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                throw new ForbiddenException('Credentials incorrect');
            }
        }
        console.error('Unexpected error during signin:', error);
        throw error; // rethrow unexpected errors
    }
    
  }

  async signToken(userId: number, email: string): Promise<{access_token: string}> {
    const payload = { sub: userId, email };

    const secret = this.config.get<string>('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '1h', // Token expiration time
      secret: secret,
    });

    return {
      access_token: token,
    }
  }
}
