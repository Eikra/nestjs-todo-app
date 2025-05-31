import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signup(dto: AuthDto): Promise<{
        email: string;
        id: number;
        firstName: string | null;
        lastName: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    signin(dto: AuthDto): Promise<{
        access_token: string;
    }>;
}
