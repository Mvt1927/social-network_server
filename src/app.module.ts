import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { config } from './config';
import { validationSchema } from './config/config.schema';
import { CommonService } from './common/common.service';
import { CommonModule } from './common/common.module';
import { JwtModule } from './jwt/jwt.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: validationSchema,
      load: [config],
      envFilePath: [`.env${process.env.NODE_ENV ? '.' + process.env.NODE_ENV : ''}`],
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    CommonModule,
    JwtModule,
  ],
  controllers: [AppController],
  providers: [AppService, CommonService],
})
export class AppModule {}
