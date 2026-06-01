import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthGuard } from "./auth.guard"; // 1. Импортируем AuthGuard
import { AuthService } from "./auth.service";

@Module({
  imports: [
    ConfigModule, // Добавляем в imports самого модуля для чистоты
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>("JWT_SECRET"),
        signOptions: { expiresIn: "1d" },
      }),
    }),
  ],
  providers: [AuthService, AuthGuard], // 2. Добавляем AuthGuard в провайдеры
  controllers: [AuthController],
  exports: [AuthService, JwtModule, AuthGuard], // 3. ОБЯЗАТЕЛЬНО экспортируем их для других модулей!
})
export class AuthModule {}
