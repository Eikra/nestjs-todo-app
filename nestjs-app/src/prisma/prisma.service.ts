import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient{
constructor(private configService: ConfigService) {
    super({
        datasources: {
            db: {
                url: configService.get<string>('DATABASE_URL'),
            },
        },
    });
    // console.log(config);

}
    cleanDb(){
        return this.$transaction([
            this.toDo.deleteMany(),
            this.user.deleteMany(),
        ]);

    }

}
