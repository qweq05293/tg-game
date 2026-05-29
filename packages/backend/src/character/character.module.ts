import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthModule } from "../auth/auth.module";
import { PrismaModule } from "../prisma/prisma.module"; // Укажите ваш правильный путь к PrismaModule
import { CharacterController } from "./character.controller";
import { CharacterService } from "./character.service";

@Module({
  imports: [PrismaModule, AuthModule, JwtModule], // Импортируем Prisma, чтобы работал PrismaService внутри CharacterService
  controllers: [CharacterController], // Регистрируем наш новый контроллер со Swagger-типами
  providers: [CharacterService], // Регистрируем сервис с логикой прокачки и прорывов
  exports: [CharacterService], // Экспортируем, если логика персонажа понадобится в других модулях (например, в битвах)
})
export class CharacterModule {}
