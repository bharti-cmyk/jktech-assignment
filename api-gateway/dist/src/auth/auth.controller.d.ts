import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        message: string;
        access_token: string;
    }>;
    create(createUserDto: CreateUserDto): Promise<import("./dto/register.dto").RegisterDto>;
    findAllUser(): Promise<import("../users/users.entity").UserEntity[]>;
    findOneUser(id: number): Promise<import("../users/users.entity").UserEntity | null>;
    deleteUser(id: number): Promise<"User deleted successfully" | undefined>;
}
