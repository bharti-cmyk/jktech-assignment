export declare class LoginDto {
    username: string;
    password: string;
}
export declare class LoginResponseDto {
    access_token: string;
}
export declare class LoginErrorResponseDto {
    statusCode: number;
    message: string;
    error: string;
}
