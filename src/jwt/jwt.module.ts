import { Module } from '@nestjs/common';
import { JwtModule as BaseJwtModule } from '@nestjs/jwt';
import { JwtService } from './jwt.service';
import { ConfigModule } from '@nestjs/config';


@Module({
    imports: [
        BaseJwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions:{
                issuer: process.env.DOMAIN,
            }
        }),
        ConfigModule
    ],
    exports: [JwtService],
    providers: [JwtService],
})
export class JwtModule {}
