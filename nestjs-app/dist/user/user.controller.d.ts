import { User } from 'generated/prisma';
import { EditUserDto } from './dto/edit-user.dto';
import { UserService } from './user.service';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    getMe(user: User): {
        id: number;
        firstName: string | null;
        lastName: string | null;
        createdAt: Date;
        updatedAt: Date;
    };
    editUser(userId: number, dto: EditUserDto): Promise<any>;
}
