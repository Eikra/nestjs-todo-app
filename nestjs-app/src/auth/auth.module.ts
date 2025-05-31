import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtStrategy } from './strategy/jwt.strategy'; // Uncomment if you have a JWT strategy

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: 'jwt-secret-key', // 🔒 you can use env var instead: process.env.JWT_SECRET
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy ,// Uncomment if you have a JWT strategy
],
})
export class AuthModule {}
