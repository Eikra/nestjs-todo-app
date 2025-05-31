// src/user/user.module.ts
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from '../prisma/prisma.module'; // import PrismaModule

@Module({
  imports: [PrismaModule], // add this line
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
