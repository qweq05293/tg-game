import { ApiProperty } from "@nestjs/swagger";
export class TelegramUserDto {
  @ApiProperty()
  id!: number;
  @ApiProperty()
  first_name!: string;
  @ApiProperty({ required: false })
  last_name?: string;
  @ApiProperty({ required: false })
  username?: string;
  @ApiProperty({ required: false })
  language_code?: string;
}
export class TelegramLoginResponseDto {
  @ApiProperty()
  token!: string;

  @ApiProperty({ type: TelegramUserDto })
  user!: TelegramUserDto;
}
