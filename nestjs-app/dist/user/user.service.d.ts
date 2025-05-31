import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto/edit-user.dto';
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    editUser(userId: number, dto: EditUserDto): Promise<any>;
}
