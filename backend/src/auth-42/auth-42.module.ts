// auth-42/auth-42.module.ts
import { Module } from '@nestjs/common';
import { FortyTwoStrategy } from './auth-42.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';


@Module({
    imports: [UserModule],
    providers: [FortyTwoStrategy, AuthService, UserService],
    controllers: [AuthController],
})
export class Auth42Module {}

