import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<import("./users.entity").UserEntity[]>;
    findOne(id: number): Promise<import("./users.entity").UserEntity | null>;
    remove(id: number): Promise<void>;
}
