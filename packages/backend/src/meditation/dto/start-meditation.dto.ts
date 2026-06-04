import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Max, Min } from "class-validator";

export class StartMeditationDto {
  @ApiProperty({
    example: 4,
    minimum: 1,
    maximum: 8,
    description: "Длительность медитации в часах",
  })
  @IsInt()
  @Min(1)
  @Max(8)
  hours!: number;
}

export class MeditationResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  characterId!: string;

  @ApiProperty()
  duration!: number;

  @ApiProperty()
  rewardExp!: number;

  @ApiProperty({
    example: "ACTIVE",
  })
  status!: string;

  @ApiProperty()
  startedAt!: Date;

  @ApiProperty()
  endsAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
export class MeditationStateResponseDto {
  @ApiProperty()
  active!: boolean;

  @ApiProperty({
    nullable: true,
    type: MeditationResponseDto,
  })
  meditation!: MeditationResponseDto | null;
}
