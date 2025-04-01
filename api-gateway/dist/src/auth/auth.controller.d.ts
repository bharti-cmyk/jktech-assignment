import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        message: string;
        access_token: string;
    }>;
    create(createUserDto: any): Promise<import("./dto/register.dto").RegisterDto>;
    findAll(): Promise<import("../users/users.entity").UserEntity[]>;
    findOne(id: number): Promise<import("../users/users.entity").UserEntity | null>;
    remove(id: number): Promise<void>;
}
