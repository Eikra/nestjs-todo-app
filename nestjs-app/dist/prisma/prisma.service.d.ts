import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
export declare class PrismaService extends PrismaClient {
    private configService;
    constructor(configService: ConfigService);
    cleanDb(): Promise<[import(".prisma/client").Prisma.BatchPayload, import(".prisma/client").Prisma.BatchPayload]>;
}
