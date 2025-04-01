"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginErrorResponseDto = exports.LoginResponseDto = exports.LoginDto = void 0;
class LoginDto {
    username;
    password;
}
exports.LoginDto = LoginDto;
class LoginResponseDto {
    access_token;
}
exports.LoginResponseDto = LoginResponseDto;
class LoginErrorResponseDto {
    statusCode;
    message;
    error;
}
exports.LoginErrorResponseDto = LoginErrorResponseDto;
//# sourceMappingURL=login.dto.js.map